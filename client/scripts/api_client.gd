extends Node

const BASE_URL = "http://localhost:3000/api"

var game_state = null
var pending_actions = []

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
        get_node("/root/Main/GameState").update_from_server(game_state)
        update_hud()

func send_action(action):
    pending_actions.append(action)

func end_turn():
    var http = HTTPRequest.new()
    add_child(http)
    
    var body = JSON.stringify({ playerActions: pending_actions })
    var headers = ["Content-Type: application/json"]
    
    http.request(BASE_URL + "/turn/process", headers, HTTPClient.METHOD_POST, body)
    http.request_completed.connect(_on_turn_processed)
    
    pending_actions.clear()

func _on_turn_processed(result, response_code, headers, body):
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        game_state = json
        get_node("/root/Main/GameState").update_from_server(game_state)
        update_hud()

func update_hud():
    var turn_label = get_node("/root/Main/CanvasLayer/HUD/TurnLabel")
    turn_label.text = "Turn: " + str(game_state.turn)

    var end_turn_button = get_node("/root/Main/CanvasLayer/HUD/EndTurnButton")
    if end_turn_button:
        end_turn_button.pressed.connect(end_turn)