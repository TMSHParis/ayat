import Foundation
import Capacitor
import WidgetKit
import WatchConnectivity

@objc(SharedDataPlugin)
public class SharedDataPlugin: CAPPlugin, CAPBridgedPlugin, WCSessionDelegate {
    public let identifier = "SharedDataPlugin"
    public let jsName = "SharedData"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "savePrayerTimes", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveCurrentVerse", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveKhatm", returnType: CAPPluginReturnPromise)
    ]

    private let suiteName = "group.com.tmshparis.qurani"

    override public func load() {
        super.load()
        print("🔌 [WC-iPhone] SharedDataPlugin.load() — WCSession.isSupported = \(WCSession.isSupported())")
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
        }
    }

    // WCSessionDelegate requis
    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print("🔌 [WC-iPhone] activationDidComplete — state=\(activationState.rawValue) isPaired=\(session.isPaired) isWatchAppInstalled=\(session.isWatchAppInstalled) error=\(error?.localizedDescription ?? "nil")")

        guard activationState == .activated else { return }

        // Envoyer les derniers horaires stockés dès que la session est prête
        guard let defaults = UserDefaults(suiteName: suiteName),
              let data = defaults.dictionary(forKey: "prayerTimes") else {
            print("🔌 [WC-iPhone] activationDidComplete — pas de données dans UserDefaults")
            return
        }
        do {
            try session.updateApplicationContext(["prayerTimes": data])
            print("🔌 [WC-iPhone] activationDidComplete — envoyé fajr=\(data["fajr"] ?? "?") isha=\(data["isha"] ?? "?")")
        } catch {
            print("🔌 [WC-iPhone] activationDidComplete — ERREUR updateApplicationContext: \(error)")
        }
    }
    public func sessionDidBecomeInactive(_ session: WCSession) {}
    public func sessionDidDeactivate(_ session: WCSession) { WCSession.default.activate() }

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

        print("🔌 [WC-iPhone] savePrayerTimes — fajr=\(data["fajr"] ?? "") isha=\(data["isha"] ?? "")")

        // Sauvegarde locale (iPhone widgets)
        defaults.set(data, forKey: "prayerTimes")
        WidgetCenter.shared.reloadAllTimelines()

        // Transfert vers Apple Watch
        if WCSession.isSupported() {
            let session = WCSession.default
            print("🔌 [WC-iPhone] savePrayerTimes — activationState=\(session.activationState.rawValue) isPaired=\(session.isPaired) isWatchAppInstalled=\(session.isWatchAppInstalled)")
            do {
                try session.updateApplicationContext(["prayerTimes": data])
                print("🔌 [WC-iPhone] savePrayerTimes — ✅ updateApplicationContext OK")
            } catch {
                print("🔌 [WC-iPhone] savePrayerTimes — ❌ updateApplicationContext ERREUR: \(error)")
            }
        }

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
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }

    @objc func saveKhatm(_ call: CAPPluginCall) {
        guard let defaults = UserDefaults(suiteName: suiteName) else {
            call.reject("Cannot access App Group UserDefaults"); return
        }
        let data: [String: Any] = [
            "percent":  call.getDouble("percent")  ?? 0,
            "surahNum": call.getInt("surahNum")    ?? 1,
            "ayahNum":  call.getInt("ayahNum")     ?? 1,
            "timestamp": Date().timeIntervalSince1970
        ]
        defaults.set(data, forKey: "khatmData")
        WidgetCenter.shared.reloadAllTimelines()

        // Transfert vers Apple Watch (en fusionnant avec le contexte existant)
        if WCSession.isSupported() {
            let session = WCSession.default
            var merged = session.applicationContext
            merged["khatmData"] = data
            do {
                try session.updateApplicationContext(merged)
                print("🔌 [WC-iPhone] saveKhatm — ✅ updateApplicationContext OK percent=\(data["percent"] ?? "?")")
            } catch {
                print("🔌 [WC-iPhone] saveKhatm — ❌ updateApplicationContext ERREUR: \(error)")
            }
        }

        call.resolve()
    }
}
