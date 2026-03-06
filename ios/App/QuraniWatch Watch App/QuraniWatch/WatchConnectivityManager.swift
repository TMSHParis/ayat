//
//  WatchConnectivityManager.swift
//  QuraniWatch Watch App
//
//  Reçoit les horaires de prière depuis l'iPhone et les stocke
//  dans l'App Group pour la complication et l'app Watch.
//

import WatchConnectivity
import WidgetKit
import Foundation

class WatchConnectivityManager: NSObject, WCSessionDelegate {

    static let shared = WatchConnectivityManager()
    private let suiteName = "group.com.tmshparis.qurani"

    private override init() {
        super.init()
    }

    func activate() {
        guard WCSession.isSupported() else {
            print("⌚ [WC-Watch] WCSession NOT supported")
            return
        }
        print("⌚ [WC-Watch] Activating WCSession...")
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    // Reçu quand l'iPhone envoie updateApplicationContext (en temps réel)
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        print("⌚ [WC-Watch] didReceiveApplicationContext — keys: \(applicationContext.keys)")
        if let prayerTimes = applicationContext["prayerTimes"] as? [String: Any] {
            print("⌚ [WC-Watch] Got prayerTimes — fajr=\(prayerTimes["fajr"] ?? "?") isha=\(prayerTimes["isha"] ?? "?")")
            savePrayerTimes(prayerTimes)
        }
    }

    // Reçu quand l'iPhone envoie sendMessage (Watch joignable en temps réel)
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        print("⌚ [WC-Watch] didReceiveMessage — keys: \(message.keys)")
        if let prayerTimes = message["prayerTimes"] as? [String: Any] {
            savePrayerTimes(prayerTimes)
        }
    }

    private func savePrayerTimes(_ data: [String: Any]) {
        guard let defaults = UserDefaults(suiteName: suiteName) else {
            print("⌚ [WC-Watch] ❌ Cannot access App Group UserDefaults!")
            return
        }
        defaults.set(data, forKey: "prayerTimes")
        defaults.synchronize() // Force flush immédiat
        print("⌚ [WC-Watch] ✅ Saved to UserDefaults — fajr=\(data["fajr"] ?? "?") isha=\(data["isha"] ?? "?")")

        // Vérification immédiate que la lecture fonctionne
        if let check = defaults.dictionary(forKey: "prayerTimes") {
            print("⌚ [WC-Watch] ✅ Read-back OK — fajr=\(check["fajr"] ?? "?")")
        } else {
            print("⌚ [WC-Watch] ❌ Read-back FAILED!")
        }

        // Recharger la complication Watch
        WidgetCenter.shared.reloadAllTimelines()
    }

    // IMPORTANT : au lancement de l'app Watch, lire le contexte déjà stocké
    // (envoyé par l'iPhone quand l'app Watch était fermée)
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print("⌚ [WC-Watch] activationDidComplete — state=\(activationState.rawValue) error=\(error?.localizedDescription ?? "nil")")

        guard activationState == .activated else { return }

        let ctx = session.receivedApplicationContext
        print("⌚ [WC-Watch] receivedApplicationContext keys: \(ctx.keys) — count: \(ctx.count)")

        if let prayerTimes = ctx["prayerTimes"] as? [String: Any] {
            print("⌚ [WC-Watch] Found pending prayerTimes — fajr=\(prayerTimes["fajr"] ?? "?")")
            savePrayerTimes(prayerTimes)
        } else {
            print("⌚ [WC-Watch] ⚠️ No prayerTimes in receivedApplicationContext")
        }
    }
}
