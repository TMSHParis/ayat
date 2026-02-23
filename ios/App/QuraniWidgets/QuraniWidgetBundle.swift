import WidgetKit
import SwiftUI

@main
struct QuraniWidgetBundle: WidgetBundle {
    var body: some Widget {
        NextPrayerWidget()
        PrayerTimesWidget()
        VerseWidget()
    }
}
