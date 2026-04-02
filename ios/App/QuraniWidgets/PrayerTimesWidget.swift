import WidgetKit
import SwiftUI

struct PrayerTimesEntry: TimelineEntry {
    let date: Date
    let prayers: [(name: String, nameAr: String, time: String)]
    let nextPrayerName: String?
    let isPlaceholder: Bool
}

struct PrayerTimesProvider: TimelineProvider {
    func placeholder(in context: Context) -> PrayerTimesEntry {
        PrayerTimesEntry(
            date: Date(),
            prayers: [
                ("Fajr", "الفجر", "05:30"),
                ("Shourouq", "الشروق", "07:00"),
                ("Dhuhr", "الظهر", "12:30"),
                ("Asr", "العصر", "15:45"),
                ("Maghrib", "المغرب", "18:15"),
                ("Isha", "العشاء", "19:45")
            ],
            nextPrayerName: "Dhuhr",
            isPlaceholder: true
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (PrayerTimesEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerTimesEntry>) -> Void) {
        let entry = makeEntry()
        // Refresh at next prayer time so highlighted prayer updates immediately
        let nextUpdate: Date
        if let data = PrayerTimesData.load(), let next = data.nextPrayer() {
            nextUpdate = next.date.addingTimeInterval(60)
        } else {
            nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
        }
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }

    private func makeEntry() -> PrayerTimesEntry {
        guard let data = PrayerTimesData.load() else {
            return PrayerTimesEntry(date: Date(), prayers: [], nextPrayerName: nil, isPlaceholder: false)
        }
        let next = data.nextPrayer()
        return PrayerTimesEntry(
            date: Date(),
            prayers: data.prayers.map { ($0.name, $0.nameAr, String($0.time.prefix(5))) },
            nextPrayerName: next?.name,
            isPlaceholder: false
        )
    }
}

// MARK: - Home Screen (systemMedium)

struct PrayerTimesWidgetView: View {
    var entry: PrayerTimesEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            let gold = Color(red: 1.0, green: 0.90, blue: 0.62)
            HStack {
                Image(systemName: "moon.stars.fill")
                    .font(.caption2)
                    .foregroundColor(gold)
                Text("Horaires de pri\u{00e8}re")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.white.opacity(0.5))
                Spacer()
            }
            .padding(.bottom, 2)

            if entry.prayers.isEmpty {
                Text("Horaires non chargés")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.5))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ForEach(Array(entry.prayers.enumerated()), id: \.offset) { index, prayer in
                    let isNext = prayer.name == entry.nextPrayerName
                    HStack {
                        Text(prayer.name)
                            .font(.caption)
                            .fontWeight(isNext ? .bold : .regular)
                            .foregroundColor(isNext ? gold : .white.opacity(0.6))
                        Spacer()
                        Text(prayer.time)
                            .font(.caption)
                            .fontWeight(isNext ? .bold : .regular)
                            .foregroundColor(isNext ? gold : .white.opacity(0.7))
                    }
                    .padding(.vertical, 1)
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

// MARK: - Lock Screen Rectangular (compact 5 prayers)

struct PrayerTimesRectangularView: View {
    var entry: PrayerTimesEntry

    var body: some View {
        // Filter out Shourouq for lock screen — only the 5 salawat
        let salawat = entry.prayers.filter { $0.name != "Shourouq" }
        VStack(alignment: .leading, spacing: 1) {
            ForEach(Array(salawat.enumerated()), id: \.offset) { _, prayer in
                let isNext = prayer.name == entry.nextPrayerName
                HStack {
                    Text(prayer.name)
                        .font(.system(size: 10))
                        .fontWeight(isNext ? .bold : .regular)
                    Spacer()
                    Text(prayer.time)
                        .font(.system(size: 10, design: .monospaced))
                        .fontWeight(isNext ? .bold : .regular)
                }
                .opacity(isNext ? 1.0 : 0.6)
            }
        }
        .containerBackground(for: .widget) { Color.clear }
    }
}

// MARK: - Widget

struct PrayerTimesWidget: Widget {
    let kind: String = "PrayerTimesWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimesProvider()) { entry in
            PrayerTimesAdaptiveView(entry: entry)
        }
        .configurationDisplayName("Horaires de pri\u{00e8}re")
        .description("Affiche les horaires des 5 pri\u{00e8}res et Shourouq.")
        .supportedFamilies([
            .systemMedium,
            .accessoryRectangular
        ])
    }
}

struct PrayerTimesAdaptiveView: View {
    var entry: PrayerTimesEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .accessoryRectangular:
            PrayerTimesRectangularView(entry: entry)
        default:
            PrayerTimesWidgetView(entry: entry)
        }
    }
}
