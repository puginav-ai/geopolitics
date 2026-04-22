extends Control

var selected_country = null

func _ready():
    $Panel/Title.text = "Technologies"

func update_country(country):
    selected_country = country
    update_tech_list()

func update_tech_list():
    if not selected_country or not selected_country.has("technologies"):
        return
    
    var list = $Panel/TechList
    list.clear()
    
    var techs = selected_country.technologies
    for tech_name in techs.keys():
        var value = techs[tech_name]
        var display_value = str(value) if typeof(value) == TYPE_REAL else ("Yes" if value else "No")
        list.add_item("%s: %s" % [tech_name, display_value])

func _on_DevelopButton_pressed():
    pass