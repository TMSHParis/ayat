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
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
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

struct PrayerTimesWidgetView: View {
    var entry: PrayerTimesEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack {
                Image(systemName: "moon.stars.fill")
                    .font(.caption2)
                    .foregroundColor(.orange)
                Text("Horaires de pri\u{00e8}re")
                    .font(.caption2)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
                Spacer()
            }
            .padding(.bottom, 2)

            if entry.prayers.isEmpty {
                Text("Ouvrez Qurani pour charger les horaires")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ForEach(Array(entry.prayers.enumerated()), id: \.offset) { index, prayer in
                    let isNext = prayer.name == entry.nextPrayerName
                    HStack(spacing: 4) {
                        Text(prayer.nameAr)
                            .font(.caption2)
                            .frame(width: 40, alignment: .trailing)
                            .foregroundColor(isNext ? .orange : .primary)
                        Text(prayer.name)
                            .font(.caption2)
                            .foregroundColor(isNext ? .orange : .secondary)
                            .frame(width: 60, alignment: .leading)
                        Spacer()
                        Text(prayer.time)
                            .font(.caption)
                            .fontWeight(isNext ? .bold : .regular)
                            .foregroundColor(isNext ? .orange : .primary)
                    }
                    .padding(.vertical, 1)
                    if isNext {
                        Rectangle()
                            .fill(Color.orange.opacity(0.15))
                            .frame(height: 0)
                    }
                }
            }
        }
        .padding()
        .containerBackground(for: .widget) {
            Color(.systemBackground)
        }
    }
}

struct PrayerTimesWidget: Widget {
    let kind: String = "PrayerTimesWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: PrayerTimesProvider()) { entry in
            PrayerTimesWidgetView(entry: entry)
        }
        .configurationDisplayName("Horaires de pri\u{00e8}re")
        .description("Affiche les horaires des 5 pri\u{00e8}res et Shourouq.")
        .supportedFamilies([.systemMedium])
    }
}
