extends Control

var market_data = null

func _ready():
    $Panel/Title.text = "Global Trade"

func update_market(market):
    market_data = market
    update_prices()

func update_prices():
    if not market_data:
        return

    var prices_container = $Panel/PricesList
    prices_container.clear()

    for resource in market_data.keys():
        var price = market_data[resource]
        var item = prices_container.add_item(resource)
        prices_container.set_item_text(item, "%s: $%.2f" % [resource, price])

func update_country_trade(country):
    if not country.has("sectors") or not country.sectors.has("trade"):
        return

    var trade_container = $Panel/CountryTradeList
    trade_container.clear()

    for resource in country.sectors.trade.keys():
        var trade = country.sectors.trade[resource]
        var text = "%s: Prod=%d Exp=%d Imp=%d" % [resource, trade.production, trade.export, trade.import]
        var item = trade_container.add_item(text)