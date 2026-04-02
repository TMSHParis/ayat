import WidgetKit
import SwiftUI

struct NextPrayerEntry: TimelineEntry {
    let date: Date
    let prayerName: String
    let prayerNameAr: String
    let prayerTime: String
    let prayerDate: Date?
    let isPlaceholder: Bool
    let progress: Double
    let countdownText: String
}

struct NextPrayerProvider: TimelineProvider {
    func placeholder(in context: Context) -> NextPrayerEntry {
        NextPrayerEntry(date: Date(), prayerName: "Dhuhr", prayerNameAr: "الظهر", prayerTime: "12:30", prayerDate: nil, isPlaceholder: true, progress: 0.45, countdownText: "dans 1h30")
    }

    private static func formatCountdown(from now: Date, to target: Date) -> String {
        let diff = target.timeIntervalSince(now)
        guard diff > 0 else { return "" }
        let h = Int(diff) / 3600
        let m = (Int(diff) % 3600) / 60
        return h > 0 ? "dans \(h)h\(String(format: "%02d", m))" : "dans \(m) min"
    }

    func getSnapshot(in context: Context, completion: @escaping (NextPrayerEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NextPrayerEntry>) -> Void) {
        let base = makeEntry()
        guard let prayerDate = base.prayerDate else {
            let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
            completion(Timeline(entries: [base], policy: .after(refresh)))
            return
        }
        // Génère des entrées toutes les minutes pour mettre à jour le countdown
        var entries: [NextPrayerEntry] = []
        let now = Date()
        for i in 0..<15 {
            let entryDate = now.addingTimeInterval(Double(i) * 60.0)
            if entryDate >= prayerDate { break }
            entries.append(NextPrayerEntry(
                date: entryDate,
                prayerName: base.prayerName,
                prayerNameAr: base.prayerNameAr,
                prayerTime: base.prayerTime,
                prayerDate: prayerDate,
                isPlaceholder: false,
                progress: base.progress,
                countdownText: NextPrayerProvider.formatCountdown(from: entryDate, to: prayerDate)
            ))
        }
        if entries.isEmpty { entries.append(base) }
        let refresh = prayerDate.addingTimeInterval(60)
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }

    private func makeEntry() -> NextPrayerEntry {
        guard let data = PrayerTimesData.load(),
              let next = data.nextPrayer() else {
            return NextPrayerEntry(date: Date(), prayerName: "--", prayerNameAr: "", prayerTime: "--:--", prayerDate: nil, isPlaceholder: false, progress: 0, countdownText: "")
        }

        // Calculate progress: elapsed time between previous prayer and next prayer
        let now = Date()
        let calendar = Calendar.current
        let prayerTimes = [data.fajr, data.dhuhr, data.asr, data.maghrib, data.isha]
        var prevDate: Date? = nil
        for time in prayerTimes.reversed() {
            let parts = time.split(separator: ":").compactMap { Int($0) }
            guard parts.count >= 2 else { continue }
            var comps = calendar.dateComponents([.year, .month, .day], from: now)
            comps.hour = parts[0]
            comps.minute = parts[1]
            if let d = calendar.date(from: comps), d <= now {
                prevDate = d
                break
            }
        }
        var progress: Double = 0
        if let prev = prevDate {
            let total = next.date.timeIntervalSince(prev)
            let elapsed = now.timeIntervalSince(prev)
            if total > 0 { progress = min(1.0, max(0, elapsed / total)) }
        }

        return NextPrayerEntry(
            date: now,
            prayerName: next.name,
            prayerNameAr: next.nameAr,
            prayerTime: String(next.time.prefix(5)),
            prayerDate: next.date,
            isPlaceholder: false,
            progress: progress,
            countdownText: NextPrayerProvider.formatCountdown(from: now, to: next.date)
        )
    }
}

// MARK: - Home Screen (systemSmall)

struct NextPrayerWidgetView: View {
    var entry: NextPrayerEntry

    private let gold = Color(red: 1.0, green: 0.90, blue: 0.62)

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Nom de la prière seul en titre
            Text(entry.prayerName)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white.opacity(0.92))
                .minimumScaleFactor(0.7)
                .frame(maxWidth: .infinity, alignment: .leading)

            Spacer()

            // Barre de progression
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color.white.opacity(0.12))
                        .frame(height: 3)
                    Capsule()
                        .fill(gold.opacity(0.85))
                        .frame(width: max(6, geo.size.width * CGFloat(entry.progress)), height: 3)
                }
            }
            .frame(height: 3)
            .padding(.bottom, 6)

            // Heure + countdown en bas
            HStack(alignment: .firstTextBaseline) {
                Text(entry.prayerTime)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(gold)
                Spacer()
                if !entry.countdownText.isEmpty {
                    Text(entry.countdownText)
                        .font(.caption)
                        .foregroundColor(gold.opacity(0.7))
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                }
            }
        }
        .padding()
        .containerBackground(for: .widget) {
            Image("PrayerBg")
                .resizable()
                .aspectRatio(contentMode: .fill)
        }
    }
}

// MARK: - Lock Screen Circular

struct NextPrayerCircularView: View {
    var entry: NextPrayerEntry

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            VStack(spacing: 1) {
                Image(systemName: "moon.stars.fill")
                    .font(.system(size: 10))
                Text(entry.prayerTime)
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .minimumScaleFactor(0.6)
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

// MARK: - Lock Screen Rectangular

struct NextPrayerRectangularView: View {
    var entry: NextPrayerEntry

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "moon.stars.fill")
                .font(.title3)
            Text(entry.prayerName)
                .font(.headline)
                .fontWeight(.bold)
            Spacer()
            Text(entry.prayerTime)
                .font(.system(.body, design: .monospaced))
                .fontWeight(.semibold)
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

// MARK: - Lock Screen Inline

struct NextPrayerInlineView: View {
    var entry: NextPrayerEntry

    var body: some View {
        Label {
            Text("\(entry.prayerName) \(entry.prayerTime)")
        } icon: {
            Image(systemName: "moon.stars.fill")
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

// MARK: - Widget

struct NextPrayerWidget: Widget {
    let kind: String = "NextPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NextPrayerProvider()) { entry in
            NextPrayerAdaptiveView(entry: entry)
        }
        .configurationDisplayName("Prochaine pri\u{00e8}re")
        .description("Affiche la prochaine pri\u{00e8}re et son horaire.")
        .supportedFamilies([
            .systemSmall,
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline
        ])
    }
}

// MARK: - Adaptive View

struct NextPrayerAdaptiveView: View {
    var entry: NextPrayerEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryCircular:
            NextPrayerCircularView(entry: entry)
        case .accessoryRectangular:
            NextPrayerRectangularView(entry: entry)
        case .accessoryInline:
            NextPrayerInlineView(entry: entry)
        default:
            NextPrayerWidgetView(entry: entry)
        }
    }
}
