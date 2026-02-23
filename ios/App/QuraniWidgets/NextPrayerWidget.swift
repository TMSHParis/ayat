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
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
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

struct NextPrayerWidgetView: View {
    var entry: NextPrayerEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Image(systemName: "moon.stars.fill")
                    .font(.caption)
                    .foregroundColor(.orange)
                Text("Qurani")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Text(entry.prayerNameAr)
                .font(.title2)
                .fontWeight(.bold)
                .minimumScaleFactor(0.7)
            Text(entry.prayerName)
                .font(.caption)
                .foregroundColor(.secondary)
            HStack {
                Image(systemName: "clock.fill")
                    .font(.caption2)
                    .foregroundColor(.orange)
                Text(entry.prayerTime)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.orange)
            }
        }
        .padding()
        .containerBackground(for: .widget) {
            Color(.systemBackground)
        }
    }
}

struct NextPrayerWidget: Widget {
    let kind: String = "NextPrayerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NextPrayerProvider()) { entry in
            NextPrayerWidgetView(entry: entry)
        }
        .configurationDisplayName("Prochaine pri\u{00e8}re")
        .description("Affiche la prochaine pri\u{00e8}re et son horaire.")
        .supportedFamilies([.systemSmall])
    }
}
