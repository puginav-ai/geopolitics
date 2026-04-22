extends Control

var map_controller = null
var show_trade_routes = true
var show_labels = true
var show_crises = true

func _ready():
    $Panel/TradeRoutesCheck.button_pressed = true
    $Panel/LabelsCheck.button_pressed = true
    $Panel/CrisesCheck.button_pressed = true

func set_map_controller(controller):
    map_controller = controller

func _on_TradeRoutesCheck_toggled(button_pressed):
    show_trade_routes = button_pressed
    update_overlay()

func _on_LabelsCheck_toggled(button_pressed):
    show_labels = button_pressed
    if map_controller and map_controller.labels_node:
        map_controller.labels_node.visible = button_pressed

func _on_CrisesCheck_toggled(button_pressed):
    show_crises = button_pressed
    update_overlay()

func update_overlay():
    if not map_controller:
        return
    
    if map_controller.routes_node:
        for child in map_controller.routes_node.get_children():
            if child is Line2D:
                child.visible = show_trade_routes

func update_crises(countries):
    if not map_controller or not show_crises:
        return
    
    for country in countries:
        if country.has("crisis"):
            map_controller.show_crisis(country.id, country.crisis.type)