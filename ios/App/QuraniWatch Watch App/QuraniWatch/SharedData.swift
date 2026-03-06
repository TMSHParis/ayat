import Foundation

let appGroupID = "group.com.tmshparis.qurani"

struct PrayerTimesData {
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
              let dict = defaults.dictionary(forKey: "prayerTimes") else {
            return nil
        }
        return PrayerTimesData(
            fajr: dict["fajr"] as? String ?? "",
            sunrise: dict["sunrise"] as? String ?? "",
            dhuhr: dict["dhuhr"] as? String ?? "",
            asr: dict["asr"] as? String ?? "",
            maghrib: dict["maghrib"] as? String ?? "",
            isha: dict["isha"] as? String ?? "",
            date: dict["date"] as? String ?? "",
            timestamp: Date(timeIntervalSince1970: dict["timestamp"] as? Double ?? 0)
        )
    }

    var prayers: [(name: String, nameAr: String, time: String)] {
        [
            ("Fajr", "الفجر", fajr),
            ("Shourouq", "الشروق", sunrise),
            ("Dhuhr", "الظهر", dhuhr),
            ("Asr", "العصر", asr),
            ("Maghrib", "المغرب", maghrib),
            ("Isha", "العشاء", isha)
        ]
    }

    // Parse "HH:MM" ou "HH:MM (EET)" → [heure, minute]
    private func parseTimeParts(_ time: String) -> [Int] {
        return time.split(separator: ":").compactMap { part -> Int? in
            let digits = String(part).trimmingCharacters(in: .whitespaces)
                .prefix(while: { $0.isNumber })
            return Int(digits)
        }
    }

    func nextPrayer() -> (name: String, nameAr: String, time: String, date: Date)? {
        let now = Date()
        let calendar = Calendar.current
        let prayerList: [(String, String, String)] = [
            ("Fajr", "الفجر", fajr),
            ("Dhuhr", "الظهر", dhuhr),
            ("Asr", "العصر", asr),
            ("Maghrib", "المغرب", maghrib),
            ("Isha", "العشاء", isha)
        ]
        for (name, nameAr, time) in prayerList {
            let parts = parseTimeParts(time)
            guard parts.count >= 2 else { continue }
            var components = calendar.dateComponents([.year, .month, .day], from: now)
            components.hour = parts[0]
            components.minute = parts[1]
            if let prayerDate = calendar.date(from: components), prayerDate > now {
                return (name, nameAr, String(time.prefix(5)), prayerDate)
            }
        }
        let parts = parseTimeParts(fajr)
        guard parts.count >= 2 else { return nil }
        var components = calendar.dateComponents([.year, .month, .day], from: now)
        components.hour = parts[0]
        components.minute = parts[1]
        if let fajrDate = calendar.date(from: components),
           let tomorrow = calendar.date(byAdding: .day, value: 1, to: fajrDate) {
            return ("Fajr", "الفجر", String(fajr.prefix(5)), tomorrow)
        }
        return nil
    }
}
