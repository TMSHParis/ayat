import WidgetKit
import SwiftUI

// ─────────────────────────────────────────
// MARK: — Helpers partagés
// ─────────────────────────────────────────

private let gold     = Color(red: 1.0, green: 0.90, blue: 0.62)
private let textSub  = Color.white.opacity(0.50)
private let textMain = Color.white.opacity(0.92)

private func formatCountdown(from now: Date, to target: Date) -> String {
    let diff = target.timeIntervalSince(now)
    guard diff > 0 else { return "0m" }
    let h = Int(diff) / 3600
    let m = (Int(diff) % 3600) / 60
    return h > 0 ? "\(h)h\(String(format: "%02d", m))" : "\(m)m"
}

// ─────────────────────────────────────────
// MARK: — PrayerTimesData extensions
// ─────────────────────────────────────────

extension PrayerTimesData {
    private func prayerDate(for timeStr: String) -> Date? {
        let parts = timeStr.split(separator: ":").compactMap { Int($0) }
        guard parts.count >= 2 else { return nil }
        var c = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        c.hour = parts[0]; c.minute = parts[1]
        return Calendar.current.date(from: c)
    }

    func previousPrayer() -> (name: String, time: String, date: Date)? {
        let now = Date()
        let list = [("Fajr", fajr), ("Dhuhr", dhuhr), ("Asr", asr), ("Maghrib", maghrib), ("Isha", isha)]
        return list.compactMap { name, t -> (String, String, Date)? in
            guard let d = prayerDate(for: t), d <= now else { return nil }
            return (name, t, d)
        }.last
    }

    var progress: Double {
        guard let prev = previousPrayer(), let next = nextPrayer() else { return 0 }
        let total = next.date.timeIntervalSince(prev.date)
        let elapsed = Date().timeIntervalSince(prev.date)
        guard total > 0 else { return 0 }
        return min(1.0, max(0.0, elapsed / total))
    }

    func iftarInfo() -> (countdown: String, progress: Double) {
        let now = Date()
        guard let maghribDate = prayerDate(for: maghrib) else { return ("--", 0) }
        if now >= maghribDate { return ("0m", 1.0) }
        let cd = formatCountdown(from: now, to: maghribDate)
        let origin = prayerDate(for: asr) ?? maghribDate.addingTimeInterval(-3600)
        let total = maghribDate.timeIntervalSince(origin)
        let elapsed = now.timeIntervalSince(origin)
        return (cd, total > 0 ? min(1.0, max(0.0, elapsed / total)) : 0)
    }

    func qiyamInfo() -> (countdown: String, progress: Double) {
        let now = Date()
        guard let fajrToday = prayerDate(for: fajr) else { return ("--", 0) }
        let targetFajr = now < fajrToday ? fajrToday : fajrToday.addingTimeInterval(86400)
        let cd = formatCountdown(from: now, to: targetFajr)
        let ishaDate = prayerDate(for: isha) ?? targetFajr.addingTimeInterval(-5400)
        let total = targetFajr.timeIntervalSince(ishaDate)
        let elapsed = now.timeIntervalSince(ishaDate)
        return (cd, total > 0 ? min(1.0, max(0.0, elapsed / total)) : 0)
    }
}

// ─────────────────────────────────────────
// MARK: — KhatmData
// ─────────────────────────────────────────

struct KhatmWidgetData {
    let percent: Double
    static func load() -> KhatmWidgetData? {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let dict = defaults.dictionary(forKey: "khatmData"),
              let pct = dict["percent"] as? Double else { return nil }
        return KhatmWidgetData(percent: pct)
    }
}

// ─────────────────────────────────────────
// MARK: — Entries
// ─────────────────────────────────────────

struct IftarWidgetEntry: TimelineEntry {
    let date: Date; let countdown: String; let progress: Double
    static let placeholder = IftarWidgetEntry(date: Date(), countdown: "1h23", progress: 0.6)
}

struct QiyamWidgetEntry: TimelineEntry {
    let date: Date; let countdown: String; let progress: Double
    static let placeholder = QiyamWidgetEntry(date: Date(), countdown: "3h45", progress: 0.3)
}

struct KhatmWidgetEntry: TimelineEntry {
    let date: Date; let percent: Double; let isActive: Bool
    static let placeholder = KhatmWidgetEntry(date: Date(), percent: 42, isActive: true)
}

// ─────────────────────────────────────────
// MARK: — Providers
// ─────────────────────────────────────────

struct IftarWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> IftarWidgetEntry { .placeholder }
    func getSnapshot(in context: Context, completion: @escaping (IftarWidgetEntry) -> Void) { completion(make()) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<IftarWidgetEntry>) -> Void) {
        let now = Date()
        let entries = (0..<15).map { i in make(at: now.addingTimeInterval(Double(i) * 60)) }
        let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: now) ?? now
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
    private func make(at date: Date = Date()) -> IftarWidgetEntry {
        guard let d = PrayerTimesData.load() else { return .placeholder }
        let info = d.iftarInfo()
        return IftarWidgetEntry(date: date, countdown: info.countdown, progress: info.progress)
    }
}

struct QiyamWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> QiyamWidgetEntry { .placeholder }
    func getSnapshot(in context: Context, completion: @escaping (QiyamWidgetEntry) -> Void) { completion(make()) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<QiyamWidgetEntry>) -> Void) {
        let now = Date()
        let entries = (0..<15).map { i in make(at: now.addingTimeInterval(Double(i) * 60)) }
        let refresh = Calendar.current.date(byAdding: .minute, value: 15, to: now) ?? now
        completion(Timeline(entries: entries, policy: .after(refresh)))
    }
    private func make(at date: Date = Date()) -> QiyamWidgetEntry {
        guard let d = PrayerTimesData.load() else { return .placeholder }
        let info = d.qiyamInfo()
        return QiyamWidgetEntry(date: date, countdown: info.countdown, progress: info.progress)
    }
}

struct KhatmWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> KhatmWidgetEntry { .placeholder }
    func getSnapshot(in context: Context, completion: @escaping (KhatmWidgetEntry) -> Void) { completion(make()) }
    func getTimeline(in context: Context, completion: @escaping (Timeline<KhatmWidgetEntry>) -> Void) {
        let refresh = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
        completion(Timeline(entries: [make()], policy: .after(refresh)))
    }
    private func make() -> KhatmWidgetEntry {
        if let k = KhatmWidgetData.load(), k.percent > 0 { return KhatmWidgetEntry(date: Date(), percent: k.percent, isActive: true) }
        return KhatmWidgetEntry(date: Date(), percent: 0, isActive: false)
    }
}

// ─────────────────────────────────────────
// MARK: — Vue Ring partagée (lock screen)
// ─────────────────────────────────────────

private struct LockRingView: View {
    let progress: Double; let label: String; let value: String
    var body: some View {
        ZStack {
            Circle().stroke(Color.white.opacity(0.12), lineWidth: 3)
            Circle()
                .trim(from: 0, to: CGFloat(progress))
                .stroke(gold, style: StrokeStyle(lineWidth: 3, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 1) {
                Text(label).font(.system(size: 9, weight: .bold, design: .monospaced)).foregroundColor(textSub)
                Text(value).font(.system(size: 11, weight: .bold, design: .monospaced)).foregroundColor(gold)
                    .minimumScaleFactor(0.6).lineLimit(1)
            }.padding(5)
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Vue systemSmall partagée
// ─────────────────────────────────────────

private struct SmallCardView: View {
    let label: String; let value: String; let progress: Double; let icon: String
    var body: some View {
        ZStack {
            Color.black.opacity(0.85)
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(icon).font(.system(size: 18))
                    Spacer()
                    Text(label).font(.system(size: 9, weight: .bold, design: .monospaced)).foregroundColor(textSub)
                }
                Spacer()
                Text(value)
                    .font(.system(size: 28, weight: .bold, design: .monospaced))
                    .foregroundColor(gold)
                    .minimumScaleFactor(0.5).lineLimit(1)
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule().fill(Color.white.opacity(0.10)).frame(height: 3)
                        Capsule().fill(gold.opacity(0.75))
                            .frame(width: max(4, geo.size.width * CGFloat(progress)), height: 3)
                    }
                }.frame(height: 3)
            }.padding(14)
        }.clipShape(RoundedRectangle(cornerRadius: 20))
    }
}

// ─────────────────────────────────────────
// MARK: — Vues Iftar
// ─────────────────────────────────────────

struct IftarLockCircularView: View {
    let entry: IftarWidgetEntry
    var body: some View { LockRingView(progress: entry.progress, label: "IFTAR", value: entry.countdown) }
}

struct IftarSmallView: View {
    let entry: IftarWidgetEntry
    var body: some View { SmallCardView(label: "IFTAR", value: entry.countdown, progress: entry.progress, icon: "🌙") }
}

// ─────────────────────────────────────────
// MARK: — Vues Qiyam
// ─────────────────────────────────────────

struct QiyamLockCircularView: View {
    let entry: QiyamWidgetEntry
    var body: some View { LockRingView(progress: entry.progress, label: "QIYAM", value: entry.countdown) }
}

struct QiyamSmallView: View {
    let entry: QiyamWidgetEntry
    var body: some View { SmallCardView(label: "QIYAM / FAJR", value: entry.countdown, progress: entry.progress, icon: "✨") }
}

// ─────────────────────────────────────────
// MARK: — Vues Khatm
// ─────────────────────────────────────────

struct KhatmLockCircularView: View {
    let entry: KhatmWidgetEntry
    var body: some View {
        LockRingView(progress: entry.percent / 100.0, label: "KHATM", value: entry.isActive ? "\(Int(entry.percent))%" : "--")
    }
}

struct KhatmSmallView: View {
    let entry: KhatmWidgetEntry
    var body: some View {
        SmallCardView(label: "KHATM CORAN", value: entry.isActive ? "\(Int(entry.percent))%" : "--",
                      progress: entry.percent / 100.0, icon: "📖")
    }
}

// ─────────────────────────────────────────
// MARK: — Widgets
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// MARK: — Entry Views avec dispatch famille
// ─────────────────────────────────────────

struct IftarEntryView: View {
    let entry: IftarWidgetEntry
    @Environment(\.widgetFamily) var family
    var body: some View {
        switch family {
        case .accessoryCircular: IftarLockCircularView(entry: entry)
        default:                 IftarSmallView(entry: entry)
        }
    }
}

struct QiyamEntryView: View {
    let entry: QiyamWidgetEntry
    @Environment(\.widgetFamily) var family
    var body: some View {
        switch family {
        case .accessoryCircular: QiyamLockCircularView(entry: entry)
        default:                 QiyamSmallView(entry: entry)
        }
    }
}

struct KhatmEntryView: View {
    let entry: KhatmWidgetEntry
    @Environment(\.widgetFamily) var family
    var body: some View {
        switch family {
        case .accessoryCircular: KhatmLockCircularView(entry: entry)
        default:                 KhatmSmallView(entry: entry)
        }
    }
}

// ─────────────────────────────────────────
// MARK: — Widgets
// ─────────────────────────────────────────

struct IftarWidget: Widget {
    let kind = "IftarWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: IftarWidgetProvider()) { entry in
            IftarEntryView(entry: entry).containerBackground(.black.opacity(0.85), for: .widget)
        }
        .configurationDisplayName("Iftar")
        .description("Compte à rebours jusqu'à la rupture du jeûne.")
        .supportedFamilies([.accessoryCircular, .systemSmall])
    }
}

struct QiyamWidget: Widget {
    let kind = "QiyamWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: QiyamWidgetProvider()) { entry in
            QiyamEntryView(entry: entry).containerBackground(.black.opacity(0.85), for: .widget)
        }
        .configurationDisplayName("Qiyam / Fajr")
        .description("Temps restant avant Fajr pour le Qiyam al-Layl.")
        .supportedFamilies([.accessoryCircular, .systemSmall])
    }
}

struct KhatmWidget: Widget {
    let kind = "KhatmWidget"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: KhatmWidgetProvider()) { entry in
            KhatmEntryView(entry: entry).containerBackground(.black.opacity(0.85), for: .widget)
        }
        .configurationDisplayName("Khatm")
        .description("Progression de votre lecture du Coran.")
        .supportedFamilies([.accessoryCircular, .systemSmall])
    }
}
