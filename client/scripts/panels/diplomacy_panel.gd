extends Control

var selected_country = null

func _ready():
    $Panel/Title.text = "Diplomacy"

func update_country(country):
    selected_country = country
    update_relations()

func update_relations():
    if not selected_country or not selected_country.has("relations"):
        return
    
    var relations_container = $Panel/RelationsList
    relations_container.clear()
    
    for other_id in selected_country.relations.keys():
        var rel = selected_country.relations[other_id]
        var item = relations_container.add_item(other_id.to_upper())
        relations_container.set_item_text(item, "Score: %d" % rel.score)
        
        if rel.trade_agreement:
            relations_container.set_item_text(item, relations_container.get_item_text(item) + " [Trade]")
        if rel.military_alliance:
            relations_container.set_item_text(item, relations_container.get_item_text(item) + " [Alliance]")
        if rel.sanctions.size() > 0:
            relations_container.set_item_text(item, relations_container.get_item_text(item) + " [Sanctions]")

func _on_ProposeButton_pressed():
    pass
