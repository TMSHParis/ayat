import WidgetKit
import SwiftUI

struct NextPrayerEntry: TimelineEntry {
    let date: Date
    let prayerName: String
    let prayerNameAr: String
    let prayerTime: String
    let prayerDate: Date?
    let isPlaceholder: Bool
}

struct NextPrayerProvider: TimelineProvider {
    func placeholder(in context: Context) -> NextPrayerEntry {
        NextPrayerEntry(date: Date(), prayerName: "Dhuhr", prayerNameAr: "الظهر", prayerTime: "12:30", prayerDate: nil, isPlaceholder: true)
    }

    func getSnapshot(in context: Context, completion: @escaping (NextPrayerEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NextPrayerEntry>) -> Void) {
        let entry = makeEntry()
        // Refresh at prayer time so the widget updates to the next prayer immediately
        let nextUpdate: Date
        if let prayerDate = entry.prayerDate {
            // Refresh 1 minute after the prayer time
            nextUpdate = prayerDate.addingTimeInterval(60)
        } else {
            nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
        }
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }

    private func makeEntry() -> NextPrayerEntry {
        guard let data = PrayerTimesData.load(),
              let next = data.nextPrayer() else {
            return NextPrayerEntry(date: Date(), prayerName: "--", prayerNameAr: "", prayerTime: "--:--", prayerDate: nil, isPlaceholder: false)
        }
        return NextPrayerEntry(date: Date(), prayerName: next.name, prayerNameAr: next.nameAr, prayerTime: String(next.time.prefix(5)), prayerDate: next.date, isPlaceholder: false)
    }
}

// MARK: - Home Screen (systemSmall)

struct NextPrayerWidgetView: View {
    var entry: NextPrayerEntry

    private let gold = Color(red: 1.0, green: 0.90, blue: 0.62)

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Image(systemName: "moon.stars.fill")
                .font(.caption)
                .foregroundColor(gold)
            Spacer()
            Text(entry.prayerNameAr)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white.opacity(0.92))
                .minimumScaleFactor(0.7)
            Text(entry.prayerName)
                .font(.caption)
                .foregroundColor(.white.opacity(0.5))
            HStack(spacing: 6) {
                // Heure de prière
                Text(entry.prayerTime)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(gold)
                // Countdown live
                if let prayerDate = entry.prayerDate, prayerDate > Date() {
                    Text("·")
                        .foregroundColor(.white.opacity(0.3))
                    Text(prayerDate, style: .relative)
                        .font(.caption)
                        .foregroundColor(gold.opacity(0.7))
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
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
        HStack(spacing: 6) {
            Image(systemName: "moon.stars.fill")
                .font(.title3)
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.prayerName)
                    .font(.headline)
                    .fontWeight(.bold)
                Text(entry.prayerTime)
                    .font(.system(.body, design: .monospaced))
                    .fontWeight(.semibold)
            }
            Spacer()
            Text(entry.prayerNameAr)
                .font(.title3)
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
            switch WidgetFamily(rawValue: entry.date.hashValue) {
            default:
                NextPrayerAdaptiveView(entry: entry)
            }
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

// MARK: - Adaptive View (dispatches by family)

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
