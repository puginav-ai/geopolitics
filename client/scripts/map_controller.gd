extends Node2D

var countries = {}
var trade_routes = []
var map_node = null
var labels_node = null
var routes_node = null

const COUNTRY_COLORS = {
  'russia': Color(0.2, 0.4, 0.8),
  'usa': Color(0.8, 0.2, 0.2),
  'china': Color(0.9, 0.7, 0.1)
}

func _ready():
    map_node = $TileMap
    create_layers()

func create_layers():
    labels_node = Node2D.new()
    labels_node.name = "Labels"
    add_child(labels_node)
    
    routes_node = Node2D.new()
    routes_node.name = "Routes"
    add_child(routes_node)

func load_map_data(countries_data):
    countries.clear()
    for country_data in countries_data:
        countries[country_data.id] = country_data
        add_country_marker(country_data)
        add_country_border(country_data)

func add_country_marker(country):
    var color = COUNTRY_COLORS.get(country.id, Color.WHITE)
    
    var circle = ColorRect.new()
    circle.size = Vector2(20, 20)
    circle.position = lat_lon_to_map(country.lat, country.lon) - Vector2(10, 10)
    circle.color = color
    circle.modulate.a = 0.8
    labels_node.add_child(circle)
    
    var label = Label.new()
    label.text = country.name
    label.position = lat_lon_to_map(country.lat, country.lon) + Vector2(15, -10)
    label.add_theme_font_size_override("font_size", 12)
    labels_node.add_child(label)

func add_country_border(country):
    var points = get_country_border_points(country)
    if points.size() < 2:
        return
    
    var line = Line2D.new()
    line.points = PackedVector2Array(points)
    line.default_color = Color(0.5, 0.5, 0.5, 0.5)
    line.width = 1.0
    routes_node.add_child(line)

func get_country_border_points(country):
    var center = lat_lon_to_map(country.lat, country.lon)
    var size = min(800.0 / country.population * 1000000, 200)
    
    var points = []
    var segments = 6
    for i in range(segments):
        var angle = (i * 2 * PI) / segments
        var x = center.x + cos(angle) * size
        var y = center.y + sin(angle) * size * 0.6
        points.append(Vector2(x, y))
    return points

func lat_lon_to_map(lat, lon):
    var x = (lon + 180) * (1280.0 / 360.0)
    var y = (90 - lat) * (720.0 / 180.0)
    return Vector2(x, y)

func update_trade_routes(routes):
    for child in routes_node.get_children():
        if child is Line2D:
            child.queue_free()
    
    for route in routes:
        var from_country = countries.get(route.from)
        var to_country = countries.get(route.to)
        if from_country and to_country:
            var from_pos = lat_lon_to_map(from_country.lat, from_country.lon)
            var to_pos = lat_lon_to_map(to_country.lat, to_country.lon)
            
            var line = Line2D.new()
            line.add_point(from_pos)
            line.add_point(to_pos)
            line.default_color = Color(0.8, 0.6, 0.2, 0.5)
            line.width = route.volume / 1000000
            routes_node.add_child(line)

func highlight_country(country_id):
    for child in labels_node.get_children():
        if child is ColorRect:
            var world_pos = child.global_position

func show_crisis(country_id, crisis_type):
    var country = countries.get(country_id)
    if not country:
        return
    
    var pos = lat_lon_to_map(country.lat, country.lon)
    
    var icon = Label.new()
    icon.text = "!"
    icon.position = pos + Vector2(25, -5)
    icon.add_theme_color_override("font_color", Color.RED)
    icon.add_theme_font_size_override("font_size", 20)
    labels_node.add_child(icon)