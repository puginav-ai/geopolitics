extends Control

var selected_country = null

func _ready():
    $Panel/Title.text = "Demographics"

func update_country(country):
    selected_country = country
    refresh()

func refresh():
    if not selected_country:
        return

    var demo = selected_country.demographics if selected_country.has("demographics") else {}
    var info = $Panel/DemoInfo
    info.clear()

    info.append_text("Population: %d\n\n" % selected_country.population)
    info.append_text("Birth Rate: %.2f\n" % (demo.birth_rate if demo else 0))
    info.append_text("Death Rate: %.2f\n" % (demo.death_rate if demo else 0))
    info.append_text("Urbanization: %.1f%%\n" % (demo.urbanization if demo else 0))
    info.append_text("Migration: %d\n\n" % (demo.migration if demo else 0))
    info.append_text("Education Level: %d\n" % (demo.education_level if demo else 0))
    info.append_text("Quality of Life: %d\n\n" % (selected_country.qualityOfLife if selected_country.has("qualityOfLife") else 0))

    if demo and demo.income_distribution:
        var dist = demo.income_distribution
        info.append_text("Income Distribution:\n")
        info.append_text("Poor: %d%%\n" % dist.poor)
        info.append_text("Middle: %d%%\n" % dist.middle)
        info.append_text("Rich: %d%%" % dist.rich)