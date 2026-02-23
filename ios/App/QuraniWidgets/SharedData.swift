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
            let parts = time.split(separator: ":").compactMap { Int($0) }
            guard parts.count >= 2 else { continue }
            var components = calendar.dateComponents([.year, .month, .day], from: now)
            components.hour = parts[0]
            components.minute = parts[1]
            if let prayerDate = calendar.date(from: components), prayerDate > now {
                return (name, nameAr, time, prayerDate)
            }
        }
        // All past — next is Fajr tomorrow
        let parts = fajr.split(separator: ":").compactMap { Int($0) }
        guard parts.count >= 2 else { return nil }
        var components = calendar.dateComponents([.year, .month, .day], from: now)
        components.hour = parts[0]
        components.minute = parts[1]
        if let fajrDate = calendar.date(from: components),
           let tomorrow = calendar.date(byAdding: .day, value: 1, to: fajrDate) {
            return ("Fajr", "الفجر", fajr, tomorrow)
        }
        return nil
    }
}

struct VerseData {
    let surah: Int
    let ayah: Int
    let text: String
    let surahName: String

    static func load() -> VerseData? {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let dict = defaults.dictionary(forKey: "currentVerse") else {
            return nil
        }
        return VerseData(
            surah: dict["surah"] as? Int ?? 1,
            ayah: dict["ayah"] as? Int ?? 1,
            text: dict["text"] as? String ?? "",
            surahName: dict["surahName"] as? String ?? ""
        )
    }
}
