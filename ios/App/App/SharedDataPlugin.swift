import Foundation
import Capacitor

@objc(SharedDataPlugin)
public class SharedDataPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SharedDataPlugin"
    public let jsName = "SharedData"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "savePrayerTimes", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveCurrentVerse", returnType: CAPPluginReturnPromise)
    ]

    private let suiteName = "group.com.tmshparis.qurani"

    @objc func savePrayerTimes(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: suiteName) else {
            call.reject("Cannot access App Group UserDefaults")
            return
        }

        let data: [String: Any] = [
            "fajr": call.getString("fajr") ?? "",
            "sunrise": call.getString("sunrise") ?? "",
            "dhuhr": call.getString("dhuhr") ?? "",
            "asr": call.getString("asr") ?? "",
            "maghrib": call.getString("maghrib") ?? "",
            "isha": call.getString("isha") ?? "",
            "date": call.getString("date") ?? "",
            "nextPrayer": call.getString("nextPrayer") ?? "",
            "nextTime": call.getString("nextTime") ?? "",
            "method": call.getInt("method") ?? 12,
            "city": call.getString("city") ?? "",
            "timestamp": Date().timeIntervalSince1970
        ]

        defaults.set(data, forKey: "prayerTimes")
        call.resolve()
    }

    @objc func saveCurrentVerse(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: suiteName) else {
            call.reject("Cannot access App Group UserDefaults")
            return
        }

        let data: [String: Any] = [
            "surah": call.getInt("surah") ?? 1,
            "ayah": call.getInt("ayah") ?? 1,
            "text": call.getString("text") ?? "",
            "surahName": call.getString("surahName") ?? "",
            "timestamp": Date().timeIntervalSince1970
        ]

        defaults.set(data, forKey: "currentVerse")
        call.resolve()
    }
}
