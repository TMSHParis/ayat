import SwiftUI

@main
struct QuraniWatchApp: App {

    init() {
        // Active WatchConnectivity pour recevoir les données depuis l'iPhone
        WatchConnectivityManager.shared.activate()
    }

    var body: some Scene {
        WindowGroup {
            PrayerTimesView()
        }
    }
}
