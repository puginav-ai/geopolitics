extends Node2D

var countries = {}
var map_node = null

func _ready():
    map_node = $TileMap

func load_map_data(countries_data):
    for country_data in countries_data:
        countries[country_data.id] = country_data
        add_country_marker(country_data)

func add_country_marker(country):
    var marker = Label.new()
    marker.text = country.name
    marker.position = lat_lon_to_map(country.lat, country.lon)
    add_child(marker)

func lat_lon_to_map(lat, lon):
    var x = (lon + 180) * (1280.0 / 360.0)
    var y = (90 - lat) * (720.0 / 180.0)
    return Vector2(x, y)
