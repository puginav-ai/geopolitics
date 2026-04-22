extends Control

func _ready():
    $Panel/Title.text = "Climate"

func update_climate(data):
    var info = $Panel/ClimateInfo
    info.clear()
    
    info.append_text("Global Temperature: +%.2f°C\n\n" % data.globalTemperature)
    info.append_text("Active Weather Events:\n")
    
    for event in data.active:
        info.append_text("- %s in %s (duration: %d turns)\n" % [event.type, event.country, event.duration])
