//
//  QuraniWatchComplication.swift
//  QuraniWatchComplication
//

import WidgetKit
import SwiftUI

// ─────────────────────────────────────────
// MARK: — SharedData
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
            let parts = time.split(separator: ":").compactMap { part -> Int? in
                Int(String(part).trimmingCharacters(in: .whitespaces).prefix(while: { $0.isNumber }))
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

    var progress: Double {
        guard let prev = previousPrayer(), let next = nextPrayer() else { return 0 }
        let total   = next.date.timeIntervalSince(prev.date)
        let elapsed = Date().timeIntervalSince(prev.date)
        guard total > 0 else { return 0 }
        return min(1.0, max(0.0, elapsed / total))
    }

    // 5 prières avec leur abréviation courte
    var allPrayers: [(short: String, time: String)] {
        [
            ("FJR", String(fajr.prefix(5))),
            ("DHR", String(dhuhr.prefix(5))),
            ("ASR", String(asr.prefix(5))),
            ("MGB", String(maghrib.prefix(5))),
            ("ISH", String(isha.prefix(5)))
        ]
    }

    var nextPrayerName: String { nextPrayer()?.name ?? "" }
    var nextPrayerShort: String {
        switch nextPrayerName {
        case "Fajr":    return "FJR"
        case "Dhuhr":   return "DHR"
        case "Asr":     return "ASR"
        case "Maghrib": return "MGB"
        case "Isha":    return "ISH"
        default:        return ""
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Entry (complication prochaine prière)
// ─────────────────────────────────────────

struct PrayerEntry: TimelineEntry {
    let date: Date
    let prayerName: String
    let prayerTime: String
    let progress: Double
    let nextPrayerDate: Date?
    let showTimer: Bool
    let countdownText: String
}

extension PrayerEntry {
    static let placeholder = PrayerEntry(
        date: Date(), prayerName: "Dhuhr", prayerTime: "--:--",
        progress: 0, nextPrayerDate: nil, showTimer: true, countdownText: "--"
    )

    static func formatCountdown(from now: Date, to target: Date) -> String {
        let diff = target.timeIntervalSince(now)
        guard diff > 0 else { return "0m" }
        let h = Int(diff) / 3600
        let m = (Int(diff) % 3600) / 60
        return h > 0 ? "\(h)h\(String(format: "%02d", m))" : "\(m)m"
    }
}

// ─────────────────────────────────────────
// MARK: — Entry (complication 5 prières)
// ─────────────────────────────────────────

struct AllPrayersEntry: TimelineEntry {
    let date: Date
    let prayers: [(short: String, time: String, isNext: Bool)]
    let progress: Double
}

extension AllPrayersEntry {
    static let placeholder = AllPrayersEntry(date: Date(), prayers: [
        ("FJR", "05:40", false),
        ("DHR", "13:02", true),
        ("ASR", "16:04", false),
        ("MGB", "18:40", false),
        ("ISH", "20:15", false)
    ], progress: 0.45)
}

// ─────────────────────────────────────────
// MARK: — Providers
// ─────────────────────────────────────────

struct PrayerTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerEntry { .placeholder }

    func getSnapshot(in context: Context, completion: @escaping (PrayerEntry) -> Void) {
        guard let data = PrayerTimesData.load(), let next = data.nextPrayer() else {
            completion(.placeholder); return
        }
        let now = Date()
        completion(PrayerEntry(
            date: now, prayerName: next.name,
            prayerTime: String(next.time.prefix(5)),
            progress: data.progress, nextPrayerDate: next.date,
            showTimer: true,
            countdownText: PrayerEntry.formatCountdown(from: now, to: next.date)
        ))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerEntry>) -> Void) {
        let now = Date()
        guard let data = PrayerTimesData.load(), let next = data.nextPrayer() else {
            let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: now)!
            completion(Timeline(entries: [.placeholder], policy: .after(refresh))); return
        }
        var entries: [PrayerEntry] = []
        let prayerTime = String(next.time.prefix(5))
        for i in 0..<10 {
            let entryDate = now.addingTimeInterval(Double(i) * 60.0)
            if entryDate >= next.date { break }
            entries.append(PrayerEntry(
                date: entryDate, prayerName: next.name, prayerTime: prayerTime,
                progress: data.progress, nextPrayerDate: next.date, showTimer: true,
                countdownText: PrayerEntry.formatCountdown(from: entryDate, to: next.date)
            ))
        }
        entries.append(PrayerEntry(
            date: next.date, prayerName: next.name, prayerTime: prayerTime,
            progress: 1.0, nextPrayerDate: next.date, showTimer: false, countdownText: "0m"
        ))
        let refresh = Calendar.current.date(byAdding: .minute, value: 1, to: next.date) ?? next.date
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
}

struct AllPrayersTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> AllPrayersEntry { .placeholder }

    func getSnapshot(in context: Context, completion: @escaping (AllPrayersEntry) -> Void) {
        completion(makeEntry(at: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<AllPrayersEntry>) -> Void) {
        guard let data = PrayerTimesData.load(), let next = data.nextPrayer() else {
            let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
            completion(Timeline(entries: [.placeholder], policy: .after(refresh)))
            return
        }
        let now = Date()
        var entries: [AllPrayersEntry] = []
        for i in 0..<15 {
            let entryDate = now.addingTimeInterval(Double(i) * 60.0)
            if entryDate >= next.date { break }
            entries.append(makeEntry(at: entryDate))
        }
        entries.append(makeEntry(at: next.date))
        let refresh = Calendar.current.date(byAdding: .minute, value: 1, to: next.date) ?? next.date
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }

    private func makeEntry(at date: Date) -> AllPrayersEntry {
        guard let data = PrayerTimesData.load() else { return .placeholder }
        let nextShort = data.nextPrayerShort
        let prayers = data.allPrayers.map { (short: $0.short, time: $0.time, isNext: $0.short == nextShort) }
        return AllPrayersEntry(date: date, prayers: prayers, progress: data.progress)
    }
}

// ─────────────────────────────────────────
// MARK: — Couleurs
// ─────────────────────────────────────────

private let gold     = Color(red: 1.0, green: 0.90, blue: 0.62)
private let goldDim  = Color(red: 1.0, green: 0.88, blue: 0.55).opacity(0.55)
private let textMain = Color.white.opacity(0.92)
private let textSub  = Color.white.opacity(0.50)

// ─────────────────────────────────────────
// MARK: — Vue Circulaire ⭕
// ─────────────────────────────────────────

struct CircularView: View {
    let entry: PrayerEntry

    var body: some View {
        ZStack {
            Circle()
                .stroke(Color.white.opacity(0.12), lineWidth: 4)
            Circle()
                .trim(from: 0, to: CGFloat(entry.progress))
                .stroke(gold, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 1) {
                Text(entry.prayerName.uppercased())
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
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
// MARK: — Vue Rectangulaire ▬ (prochaine prière)
// ─────────────────────────────────────────

struct RectangularView: View {
    let entry: PrayerEntry

    var body: some View {
        HStack(alignment: .center, spacing: 8) {
            Gauge(value: entry.progress, in: 0...1) {
                EmptyView()
            }
            .gaugeStyle(.accessoryCircularCapacity)
            .tint(gold)
            .frame(width: 36, height: 36)

            VStack(alignment: .leading, spacing: 2) {
                Text(entry.prayerName.uppercased())
                    .font(.system(size: 13, weight: .bold, design: .monospaced))
                    .foregroundColor(textMain)
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
// MARK: — Vue 5 Prières en ligne ▬▬▬▬▬
// ─────────────────────────────────────────

struct AllPrayersRowView: View {
    let entry: AllPrayersEntry

    var body: some View {
        VStack(spacing: 4) {
            HStack(spacing: 0) {
                ForEach(Array(entry.prayers.enumerated()), id: \.offset) { _, prayer in
                    VStack(spacing: 2) {
                        Text(prayer.short)
                            .font(.system(size: 8, weight: prayer.isNext ? .bold : .medium, design: .monospaced))
                            .foregroundColor(prayer.isNext ? gold : textSub)
                        Text(prayer.time)
                            .font(.system(size: 10, weight: prayer.isNext ? .bold : .regular, design: .monospaced))
                            .foregroundColor(prayer.isNext ? gold : textSub.opacity(0.8))
                            .minimumScaleFactor(0.7)
                            .lineLimit(1)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color.white.opacity(0.10))
                        .frame(height: 2)
                    Capsule()
                        .fill(gold.opacity(0.75))
                        .frame(width: max(4, geo.size.width * CGFloat(entry.progress)), height: 2)
                }
            }
            .frame(height: 2)
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Vue Inline —
// ─────────────────────────────────────────

struct InlineView: View {
    let entry: PrayerEntry
    var body: some View {
        Text("\(entry.prayerName) \(entry.prayerTime)")
    }
}

// ─────────────────────────────────────────
// MARK: — Vue Corner ↗
// ─────────────────────────────────────────

struct CornerView: View {
    let entry: PrayerEntry
    var body: some View {
        Text(entry.prayerTime)
            .foregroundColor(gold)
            .widgetLabel {
                Text(entry.prayerName)
                    .foregroundColor(gold)
            }
    }
}

// ─────────────────────────────────────────
// MARK: — Entry View dispatchers
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

struct AllPrayersEntryView: View {
    var entry: AllPrayersTimelineProvider.Entry
    var body: some View {
        AllPrayersRowView(entry: entry)
    }
}

// ─────────────────────────────────────────
// MARK: — Widgets
// ─────────────────────────────────────────

struct QuraniWatchComplication: Widget {
    let kind: String = "QuraniWatchComplication"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            QuraniWatchComplicationEntryView(entry: entry)
                .containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("Prochaine prière")
        .description("Prochaine prière avec compte à rebours.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline,
            .accessoryCorner
        ])
    }
}

struct AllPrayersRowComplication: Widget {
    let kind: String = "AllPrayersRowComplication"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: AllPrayersTimelineProvider()) { entry in
            AllPrayersEntryView(entry: entry)
                .containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("5 Prières")
        .description("Les 5 prières sur une ligne.")
        .supportedFamilies([.accessoryRectangular])
    }
}

// ─────────────────────────────────────────
// MARK: — Previews
// ─────────────────────────────────────────

#Preview("Circulaire", as: .accessoryCircular) {
    QuraniWatchComplication()
} timeline: { PrayerEntry.placeholder }

#Preview("Rectangulaire", as: .accessoryRectangular) {
    QuraniWatchComplication()
} timeline: { PrayerEntry.placeholder }

#Preview("5 Prières", as: .accessoryRectangular) {
    AllPrayersRowComplication()
} timeline: { AllPrayersEntry.placeholder }

// ─────────────────────────────────────────
// MARK: — KhatmData (App Group)
// ─────────────────────────────────────────

private struct KhatmData {
    let percent: Double
    static func load() -> KhatmData? {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let dict = defaults.dictionary(forKey: "khatmData"),
              let pct = dict["percent"] as? Double else { return nil }
        return KhatmData(percent: pct)
    }
}

// ─────────────────────────────────────────
// MARK: — PrayerTimesData helpers (Iftar / Qiyam)
// ─────────────────────────────────────────

extension PrayerTimesData {
    private func prayerDate(for timeStr: String, dayOffset: Int = 0) -> Date? {
        let parts = timeStr.split(separator: ":").compactMap { part -> Int? in
            Int(String(part).trimmingCharacters(in: .whitespaces).prefix(while: { $0.isNumber }))
        }
        guard parts.count >= 2 else { return nil }
        var comps = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        comps.hour = parts[0]; comps.minute = parts[1]
        let base = Calendar.current.date(from: comps)
        if dayOffset == 0 { return base }
        return base.flatMap { Calendar.current.date(byAdding: .day, value: dayOffset, to: $0) }
    }

    func iftarInfo() -> (countdown: String, progress: Double) {
        let now = Date()
        guard let maghribDate = prayerDate(for: maghrib) else { return ("--", 0) }
        if now >= maghribDate { return ("0m", 1.0) }
        let countdown = PrayerEntry.formatCountdown(from: now, to: maghribDate)
        let origin = prayerDate(for: asr) ?? maghribDate.addingTimeInterval(-3600)
        let total = maghribDate.timeIntervalSince(origin)
        let elapsed = now.timeIntervalSince(origin)
        return (countdown, total > 0 ? min(1.0, max(0.0, elapsed / total)) : 0)
    }

    func qiyamInfo() -> (countdown: String, progress: Double) {
        let now = Date()
        guard let fajrToday = prayerDate(for: fajr) else { return ("--", 0) }
        let targetFajr = now < fajrToday ? fajrToday : fajrToday.addingTimeInterval(86400)
        let countdown = PrayerEntry.formatCountdown(from: now, to: targetFajr)
        let ishaDate = prayerDate(for: isha) ?? targetFajr.addingTimeInterval(-5400)
        let total = targetFajr.timeIntervalSince(ishaDate)
        let elapsed = now.timeIntervalSince(ishaDate)
        return (countdown, total > 0 ? min(1.0, max(0.0, elapsed / total)) : 0)
    }
}

// ─────────────────────────────────────────
// MARK: — Entries (Iftar / Qiyam / Khatm)
// ─────────────────────────────────────────

struct IftarEntry: TimelineEntry {
    let date: Date; let countdown: String; let progress: Double
    static let placeholder = IftarEntry(date: Date(), countdown: "1h23", progress: 0.6)
}

struct QiyamEntry: TimelineEntry {
    let date: Date; let countdown: String; let progress: Double
    static let placeholder = QiyamEntry(date: Date(), countdown: "3h45", progress: 0.3)
}

struct KhatmEntry: TimelineEntry {
    let date: Date; let percent: Double; let isActive: Bool
    static let placeholder = KhatmEntry(date: Date(), percent: 42, isActive: true)
}

// ─────────────────────────────────────────
// MARK: — Providers (Iftar / Qiyam / Khatm)
// ─────────────────────────────────────────

struct IftarTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> IftarEntry { .placeholder }
    func getSnapshot(in context: Context, completion: @escaping (IftarEntry) -> Void) { completion(make(at: Date())) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<IftarEntry>) -> Void) {
        let now = Date()
        let entries = (0..<15).map { i in make(at: now.addingTimeInterval(Double(i) * 60)) }
        let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: now) ?? now
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
    private func make(at date: Date) -> IftarEntry {
        guard let d = PrayerTimesData.load() else { return .placeholder }
        let info = d.iftarInfo()
        return IftarEntry(date: date, countdown: info.countdown, progress: info.progress)
    }
}

struct QiyamTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> QiyamEntry { .placeholder }
    func getSnapshot(in context: Context, completion: @escaping (QiyamEntry) -> Void) { completion(make(at: Date())) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<QiyamEntry>) -> Void) {
        let now = Date()
        let entries = (0..<15).map { i in make(at: now.addingTimeInterval(Double(i) * 60)) }
        let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: now) ?? now
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
    private func make(at date: Date) -> QiyamEntry {
        guard let d = PrayerTimesData.load() else { return .placeholder }
        let info = d.qiyamInfo()
        return QiyamEntry(date: date, countdown: info.countdown, progress: info.progress)
    }
}

struct KhatmTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> KhatmEntry { .placeholder }
    func getSnapshot(in context: Context, completion: @escaping (KhatmEntry) -> Void) { completion(make()) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<KhatmEntry>) -> Void) {
        let refresh = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
        completion(Timeline(entries: [make()], policy: .after(refresh)))
    }
    private func make() -> KhatmEntry {
        if let k = KhatmData.load(), k.percent > 0 { return KhatmEntry(date: Date(), percent: k.percent, isActive: true) }
        return KhatmEntry(date: Date(), percent: 0, isActive: false)
    }
}

// ─────────────────────────────────────────
// MARK: — Vues (Iftar / Qiyam / Khatm / CountdownBar)
// ─────────────────────────────────────────

private struct RingView: View {
    let progress: Double; let label: String; let value: String
    var body: some View {
        ZStack {
            Circle().stroke(Color.white.opacity(0.12), lineWidth: 3)
            Circle()
                .trim(from: 0, to: CGFloat(progress))
                .stroke(gold, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 1) {
                Text(label)
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundColor(textSub)
                Text(value)
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(gold)
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)
            }.padding(5)
        }
    }
}

struct IftarView: View {
    let entry: IftarEntry
    var body: some View { RingView(progress: entry.progress, label: "IFTAR", value: entry.countdown) }
}

struct QiyamView: View {
    let entry: QiyamEntry
    var body: some View { RingView(progress: entry.progress, label: "QIYAM", value: entry.countdown) }
}

struct KhatmView: View {
    let entry: KhatmEntry
    var body: some View { RingView(progress: entry.percent / 100.0, label: "KHATM", value: entry.isActive ? "\(Int(entry.percent))%" : "--") }
}

struct CountdownBarView: View {
    let entry: PrayerEntry
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(entry.prayerName.uppercased())
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundColor(textSub)
            Text(entry.countdownText)
                .font(.system(size: 24, weight: .bold, design: .monospaced))
                .foregroundColor(gold)
                .minimumScaleFactor(0.5)
                .lineLimit(1)
            Spacer()
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.white.opacity(0.10)).frame(height: 2)
                    Capsule().fill(gold.opacity(0.75))
                        .frame(width: max(4, geo.size.width * CGFloat(entry.progress)), height: 2)
                }
            }.frame(height: 2)
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Widgets (Iftar / Qiyam / Khatm / CountdownBar)
// ─────────────────────────────────────────

struct IftarComplication: Widget {
    let kind = "IftarComplication"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: IftarTimelineProvider()) { entry in
            IftarView(entry: entry).containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("Iftar")
        .description("Compte à rebours jusqu'à la rupture du jeûne.")
        .supportedFamilies([.accessoryCircular])
    }
}

struct QiyamComplication: Widget {
    let kind = "QiyamComplication"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: QiyamTimelineProvider()) { entry in
            QiyamView(entry: entry).containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("Qiyam / Fajr")
        .description("Temps restant avant Fajr pour le Qiyam.")
        .supportedFamilies([.accessoryCircular])
    }
}

struct KhatmComplication: Widget {
    let kind = "KhatmComplication"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: KhatmTimelineProvider()) { entry in
            KhatmView(entry: entry).containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("Khatm")
        .description("Progression de votre lecture du Coran.")
        .supportedFamilies([.accessoryCircular])
    }
}

struct CountdownBarComplication: Widget {
    let kind = "CountdownBarComplication"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimelineProvider()) { entry in
            CountdownBarView(entry: entry).containerBackground(.black.opacity(0.55), for: .widget)
        }
        .configurationDisplayName("Countdown Prière")
        .description("Prochaine prière avec countdown et barre de progression.")
        .supportedFamilies([.accessoryRectangular])
    }
}

// ─────────────────────────────────────────
// MARK: — Previews supplémentaires
// ─────────────────────────────────────────

#Preview("Iftar", as: .accessoryCircular) {
    IftarComplication()
} timeline: { IftarEntry.placeholder }

#Preview("Qiyam", as: .accessoryCircular) {
    QiyamComplication()
} timeline: { QiyamEntry.placeholder }

#Preview("Khatm", as: .accessoryCircular) {
    KhatmComplication()
} timeline: { KhatmEntry.placeholder }

#Preview("Countdown Bar", as: .accessoryRectangular) {
    CountdownBarComplication()
} timeline: { PrayerEntry.placeholder }
