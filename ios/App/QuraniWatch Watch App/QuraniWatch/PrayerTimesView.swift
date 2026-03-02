import SwiftUI
import Combine

struct PrayerTimesView: View {
    @State private var prayerData: PrayerTimesData?
    @State private var now = Date()

    private let timer = Timer.publish(every: 30, on: .main, in: .common).autoconnect()

    // Palette — matches iPhone prayer overlay
    private let gold       = Color(red: 1.0, green: 0.90, blue: 0.62)
    private let goldDim    = Color(red: 1.0, green: 0.88, blue: 0.55).opacity(0.45)
    private let textMain   = Color.white.opacity(0.92)
    private let textSub    = Color.white.opacity(0.42)
    private let textFaint  = Color.white.opacity(0.22)
    private let separator  = Color.white.opacity(0.07)

    // ────────────────────────────────────
    // MARK: — Body
    // ────────────────────────────────────
    var body: some View {
        ZStack {
            // Blurred prayer background image
            Image("PrayerBg")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .ignoresSafeArea()

            // Dark overlay for readability
            Color.black.opacity(0.3)
                .ignoresSafeArea()

            if let data = prayerData {
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 0) {
                        heroSection(data)

                        divider

                        prayersList(data)

                        Spacer(minLength: 12)
                    }
                    .padding(.top, 6)
                }
            } else {
                fallbackView
            }
        }
        .onAppear { loadData() }
        .onReceive(timer) { _ in now = Date() }
    }

    // ────────────────────────────────────
    // MARK: — Hero (prochaine prière)
    // ────────────────────────────────────
    private func heroSection(_ data: PrayerTimesData) -> some View {
        Group {
            if let next = data.nextPrayer() {
                VStack(spacing: 5) {
                    Text("PROCHAINE PRIÈRE")
                        .font(.system(size: 8, weight: .semibold, design: .monospaced))
                        .tracking(2)
                        .foregroundColor(textSub)

                    Text(next.nameAr)
                        .font(.system(size: 26, weight: .bold))
                        .foregroundColor(textMain)
                        .padding(.top, 2)

                    Text(next.name.uppercased())
                        .font(.system(size: 10, weight: .medium, design: .monospaced))
                        .tracking(1.5)
                        .foregroundColor(textSub)

                    Text(String(next.time.prefix(5)))
                        .font(.system(size: 34, weight: .bold, design: .monospaced))
                        .foregroundColor(gold)
                        .padding(.top, 4)

                    // Countdown
                    Text(countdownString(to: next.date))
                        .font(.system(size: 10, weight: .regular, design: .monospaced))
                        .foregroundColor(goldDim)
                        .padding(.top, 1)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
            }
        }
    }

    // ────────────────────────────────────
    // MARK: — Liste des horaires
    // ────────────────────────────────────
    private func prayersList(_ data: PrayerTimesData) -> some View {
        VStack(spacing: 0) {
            Text("HORAIRES")
                .font(.system(size: 8, weight: .semibold, design: .monospaced))
                .tracking(2)
                .foregroundColor(textSub)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 14)
                .padding(.bottom, 8)

            ForEach(Array(data.prayers.enumerated()), id: \.offset) { idx, prayer in
                let isNext = data.nextPrayer()?.name == prayer.name

                HStack(spacing: 8) {
                    Text(prayer.name)
                        .font(.system(size: 11, weight: isNext ? .semibold : .regular, design: .monospaced))
                        .foregroundColor(isNext ? textMain : textSub)

                    Spacer()

                    Text(String(prayer.time.prefix(5)))
                        .font(.system(size: 14, weight: isNext ? .bold : .regular, design: .monospaced))
                        .foregroundColor(isNext ? gold : textSub)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 6)

                if idx < data.prayers.count - 1 {
                    Rectangle()
                        .fill(separator)
                        .frame(height: 0.5)
                        .padding(.horizontal, 14)
                }
            }
        }
    }

    // ────────────────────────────────────
    // MARK: — Helpers
    // ────────────────────────────────────
    private var divider: some View {
        Rectangle()
            .fill(separator)
            .frame(height: 0.5)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
    }

    private func countdownString(to date: Date) -> String {
        let diff = date.timeIntervalSince(now)
        guard diff > 0 else { return "" }
        let h = Int(diff) / 3600
        let m = (Int(diff) % 3600) / 60
        if h > 0 {
            return "dans \(h)h\(String(format: "%02d", m))"
        }
        return "dans \(m) min"
    }

    private var fallbackView: some View {
        VStack(spacing: 12) {
            Image(systemName: "moon.stars.fill")
                .font(.title2)
                .foregroundColor(gold)
            Text("Ouvrez Qurani sur votre iPhone pour charger les horaires.")
                .font(.system(size: 11))
                .multilineTextAlignment(.center)
                .foregroundColor(textSub)
        }
        .padding()
    }

    private func loadData() {
        prayerData = PrayerTimesData.load() ?? PrayerTimesData(
            fajr: "06:22", sunrise: "07:52", dhuhr: "13:04",
            asr: "16:12", maghrib: "18:38", isha: "20:02",
            date: "", timestamp: Date()
        )
    }
}
