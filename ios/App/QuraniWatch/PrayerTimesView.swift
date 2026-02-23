import SwiftUI

struct PrayerTimesView: View {
    @State private var prayerData: PrayerTimesData?

    var body: some View {
        NavigationStack {
            Group {
                if let data = prayerData {
                    List {
                        if let next = data.nextPrayer() {
                            Section {
                                VStack(alignment: .center, spacing: 4) {
                                    Text(next.nameAr)
                                        .font(.title3)
                                        .fontWeight(.bold)
                                    Text(next.name)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    Text(String(next.time.prefix(5)))
                                        .font(.title2)
                                        .fontWeight(.semibold)
                                        .foregroundColor(.orange)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 4)
                            } header: {
                                Text("Prochaine pri\u{00e8}re")
                            }
                        }

                        Section {
                            ForEach(Array(data.prayers.enumerated()), id: \.offset) { _, prayer in
                                let isNext = data.nextPrayer()?.name == prayer.name
                                HStack {
                                    Text(prayer.nameAr)
                                        .font(.caption)
                                        .frame(width: 35, alignment: .trailing)
                                    Text(prayer.name)
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                    Spacer()
                                    Text(String(prayer.time.prefix(5)))
                                        .font(.caption)
                                        .fontWeight(isNext ? .bold : .regular)
                                        .foregroundColor(isNext ? .orange : .primary)
                                }
                            }
                        } header: {
                            Text("Horaires")
                        }
                    }
                } else {
                    VStack(spacing: 12) {
                        Image(systemName: "moon.stars.fill")
                            .font(.largeTitle)
                            .foregroundColor(.orange)
                        Text("Ouvrez Qurani sur votre iPhone pour charger les horaires de pri\u{00e8}re.")
                            .font(.caption)
                            .multilineTextAlignment(.center)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                }
            }
            .navigationTitle("Qurani")
        }
        .onAppear {
            prayerData = PrayerTimesData.load()
        }
    }
}
