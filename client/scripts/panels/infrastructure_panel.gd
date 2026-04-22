extends Control

var selected_country = null

func _ready():
    $Panel/Title.text = "Infrastructure"

func update_country(country):
    selected_country = country
    refresh()

func refresh():
    if not selected_country or not selected_country.has("infrastructure"):
        return

    var inf = selected_country.infrastructure
    var info = $Panel/InfraInfo
    info.clear()

    info.append_text("Railways: %d km\n" % inf.railways)
    info.append_text("Highways: %d km\n" % inf.highways)
    info.append_text("Ports: %d\n" % inf.ports)
    info.append_text("Airports: %d\n" % inf.airports)
    info.append_text("Pipelines: %d km\n" % inf.pipelines)
    info.append_text("Grid Efficiency: %d%%\n\n" % inf.electricity_grid)
    info.append_text("Logistics Efficiency: %d%%" % selected_country.logisticsEfficiency)