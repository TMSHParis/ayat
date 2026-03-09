//
//  QuraniWatchComplication.swift
//  QuraniWatchComplication
//
//  Complication cadran Apple Watch — prochaine prière + anneau de progression
//

import WidgetKit
import SwiftUI

// ─────────────────────────────────────────
// MARK: — SharedData (app group partagé)
// ─────────────────────────────────────────

private let appGroupID = "group.com.tmshparis.qurani"

private struct PrayerTimesData {
    let fajr: String
    let sunrise: String
    let dhuhr: String
    let asr: String
    let maghrib: String
    let isha: String
    let date: String
    let timestamp: Date

    static func load() -> PrayerTimesData? {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let dict = defaults.dictionary(forKey: "prayerTimes") else { return nil }
        return PrayerTimesData(
            fajr:      dict["fajr"]      as? String ?? "",
            sunrise:   dict["sunrise"]   as? String ?? "",
            dhuhr:     dict["dhuhr"]     as? String ?? "",
            asr:       dict["asr"]       as? String ?? "",
            maghrib:   dict["maghrib"]   as? String ?? "",
            isha:      dict["isha"]      as? String ?? "",
            date:      dict["date"]      as? String ?? "",
            timestamp: Date(timeIntervalSince1970: dict["timestamp"] as? Double ?? 0)
        )
    }

    private func resolvedPrayers() -> [(name: String, nameAr: String, time: String, date: Date)] {
        let calendar = Calendar.current
        let now = Date()
        let list: [(String, String, String)] = [
            ("Fajr",    "الفجر",  fajr),
            ("Dhuhr",   "الظهر",  dhuhr),
            ("Asr",     "العصر",  asr),
            ("Maghrib", "المغرب", maghrib),
            ("Isha",    "العشاء", isha)
        ]
        return list.compactMap { name, nameAr, time in
            // Nettoie les formats type "05:35 (EET)" — garde uniquement les chiffres en tête de chaque segment
            let parts = time.split(separator: ":").compactMap { part -> Int? in
                let digits = String(part).trimmingCharacters(in: .whitespaces)
                    .prefix(while: { $0.isNumber })
                return Int(digits)
            }
            guard parts.count >= 2 else { return nil }
            var comps = calendar.dateComponents([.year, .month, .day], from: now)
            comps.hour = parts[0]; comps.minute = parts[1]
            guard let d = calendar.date(from: comps) else { return nil }
            return (name, nameAr, time, d)
        }
    }

    func nextPrayer() -> (name: String, nameAr: String, time: String, date: Date)? {
        let now = Date()
        if let next = resolvedPrayers().first(where: { $0.date > now }) { return next }
        // Après Isha → Fajr demain
        let parts = fajr.split(separator: ":").compactMap { part -> Int? in
            Int(String(part).trimmingCharacters(in: .whitespaces).prefix(while: { $0.isNumber }))
        }
        guard parts.count >= 2 else { return nil }
        var comps = Calendar.current.dateComponents([.year, .month, .day], from: now)
        comps.hour = parts[0]; comps.minute = parts[1]
        if let d = Calendar.current.date(from: comps),
           let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: d) {
            return ("Fajr", "الفجر", fajr, tomorrow)
        }
        return nil
    }

    func previousPrayer() -> (name: String, nameAr: String, time: String, date: Date)? {
        let now = Date()
        if let prev = resolvedPrayers().filter({ $0.date <= now }).last { return prev }
        // Avant Fajr → Isha d'hier
        let parts = isha.split(separator: ":").compactMap { part -> Int? in
            Int(String(part).trimmingCharacters(in: .whitespaces).prefix(while: { $0.isNumber }))
        }
        guard parts.count >= 2 else { return nil }
        var comps = Calendar.current.dateComponents([.year, .month, .day], from: now)
        comps.hour = parts[0]; comps.minute = parts[1]
        if let d = Calendar.current.date(from: comps),
           let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: d) {
            return ("Isha", "العشاء", isha, yesterday)
        }
        return nil
    }

    // 0.0 → 1.0 entre prière précédente et prochaine
    var progress: Double {
        guard let prev = previousPrayer(), let next = nextPrayer() else { return 0 }
        let total   = next.date.timeIntervalSince(prev.date)
        let elapsed = Date().timeIntervalSince(prev.date)
        guard total > 0 else { return 0 }
        return min(1.0, max(0.0, elapsed / total))
    }
}

// ─────────────────────────────────────────
// MARK: — Timeline Entry
// ─────────────────────────────────────────

struct PrayerEntry: TimelineEntry {
    let date: Date
    let prayerName: String      // "Maghrib"
    let prayerTime: String      // "18:38"
    let progress: Double        // 0→1 pour l'anneau
    let nextPrayerDate: Date?   // pour calcul countdown
    let showTimer: Bool         // true = countdown, false = heure de prière
    let countdownText: String   // "2h25" ou "45m" — calculé manuellement
}

extension PrayerEntry {
    static let placeholder = PrayerEntry(
        date: Date(),
        prayerName: "Qurani",
        prayerTime: "--:--",
        progress: 0,
        nextPrayerDate: nil,
        showTimer: true,
        countdownText: "--:--"
    )

    /// Calcule le countdown numérique "2h25" ou "45m" ou "3m"
    static func formatCountdown(from now: Date, to target: Date) -> String {
        let diff = target.timeIntervalSince(now)
        guard diff > 0 else { return "0m" }
        let h = Int(diff) / 3600
        let m = (Int(diff) % 3600) / 60
        if h > 0 {
            return "\(h)h\(String(format: "%02d", m))"
        }
        return "\(m)m"
    }
}

// ─────────────────────────────────────────
// MARK: — Timeline Provider
// ─────────────────────────────────────────

struct PrayerTimelineProvider: TimelineProvider {

    func placeholder(in context: Context) -> PrayerEntry { .placeholder }

    func getSnapshot(in context: Context, completion: @escaping (PrayerEntry) -> Void) {
        guard let data = PrayerTimesData.load(), let next = data.nextPrayer() else {
            completion(.placeholder)
            return
        }
        let now = Date()
        completion(PrayerEntry(
            date: now,
            prayerName: next.name,
            prayerTime: String(next.time.prefix(5)),
            progress: data.progress,
            nextPrayerDate: next.date,
            showTimer: true,
            countdownText: PrayerEntry.formatCountdown(from: now, to: next.date)
        ))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerEntry>) -> Void) {
        let now = Date()

        guard let data = PrayerTimesData.load(), let next = data.nextPrayer() else {
            let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: now)!
            completion(Timeline(entries: [.placeholder], policy: .after(refresh)))
            return
        }

        var entries: [PrayerEntry] = []
        let prayerTime = String(next.time.prefix(5))

        // Mettre à jour le countdown toutes les 60s (pendant 10 min)
        for i in 0..<10 {
            let entryDate = now.addingTimeInterval(Double(i) * 60.0)
            if entryDate >= next.date { break }
            entries.append(PrayerEntry(
                date: entryDate,
                prayerName: next.name,
                prayerTime: prayerTime,
                progress: data.progress,
                nextPrayerDate: next.date,
                showTimer: true,
                countdownText: PrayerEntry.formatCountdown(from: entryDate, to: next.date)
            ))
        }

        // Entrée à la prochaine prière (refresh complet)
        entries.append(PrayerEntry(
            date: next.date,
            prayerName: next.name,
            prayerTime: prayerTime,
            progress: 1.0,
            nextPrayerDate: next.date,
            showTimer: false,
            countdownText: "0m"
        ))

        let refresh = Calendar.current.date(byAdding: .minute, value: 1, to: next.date) ?? next.date
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
}

// ─────────────────────────────────────────
// MARK: — Couleurs
// ─────────────────────────────────────────

private let gold    = Color(red: 1.0, green: 0.90, blue: 0.62)
private let goldDim = Color(red: 1.0, green: 0.88, blue: 0.55).opacity(0.55)
private let textMain = Color.white.opacity(0.92)
private let textSub  = Color.white.opacity(0.50)

// ─────────────────────────────────────────
// MARK: — Vue Circulaire ⭕
//
//   Anneau or qui se remplit 0→100%
//   entre la prière précédente et la prochaine.
//   Centre : nom + décompte live en secondes.
// ─────────────────────────────────────────

struct CircularView: View {
    let entry: PrayerEntry

    var body: some View {
        ZStack {
            // Piste de fond (cercle gris clair)
            Circle()
                .stroke(Color.white.opacity(0.12), lineWidth: 4)

            // Anneau de progression en or
            Circle()
                .trim(from: 0, to: CGFloat(entry.progress))
                .stroke(gold, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .rotationEffect(.degrees(-90))

            // Texte centré
            VStack(spacing: 1) {
                Text(entry.prayerName.uppercased())
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)

                // Countdown : "2h25" ou "45m"
                Text(entry.countdownText)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(gold)
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
            }
            .padding(5)
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Vue Rectangulaire ▬
// ─────────────────────────────────────────

struct RectangularView: View {
    let entry: PrayerEntry

    var body: some View {
        HStack(alignment: .center, spacing: 8) {
            // Mini anneau de progression
            Gauge(value: entry.progress, in: 0...1) {
                Image(systemName: "moon.stars.fill")
                    .foregroundColor(gold)
            }
            .gaugeStyle(.accessoryCircularCapacity)
            .tint(gold)
            .frame(width: 36, height: 36)

            VStack(alignment: .leading, spacing: 2) {
                Text(entry.prayerName.uppercased())
                    .font(.system(size: 13, weight: .bold, design: .monospaced))
                    .foregroundColor(textMain)

                // Toujours afficher le countdown (l'heure est déjà à droite)
                Text(entry.countdownText)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(goldDim)
            }

            Spacer()

            Text(entry.prayerTime)
                .font(.system(size: 16, weight: .bold, design: .monospaced))
                .foregroundColor(gold)
        }
        .padding(.horizontal, 2)
    }
}

// ─────────────────────────────────────────
// MARK: — Vue Inline —
// ─────────────────────────────────────────

struct InlineView: View {
    let entry: PrayerEntry
    var body: some View {
        Label {
            Text("\(entry.prayerName) \(entry.prayerTime)")
        } icon: {
            Image(systemName: "moon.stars.fill")
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Vue Corner ↗
// ─────────────────────────────────────────

struct CornerView: View {
    let entry: PrayerEntry
    var body: some View {
        Image(systemName: "moon.stars.fill")
            .foregroundColor(gold)
            .widgetLabel {
                Text(entry.prayerTime)
                    .foregroundColor(gold)
            }
    }
}

// ─────────────────────────────────────────
// MARK: — Entry View dispatcher
// ─────────────────────────────────────────

struct QuraniWatchComplicationEntryView: View {
    var entry: PrayerTimelineProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryCircular:    CircularView(entry: entry)
        case .accessoryRectangular: RectangularView(entry: entry)
        case .accessoryInline:      InlineView(entry: entry)
        case .accessoryCorner:      CornerView(entry: entry)
        default:                    CircularView(entry: entry)
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Widget principal
// ─────────────────────────────────────────

struct QuraniWatchComplication: Widget {
    let kind: String = "QuraniWatchComplication"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            QuraniWatchComplicationEntryView(entry: entry)
                .containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("Qurani")
        .description("Prochaine prière avec compte à rebours.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline,
            .accessoryCorner
        ])
    }
}

// ─────────────────────────────────────────
// MARK: — Previews
// ─────────────────────────────────────────

#Preview("Circulaire", as: .accessoryCircular) {
    QuraniWatchComplication()
} timeline: {
    PrayerEntry.placeholder
}

#Preview("Rectangulaire", as: .accessoryRectangular) {
    QuraniWatchComplication()
} timeline: {
    PrayerEntry.placeholder
}

#Preview("Inline", as: .accessoryInline) {
    QuraniWatchComplication()
} timeline: {
    PrayerEntry.placeholder
}
