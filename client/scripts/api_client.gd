extends Node

const BASE_URL = "http://localhost:3000/api"

var game_state = null

func _ready():
    fetch_game_state()

func fetch_game_state():
    var http = HTTPRequest.new()
    add_child(http)
    http.request(BASE_URL + "/state")
    http.request_completed.connect(_on_state_received)

func _on_state_received(result, response_code, headers, body):
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        game_state = json
        print("Game state loaded: Turn ", game_state.turn)
