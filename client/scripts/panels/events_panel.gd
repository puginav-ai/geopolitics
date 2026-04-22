extends Control

var events = []

func _ready():
    $Panel/Title.text = "Events"

func update_events(new_events):
    events = new_events
    refresh_list()

func refresh_list():
    var list = $Panel/EventsList
    list.clear()
    
    for event in events:
        var text = "[%s] %s" % [event.type.to_upper(), event.name]
        if event.country:
            text += " - " + event.country
        list.add_item(text)

func _on_EventSelected(index):
    if index < events.size():
        var event = events[index]
        $Panel/EventDetails.text = event.description if event.has("description") else event.name
