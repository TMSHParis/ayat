#!/usr/bin/env python3
"""Generate Qurani Project Report PDF"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
from reportlab.lib import colors
import datetime

# Colors
DARK_BG = HexColor('#111111')
GOLD = HexColor('#C8A961')
DARK_CARD = HexColor('#1A1A1A')
LIGHT_TEXT = HexColor('#E8E8E8')
MID_TEXT = HexColor('#999999')
ACCENT_BLUE = HexColor('#4A90D9')
ACCENT_GREEN = HexColor('#34C759')
WHITE = HexColor('#FFFFFF')
DARK_GREEN = HexColor('#1B5E20')
LIGHT_GREEN = HexColor('#E8F5E9')
SOFT_BG = HexColor('#FAFAFA')
PRIMARY = HexColor('#1A1A2E')
SECONDARY = HexColor('#16213E')
ACCENT = HexColor('#E94560')
WARM_GOLD = HexColor('#D4A54A')
SECTION_BG = HexColor('#F5F0E8')

# Page setup
WIDTH, HEIGHT = A4
MARGIN = 2 * cm

output_path = "/Users/kam/claude/ayat-static/store/Qurani-Rapport-Projet.pdf"


def create_pdf():
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=32,
        leading=38,
        textColor=PRIMARY,
        spaceAfter=6,
        fontName='Helvetica-Bold',
    )

    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        leading=18,
        textColor=MID_TEXT,
        spaceAfter=20,
        fontName='Helvetica',
    )

    heading1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontSize=22,
        leading=28,
        textColor=PRIMARY,
        spaceBefore=30,
        spaceAfter=14,
        fontName='Helvetica-Bold',
    )

    heading2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontSize=16,
        leading=22,
        textColor=SECONDARY,
        spaceBefore=18,
        spaceAfter=8,
        fontName='Helvetica-Bold',
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        textColor=HexColor('#333333'),
        spaceAfter=8,
        fontName='Helvetica',
        alignment=TA_JUSTIFY,
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=20,
        bulletIndent=8,
        spaceAfter=4,
        bulletFontName='Helvetica',
        bulletFontSize=11,
    )

    stat_label_style = ParagraphStyle(
        'StatLabel',
        parent=styles['Normal'],
        fontSize=10,
        textColor=MID_TEXT,
        alignment=TA_CENTER,
        fontName='Helvetica',
    )

    stat_value_style = ParagraphStyle(
        'StatValue',
        parent=styles['Normal'],
        fontSize=24,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        spaceAfter=2,
    )

    small_style = ParagraphStyle(
        'Small',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=MID_TEXT,
        fontName='Helvetica',
    )

    quote_style = ParagraphStyle(
        'Quote',
        parent=styles['Normal'],
        fontSize=12,
        leading=18,
        textColor=HexColor('#555555'),
        fontName='Helvetica-Oblique',
        leftIndent=20,
        rightIndent=20,
        spaceBefore=10,
        spaceAfter=10,
        alignment=TA_CENTER,
    )

    story = []

    # ==================== COVER PAGE ====================
    story.append(Spacer(1, 60))

    # Logo text
    logo_style = ParagraphStyle(
        'Logo', parent=styles['Normal'],
        fontSize=12, textColor=MID_TEXT, alignment=TA_CENTER,
        fontName='Helvetica', spaceAfter=20, letterSpacing=4,
    )
    story.append(Paragraph("TMSH PARIS", logo_style))
    story.append(Spacer(1, 20))

    # Title
    cover_title = ParagraphStyle(
        'CoverTitle', parent=styles['Title'],
        fontSize=42, leading=50, textColor=PRIMARY,
        alignment=TA_CENTER, fontName='Helvetica-Bold',
    )
    story.append(Paragraph("QURANI", cover_title))
    story.append(Spacer(1, 8))

    cover_sub = ParagraphStyle(
        'CoverSub', parent=styles['Normal'],
        fontSize=16, textColor=WARM_GOLD, alignment=TA_CENTER,
        fontName='Helvetica', spaceAfter=8,
    )
    story.append(Paragraph("Rapport de Projet", cover_sub))

    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="40%", thickness=1, color=WARM_GOLD, spaceAfter=20, spaceBefore=0, hAlign='CENTER'))

    cover_desc = ParagraphStyle(
        'CoverDesc', parent=styles['Normal'],
        fontSize=12, leading=18, textColor=MID_TEXT,
        alignment=TA_CENTER, fontName='Helvetica',
    )
    story.append(Paragraph(
        "Bilan complet du d\u00e9veloppement de l'application Qurani<br/>"
        "Coran \u2022 Pri\u00e8res \u2022 Invocations \u2022 M\u00e9morisation",
        cover_desc
    ))

    story.append(Spacer(1, 60))

    # Key stats on cover
    stats_data = [
        [Paragraph("<b>151</b>", stat_value_style),
         Paragraph("<b>25 950</b>", stat_value_style),
         Paragraph("<b>20+</b>", stat_value_style),
         Paragraph("<b>2</b>", stat_value_style)],
        [Paragraph("Commits", stat_label_style),
         Paragraph("Lignes de code", stat_label_style),
         Paragraph("Fonctionnalit\u00e9s", stat_label_style),
         Paragraph("Stores", stat_label_style)],
    ]

    stats_table = Table(stats_data, colWidths=[3.8 * cm] * 4)
    stats_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
        ('BACKGROUND', (0, 0), (-1, -1), SECTION_BG),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    story.append(stats_table)

    story.append(Spacer(1, 80))

    # Date & info
    info_style = ParagraphStyle(
        'Info', parent=styles['Normal'],
        fontSize=10, textColor=MID_TEXT, alignment=TA_CENTER,
        fontName='Helvetica',
    )
    story.append(Paragraph("Mars 2026 \u2022 IslamSounnah / TMSH Paris", info_style))
    story.append(Paragraph("D\u00e9velopp\u00e9 avec l'assistance de Claude (Anthropic)", info_style))

    story.append(PageBreak())

    # ==================== TABLE OF CONTENTS ====================
    story.append(Paragraph("Sommaire", heading1_style))
    story.append(Spacer(1, 10))

    toc_items = [
        ("1.", "Pr\u00e9sentation du Projet"),
        ("2.", "Architecture Technique"),
        ("3.", "Fonctionnalit\u00e9s D\u00e9velopp\u00e9es (20+)"),
        ("4.", "Chronologie & Jalons"),
        ("5.", "Publication : App Store & Google Play"),
        ("6.", "Statistiques de D\u00e9veloppement"),
        ("7.", "Estimation Sans IA : Temps & Budget"),
        ("8.", "Conclusion"),
    ]

    for num, title in toc_items:
        toc_style = ParagraphStyle(
            f'TOC{num}', parent=body_style,
            fontSize=13, leading=22, leftIndent=10,
            fontName='Helvetica',
        )
        story.append(Paragraph(f'<b>{num}</b>  {title}', toc_style))

    story.append(PageBreak())

    # ==================== 1. PRESENTATION ====================
    story.append(Paragraph("1. Pr\u00e9sentation du Projet", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    story.append(Paragraph(
        "Qurani est une application compl\u00e8te pour la lecture du Coran, "
        "la pratique quotidienne de l'Islam et l'apprentissage. "
        "D\u00e9velopp\u00e9e par <b>TMSH Paris</b> sous la marque <b>IslamSounnah</b>, "
        "elle est disponible sur <b>iOS (App Store)</b>, <b>Android (Google Play)</b> "
        "et en tant que <b>PWA (Progressive Web App)</b>.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # Project info table
    info_data = [
        ["Application", "Qurani - by IslamSounnah"],
        ["\u00c9diteur", "TMSH Paris"],
        ["Bundle ID", "com.tmshparis.qurani"],
        ["Technologies", "HTML/CSS/JS + Capacitor 8.1.0"],
        ["Plateformes", "iOS, Android, Web (PWA)"],
        ["Langues", "Fran\u00e7ais (UI), Arabe (Coran)"],
        ["URL Web", "https://ayat-theta.vercel.app"],
        ["P\u00e9riode", "15 f\u00e9vrier \u2013 8 mars 2026 (3 semaines)"],
    ]

    info_table = Table(info_data, colWidths=[4.5 * cm, 11.5 * cm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), SECTION_BG),
        ('TEXTCOLOR', (0, 0), (0, -1), PRIMARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#DDDDDD')),
    ]))
    story.append(info_table)

    # ==================== 2. ARCHITECTURE ====================
    story.append(Paragraph("2. Architecture Technique", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    story.append(Paragraph(
        "L'application repose sur une architecture <b>Single Page Application (SPA)</b> "
        "pure, sans framework, envelopp\u00e9e par <b>Capacitor 8.1.0</b> pour le d\u00e9ploiement natif.",
        body_style
    ))

    story.append(Paragraph("Fichiers principaux :", heading2_style))

    files_data = [
        ["Fichier", "R\u00f4le", "Lignes"],
        ["app.js", "Logique principale de l'application", "13 709"],
        ["style.css", "Styles et th\u00e8mes (Jour, S\u00e9pia, Nuit)", "8 907"],
        ["index.html", "Structure HTML de la SPA", "2 693"],
        ["follow-worker.js", "Worker IA : reconnaissance vocale ONNX", "487"],
        ["sw.js", "Service Worker (cache offline, v377)", "119"],
        ["audio-processor.js", "AudioWorklet capture micro 16kHz", "35"],
    ]

    files_table = Table(files_data, colWidths=[4 * cm, 8.5 * cm, 2.5 * cm])
    files_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTNAME', (0, 1), (0, -1), 'Courier'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CCCCCC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SOFT_BG]),
    ]))
    story.append(files_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<b>Total : 25 950 lignes de code</b> \u00e9crites en 3 semaines.",
        body_style
    ))

    # ==================== 3. FEATURES ====================
    story.append(PageBreak())
    story.append(Paragraph("3. Fonctionnalit\u00e9s D\u00e9velopp\u00e9es", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    story.append(Paragraph(
        "Qurani int\u00e8gre plus de <b>20 fonctionnalit\u00e9s majeures</b>, "
        "chacune n\u00e9cessitant design, d\u00e9veloppement, tests et optimisation.",
        body_style
    ))

    features = [
        ("Lecteur de Coran", "Navigation verset par verset avec swipe, 114 sourates, texte arabe complet"),
        ("Traduction fran\u00e7aise", "Affichage bilingue arabe/fran\u00e7ais, mode arabe seul ou fran\u00e7ais seul"),
        ("Mode Tajwid", "Lecture coloris\u00e9e selon les r\u00e8gles de r\u00e9citation (rouge, bleu, vert)"),
        ("Th\u00e8mes visuels", "4 th\u00e8mes : Jour, S\u00e9pia, Nuit et Auto (suit le syst\u00e8me)"),
        ("Tailles de texte", "3 tailles ajustables : S, M, L"),
        ("Horaires de pri\u00e8re", "Calcul pr\u00e9cis + mosqu\u00e9es Mawaqit, design Behold-style immersif"),
        ("Boussole Qibla", "Direction en temps r\u00e9el avec orientation du t\u00e9l\u00e9phone"),
        ("Hifz (M\u00e9morisation)", "4 niveaux de difficult\u00e9, exercices mot par mot"),
        ("R\u00e9citation audio", "Plusieurs r\u00e9citateurs (Al-Husary, Al-Afasy, Abdul Basit...), lecture continue"),
        ("Khatm Reader", "Lecture compl\u00e8te du Coran du d\u00e9but \u00e0 la fin avec suivi de progression"),
        ("Du'a (Invocations)", "Matin, soir + 36 cat\u00e9gories, tashkeel complet"),
        ("Tafsir", "Commentaire des versets accessible par appui long"),
        ("Marque-pages", "Syst\u00e8me de signets avec dossiers personnalis\u00e9s"),
        ("Notes par verset", "Annotation personnelle sur chaque verset"),
        ("Recherche", "Recherche en arabe et en fran\u00e7ais dans tout le Coran"),
        ("Statistiques", "Streak, versets lus, khatmas compl\u00e9t\u00e9es, temps de lecture"),
        ("Suivi Vocal IA", "Reconnaissance vocale temps r\u00e9el (ONNX, 131 Mo, offline)"),
        ("Ayati", "Identification de verset par audio (type Shazam)"),
        ("Notifications", "Rappels quotidiens de lecture"),
        ("Mode hors ligne", "Service Worker complet, tout fonctionne sans internet"),
        ("Mode Concentration", "Lecture sans distraction, interface minimale"),
        ("Apple Watch", "Complications et app WatchOS"),
        ("Widgets iOS", "Widgets \u00e9cran d'accueil et \u00e9cran de verrouillage"),
        ("Cloud Sync", "Firebase/Firestore (pr\u00e9par\u00e9, auth en attente)"),
    ]

    for i, (name, desc) in enumerate(features):
        bg = SECTION_BG if i % 2 == 0 else WHITE
        feat_data = [[
            Paragraph(f'<b>{i+1}.</b>', ParagraphStyle('fn', fontSize=10, textColor=WARM_GOLD, fontName='Helvetica-Bold')),
            Paragraph(f'<b>{name}</b>', ParagraphStyle('ft', fontSize=10, textColor=PRIMARY, fontName='Helvetica-Bold')),
            Paragraph(desc, ParagraphStyle('fd', fontSize=9, textColor=HexColor('#555555'), fontName='Helvetica', leading=12)),
        ]]
        feat_table = Table(feat_data, colWidths=[1 * cm, 4 * cm, 11 * cm])
        feat_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(feat_table)

    # ==================== 4. CHRONOLOGIE ====================
    story.append(PageBreak())
    story.append(Paragraph("4. Chronologie & Jalons", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    timeline = [
        ["Date", "\u00c9v\u00e9nement"],
        ["15 f\u00e9vr. 2026", "Premier commit \u2014 d\u00e9but du d\u00e9veloppement"],
        ["23 f\u00e9vr. 2026", "v1.0 soumise \u00e0 Apple \u2014 rejet\u00e9e (Guideline 4.2)"],
        ["25 f\u00e9vr. 2026", "v2.0 resoumise avec fonctionnalit\u00e9s enrichies"],
        ["28 f\u00e9vr. 2026", "Khatm Reader + Du'a complets (SW v152)"],
        ["4 mars 2026", "Dashboard immersif, Suivi Vocal IA (SW v304)"],
        ["6 mars 2026", "Dernier commit (SW v377) \u2014 Mode Concentration"],
        ["7 mars 2026", "v3.1.0 APPROUV\u00c9E sur l'App Store"],
        ["7 mars 2026", "v3.2.0 soumise (Watch, Widgets, Concentration)"],
        ["7 mars 2026", "Android : acc\u00e8s production Google Play obtenu"],
        ["8 mars 2026", "Android : AAB soumis sur Google Play (en examen)"],
    ]

    timeline_table = Table(timeline, colWidths=[3.5 * cm, 12.5 * cm])
    timeline_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 1), (0, -1), WARM_GOLD),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CCCCCC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SOFT_BG]),
    ]))
    story.append(timeline_table)

    # ==================== 5. PUBLICATION ====================
    story.append(Spacer(1, 20))
    story.append(Paragraph("5. Publication : App Store & Google Play", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    story.append(Paragraph("Apple App Store (iOS)", heading2_style))
    story.append(Paragraph("\u2022 <b>v3.1.0 approuv\u00e9e</b> et en ligne depuis le 7 mars 2026", bullet_style))
    story.append(Paragraph("\u2022 v3.2.0 en attente d'examen (Mode Concentration, Watch, Widgets)", bullet_style))
    story.append(Paragraph("\u2022 10 screenshots iPhone 6.9\" + description fran\u00e7aise compl\u00e8te", bullet_style))

    story.append(Paragraph("Google Play Store (Android)", heading2_style))
    story.append(Paragraph("\u2022 AAB v1.0 (26.6 Mo) soumis le 8 mars 2026", bullet_style))
    story.append(Paragraph("\u2022 Fiche store compl\u00e8te : 8 screenshots, ic\u00f4ne, Feature Graphic", bullet_style))
    story.append(Paragraph("\u2022 Distribution : 176 pays + reste du monde", bullet_style))
    story.append(Paragraph("\u2022 En attente d'approbation Google (1-7 jours)", bullet_style))

    story.append(Paragraph("Progressive Web App (PWA)", heading2_style))
    story.append(Paragraph("\u2022 Accessible imm\u00e9diatement sur https://ayat-theta.vercel.app", bullet_style))
    story.append(Paragraph("\u2022 Installable sur tout appareil, fonctionne hors ligne", bullet_style))
    story.append(Paragraph("\u2022 H\u00e9berg\u00e9e sur Vercel (d\u00e9ploiement continu)", bullet_style))

    # ==================== 6. STATISTIQUES ====================
    story.append(PageBreak())
    story.append(Paragraph("6. Statistiques de D\u00e9veloppement", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    dev_stats = [
        ["M\u00e9trique", "Valeur"],
        ["Dur\u00e9e du projet", "3 semaines (15 f\u00e9vr. \u2013 8 mars 2026)"],
        ["Commits Git", "151"],
        ["Lignes de code", "25 950"],
        ["Insertions totales", "45 487"],
        ["Suppressions totales", "4 865"],
        ["Fonctionnalit\u00e9s majeures", "24"],
        ["Versions soumises (iOS)", "4 (v1.0, v2.0, v3.1.0, v3.2.0)"],
        ["Versions soumises (Android)", "1 (v1.0)"],
        ["Version Service Worker", "v377 (377 it\u00e9rations)"],
        ["Mod\u00e8le IA embarqu\u00e9", "FastConformer Arabic CTC (131 Mo, ONNX)"],
        ["Poids app Android (AAB)", "26.6 Mo"],
        ["Plateformes", "iOS + Android + PWA"],
        ["Pays de distribution", "176+ pays"],
    ]

    dev_table = Table(dev_stats, colWidths=[5.5 * cm, 10.5 * cm])
    dev_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CCCCCC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SOFT_BG]),
    ]))
    story.append(dev_table)

    # ==================== 7. ESTIMATION SANS IA ====================
    story.append(Spacer(1, 20))
    story.append(Paragraph("7. Estimation Sans IA : Temps & Budget", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    story.append(Paragraph(
        "Le tableau ci-dessous compare le d\u00e9veloppement <b>avec l'IA</b> (Claude, Anthropic) "
        "et une estimation <b>sans IA</b>, en faisant appel \u00e0 des d\u00e9veloppeurs freelance ou une agence.",
        body_style
    ))

    story.append(Spacer(1, 10))

    compare_data = [
        ["", "Avec IA (Claude)", "Sans IA (traditionnel)"],
        ["Dur\u00e9e totale", "3 semaines", "6 \u00e0 9 mois"],
        ["Heures de travail", "~80-100h", "~1 500 \u2013 2 500h"],
        ["D\u00e9veloppeurs", "1 personne + IA", "3-5 d\u00e9veloppeurs"],
        ["Co\u00fbt dev front-end", "~0 \u20ac *", "25 000 \u2013 40 000 \u20ac"],
        ["Co\u00fbt dev back-end / API", "~0 \u20ac *", "10 000 \u2013 15 000 \u20ac"],
        ["Design UI/UX", "~0 \u20ac *", "8 000 \u2013 15 000 \u20ac"],
        ["Int\u00e9gration IA (Suivi Vocal)", "~0 \u20ac *", "15 000 \u2013 25 000 \u20ac"],
        ["Apps natives (iOS + Android)", "~0 \u20ac *", "10 000 \u2013 20 000 \u20ac"],
        ["Tests + soumission stores", "~0 \u20ac *", "3 000 \u2013 5 000 \u20ac"],
        ["", "", ""],
        ["BUDGET TOTAL ESTIM\u00c9", "< 200 \u20ac **", "71 000 \u2013 120 000 \u20ac"],
    ]

    compare_table = Table(compare_data, colWidths=[5 * cm, 5 * cm, 6 * cm])
    compare_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#CCCCCC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SOFT_BG]),
        # Last row highlight
        ('BACKGROUND', (0, -1), (-1, -1), WARM_GOLD),
        ('TEXTCOLOR', (0, -1), (-1, -1), WHITE),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 11),
        # Empty row
        ('BACKGROUND', (0, -2), (-1, -2), WHITE),
        ('LINEBELOW', (0, -2), (-1, -2), 0, WHITE),
    ]))
    story.append(compare_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "* Co\u00fbt du travail de d\u00e9veloppement r\u00e9alis\u00e9 par l'utilisateur avec l'assistance de Claude.",
        small_style
    ))
    story.append(Paragraph(
        "** Estimation incluant uniquement l'abonnement Claude Pro (~20 \u20ac/mois) "
        "et l'h\u00e9bergement Vercel (gratuit). Hors compte d\u00e9veloppeur Apple (99 \u20ac/an) et Google Play (25 \u20ac unique).",
        small_style
    ))

    story.append(Spacer(1, 20))

    # Savings highlight
    savings_data = [[
        Paragraph(
            '<b>ECONOMIE R\u00c9ALIS\u00c9E</b><br/>'
            '<font size="9" color="#555555">Gr\u00e2ce au d\u00e9veloppement assist\u00e9 par IA</font>',
            ParagraphStyle('sv1', fontSize=12, textColor=PRIMARY, fontName='Helvetica-Bold', alignment=TA_CENTER, leading=18)
        ),
        Paragraph(
            '<b>~70 000 \u2013 120 000 \u20ac</b>',
            ParagraphStyle('sv2', fontSize=22, textColor=ACCENT_GREEN, fontName='Helvetica-Bold', alignment=TA_CENTER)
        ),
        Paragraph(
            '<b>x15 \u00e0 x25 plus rapide</b>',
            ParagraphStyle('sv3', fontSize=14, textColor=WARM_GOLD, fontName='Helvetica-Bold', alignment=TA_CENTER)
        ),
    ]]

    savings_table = Table(savings_data, colWidths=[5.5 * cm, 5.5 * cm, 5 * cm])
    savings_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SECTION_BG),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 16),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    story.append(savings_table)

    # ==================== 8. CONCLUSION ====================
    story.append(PageBreak())
    story.append(Paragraph("8. Conclusion", heading1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_GOLD, spaceAfter=14))

    story.append(Paragraph(
        "En <b>3 semaines</b> et <b>151 commits</b>, Qurani est pass\u00e9e d'une id\u00e9e "
        "\u00e0 une application compl\u00e8te publi\u00e9e sur l'App Store et soumise sur Google Play.",
        body_style
    ))

    story.append(Paragraph(
        "Le projet d\u00e9montre le potentiel transformateur de l'IA g\u00e9n\u00e9rative dans le "
        "d\u00e9veloppement logiciel : une seule personne, assist\u00e9e par Claude (Anthropic), "
        "a pu concevoir, d\u00e9velopper et publier une application de qualit\u00e9 professionnelle "
        "qui aurait normalement n\u00e9cessit\u00e9 une \u00e9quipe de 3 \u00e0 5 d\u00e9veloppeurs "
        "pendant 6 \u00e0 9 mois, pour un budget de 70 000 \u00e0 120 000 \u20ac.",
        body_style
    ))

    story.append(Spacer(1, 10))

    story.append(Paragraph("Points cl\u00e9s :", heading2_style))
    key_points = [
        "24 fonctionnalit\u00e9s majeures dont la reconnaissance vocale IA offline",
        "Application triplateforme (iOS, Android, Web) avec un seul code source",
        "Design professionnel avec 4 th\u00e8mes et interface immersive",
        "Approuv\u00e9e par Apple d\u00e8s la v3.1.0 apr\u00e8s am\u00e9liorations",
        "Disponible dans 176+ pays d\u00e8s le lancement",
        "\u00c9conomie estim\u00e9e de 70 000 \u00e0 120 000 \u20ac par rapport \u00e0 un d\u00e9veloppement traditionnel",
    ]
    for point in key_points:
        story.append(Paragraph(f"\u2022  {point}", bullet_style))

    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="60%", thickness=0.5, color=MID_TEXT, spaceAfter=20, hAlign='CENTER'))

    story.append(Paragraph(
        "Qurani \u2014 Lisez, m\u00e9morisez et vivez le Coran.",
        quote_style
    ))

    story.append(Spacer(1, 40))

    footer_style = ParagraphStyle(
        'Footer', parent=styles['Normal'],
        fontSize=9, textColor=MID_TEXT, alignment=TA_CENTER,
        fontName='Helvetica',
    )
    story.append(Paragraph("Document g\u00e9n\u00e9r\u00e9 le 8 mars 2026", footer_style))
    story.append(Paragraph("TMSH Paris \u2022 IslamSounnah \u2022 Qurani", footer_style))

    # Build
    doc.build(story)
    print(f"PDF generated: {output_path}")


if __name__ == "__main__":
    create_pdf()
