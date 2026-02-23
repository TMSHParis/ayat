import WidgetKit
import SwiftUI

struct VerseEntry: TimelineEntry {
    let date: Date
    let verseText: String
    let surahName: String
    let surah: Int
    let ayah: Int
    let isPlaceholder: Bool
}

struct VerseProvider: TimelineProvider {
    func placeholder(in context: Context) -> VerseEntry {
        VerseEntry(date: Date(), verseText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", surahName: "الفاتحة", surah: 1, ayah: 1, isPlaceholder: true)
    }

    func getSnapshot(in context: Context, completion: @escaping (VerseEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<VerseEntry>) -> Void) {
        let entry = makeEntry()
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date()
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }

    private func makeEntry() -> VerseEntry {
        guard let data = VerseData.load(), !data.text.isEmpty else {
            return VerseEntry(date: Date(), verseText: "", surahName: "", surah: 0, ayah: 0, isPlaceholder: false)
        }
        return VerseEntry(date: Date(), verseText: data.text, surahName: data.surahName, surah: data.surah, ayah: data.ayah, isPlaceholder: false)
    }
}

struct VerseWidgetView: View {
    var entry: VerseEntry

    var body: some View {
        VStack(alignment: .center, spacing: 4) {
            if entry.verseText.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "book.fill")
                        .font(.title3)
                        .foregroundColor(.orange)
                    Text("Ouvrez Qurani")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                HStack {
                    Spacer()
                    Text(entry.surahName)
                        .font(.caption2)
                        .foregroundColor(.orange)
                    if entry.ayah > 0 {
                        Text(":\(entry.ayah)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                Spacer()
                Text(entry.verseText)
                    .font(.system(size: 16, design: .serif))
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.5)
                    .lineLimit(4)
                    .environment(\.layoutDirection, .rightToLeft)
                Spacer()
            }
        }
        .padding()
        .containerBackground(for: .widget) {
            Color(.systemBackground)
        }
    }
}

struct VerseWidget: Widget {
    let kind: String = "VerseWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VerseProvider()) { entry in
            VerseWidgetView(entry: entry)
        }
        .configurationDisplayName("Verset du Coran")
        .description("Affiche le verset actuellement lu dans Qurani.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
