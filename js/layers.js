addLayer("m", {
    name: "main", 
    symbol: "M", 
    position: 0, 
    startData() { return {
        unlocked: true,
        distance: new Decimal(0),
        currentVelocity: new Decimal(0)
    }},
    tooltip: "Main",
    maxVel() {
        return calcMaxVelocity()
    },
    acc() {
        return calcAcceleration()
    },
    update(diff) {
        player[this.layer].currentVelocity = player[this.layer].currentVelocity.plus(calcAcceleration().times(diff)).min(calcMaxVelocity())
        player[this.layer].distance = player[this.layer].distance.plus(player[this.layer].currentVelocity.times(diff))
    },
    buyables: {
        11: {
            title() {
                return `Rank ${formatWhole(player[this.layer].buyables[this.id])}`
            },
            display() {
                return `Reset your journey,<br>but rank up.<br>Req: ${format(this.cost())} distance.`
            },
            cost(x) {
                return new Decimal(getRankBaseCost()).times(Decimal.pow(2,x.div(getRankFP()).max(1).sub(1).pow(2)))
            },
            amount() {
                player.m.buyables[11] = player.m.buyables[11].max(1)
            },
            canAfford() {
                return player[this.layer].distance.gte(this.cost())
            },
            buy() {
                player[this.layer].distance.mag = 0
                player[this.layer].currentVelocity.mag = 0
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        12: {
            title() {
                return `Tier ${formatWhole(player[this.layer].buyables[this.id])}`
            },
            display() {
                return `Reset your ranks,<br>but tier up.<br>Req: Rank ${this.cost()}.`
            },
            cost(x) {
                return new Decimal(getTierBaseCost()).plus(x.pow(getTierFP()).pow(2))
            },
            canAfford() {
                return player[this.layer].buyables[11].gte(this.cost())
            },
            buy() {
                player[this.layer].distance.mag = 0
                player[this.layer].currentVelocity.mag = 0
                player[this.layer].buyables[11] = decimalOne
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        }
    },
    tabFormat: [
        ["display-text", 
        function() {
            return `You have gone a total of ${format(player[this.layer].distance)} (+${format(player[this.layer].currentVelocity)} /sec).`
        }],
        ["display-text", 
        function() {
            return `You current velocity is ${format(player[this.layer].currentVelocity)} /s (+${format(calcAcceleration())} /sec). (Maximum Velocity: ${format(calcMaxVelocity())} /s).`
        }],
        ["display-text", 
        function() {
            return `You current acceleration is ${format(calcAcceleration())} /s<sup>2</sup>.`
        }],
        "blank",
        "buyables"
    ],
    color: "#4BDC13",
    row: 0, 
    layerShown(){return true}
})

addLayer("r", {
    name: "rewards",
    symbol: "R",
    row: "side",
    tooltip: "Rewards",
    tabFormat: {
        "Rank": {
            content: [
                "blank",
                ["raw-html", function() {
                    let html = ""
                    for (let id in RANKS) {
                        let data = RANKS[id];
                        if (data.display) if (data.display()) {
                            html += "<div><h3>"+data.title+"</h3><br>"+data.info();
                            html += "</div><br><br>"
                        }
                    }
                    return html
                }]
            ]
        },
        "Tier": {
            content: [
                "blank",
                ["raw-html", function() {
                    let html = ""
                    for (let id in TIERS) {
                        let data = TIERS[id];
                        if (data.display) if (data.display()) {
                            html += "<div><h3>"+data.title+"</h3><br>"+data.info();
                            html += "</div><br><br>"
                        }
                    }
                    return html
                }]
            ]
        }
    }
})
