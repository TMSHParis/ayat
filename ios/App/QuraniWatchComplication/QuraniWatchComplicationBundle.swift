//
//  QuraniWatchComplicationBundle.swift
//  QuraniWatchComplication
//
//  Created by Kam on 04/03/2026.
//

import WidgetKit
import SwiftUI

@main
struct QuraniWatchComplicationBundle: WidgetBundle {
    var body: some Widget {
        QuraniWatchComplication()
        AllPrayersRowComplication()
        IftarComplication()
        QiyamComplication()
        CountdownBarComplication()
    }
}
