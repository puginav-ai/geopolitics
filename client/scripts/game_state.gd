extends Node

var current_turn = 1
var turn_duration = "month"
var world_market = {}
var selected_country = null
var countries = []

func update_from_server(data):
    current_turn = data.turn
    turn_duration = data.turnDuration
    world_market = data.worldMarket
    if data.has("countries"):
        countries = data.countries

func get_country(id):
    for c in countries:
        if c.id == id:
            return c
    return null