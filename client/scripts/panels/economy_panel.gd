extends Control

var country_data = null

func _ready():
    $Panel/SectorTabs/AgTab/Label.text = "Agriculture"
    $Panel/SectorTabs/IndTab/Label.text = "Industry"
    $Panel/SectorTabs/EnergyTab/Label.text = "Energy"
    $Panel/SectorTabs/SvcTab/Label.text = "Services"

func update_data(country):
    country_data = country
    update_agriculture()
    update_industry()
    update_energy()
    update_services()

func update_agriculture():
    var ag = country_data.sectors.agriculture
    $Panel/SectorTabs/AgTab/Production.text = "Production: %d" % ag.production
    $Panel/SectorTabs/AgTab/Jobs.text = "Jobs: %d" % ag.jobs

func update_industry():
    var ind = country_data.sectors.industry
    $Panel/SectorTabs/IndTab/Production.text = "Production: %d" % ind.production
    $Panel/SectorTabs/IndTab/Jobs.text = "Jobs: %d" % ind.jobs

func update_energy():
    var energy = country_data.sectors.energy
    $Panel/SectorTabs/EnergyTab/Production.text = "Production: %d MW" % energy.production
    $Panel/SectorTabs/EnergyTab/Consumption.text = "Consumption: %d MW" % energy.consumption

func update_services():
    var svc = country_data.sectors.services
    $Panel/SectorTabs/SvcTab/GDPShare.text = "GDP Share: %d%%" % svc.gdp_share
    $Panel/SectorTabs/SvcTab/Jobs.text = "Jobs: %d" % svc.jobs