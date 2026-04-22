extends Control

func _ready():
    $Panel/Title.text = "Resource Deposits"

func update_deposits(deposits):
    var list = $Panel/DepositsList
    list.clear()

    for deposit_id in deposits.keys():
        var deposit = deposits[deposit_id]
        var text = "%s: " % deposit.region
        var resources = []
        for resource in deposit.keys():
            if resource != 'region' and resource != 'controlledBy' and resource != 'controlledBy':
                resources.push_back("%s=%d" % [resource, deposit[resource]])
        text += resources.join(", ")
        list.add_item(text)