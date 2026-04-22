extends Control

var selected_country = null

func _ready():
    $Panel/Title.text = "Soft Power"

func update_country(country):
    selected_country = country
    refresh()

func refresh():
    if not selected_country:
        return
    
    var sp = selected_country.softpower if selected_country.has("softpower") else {}
    var info = $Panel/SoftPowerInfo
    info.clear()
    
    info.append_text("Cultural Presence: %d\n" % (sp.cultural_presence if sp else 0))
    info.append_text("Media Influence: %d\n" % (sp.media_influence if sp else 0))
    info.append_text("Sports Power: %d\n" % (sp.sports_power if sp else 0))
    info.append_text("Education Appeal: %d\n" % (sp.education_appeal if sp else 0))
    info.append_text("\nTotal Soft Power: %d" % (selected_country.softPower if selected_country.has("softPower") else 0))

func _on_InvestCulture_pressed():
    pass

func _on_HostEvent_pressed():
    pass