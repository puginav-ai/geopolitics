extends Control

var selected_country = null

func _ready():
    $Panel/Title.text = "Military"

func update_country(country):
    selected_country = country
    refresh()

func refresh():
    if not selected_country or not selected_country.has("military"):
        return

    var mil = selected_country.military
    var info = $Panel/MilitaryInfo
    info.clear()

    info.append_text("Personnel: %d\n" % mil.personnel)
    info.append_text("Budget: $%dB\n" % (mil.budget / 1000000000))
    info.append_text("Readiness: %d%%\n\n" % mil.readiness)

    if mil.has("army"):
        info.append_text("ARMY\n")
        info.append_text("Divisions: %d\n" % mil.army.divisions)
        info.append_text("Tanks: %d\n\n" % mil.army.tanks)

    if mil.has("airforce"):
        info.append_text("AIR FORCE\n")
        info.append_text("Fighters: %d\n" % mil.airforce.fighters)
        info.append_text("Bombers: %d\n\n" % mil.airforce.bombers)

    if mil.has("navy"):
        info.append_text("NAVY\n")
        info.append_text("Carriers: %d\n" % mil.navy.carriers)
        info.append_text("Submarines: %d\n" % mil.navy.submarines)

func _on_RecruitButton_pressed():
    pass

func _on_UpgradeButton_pressed():
    pass