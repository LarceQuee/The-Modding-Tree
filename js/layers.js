addLayer("m", {
    name: "main", 
    symbol: "M", 
    position: 0, 
    startData() { return {
        unlocked: true,
        distance: new Decimal(0),
        currentVelocity: new Decimal(0)
    }},
    tooltip() {
        return `Main<br>${formatDistance(player[this.layer].distance)}<br>${player[this.layer].buyables[11]} Rank | ${player[this.layer].buyables[12]} Tier`
    },
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
                return `Reset your journey,<br>but rank up.<br>Req: ${formatDistance(this.cost())}.`
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
            return `You have gone a total of ${formatDistance(player[this.layer].distance)} (+${formatDistance(player[this.layer].currentVelocity)}/sec).`
        }],
        ["display-text", 
        function() {
            return `You current velocity is ${formatDistance(player[this.layer].currentVelocity)}/s (+${formatDistance(calcAcceleration())}/sec). (Maximum Velocity: ${formatDistance(calcMaxVelocity())}/s).`
        }],
        ["display-text", 
        function() {
            return `You current acceleration is ${formatDistance(calcAcceleration())}/s<sup>2</sup>.`
        }],
        "blank",
        "buyables"
    ],
    color: "#1DC42B",
    row: 0, 
    layerShown(){return true}
})

addLayer("re", {
    name: "rewards",
    symbol: "Re",
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

addLayer("r", {
    name: "rockets",
    symbol: "R",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    type: "normal",
    requires: new Decimal(5e7),
    resource: "rockets",
    baseResource: "distance",
    tooltip() {
        return `${player[this.layer].points} rockets<br>${player[this.layer].buyables[11]} Rocket Fuel`
    },
    baseAmount() {
        return player.m.distance
    },
    exponent() {
        return 2/5
    },
    gainMult() {
        return getRocketGainMult()
    },
    color: "#BFBFBF",
    row: 1,
    buyables: {
        11: {
            display() {
                return `Reset your rockets<br>(but nothing else)<br>to get 1 rocket fuel<br>Req: ${formatWhole(this.cost())} rockets.`
            },
            cost(x) {
                return new Decimal(25).times(Decimal.pow(5, x.pow(1.1))).round()
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                player[this.layer].points = decimalZero
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            style: {
                'height': '100px',
                'width': '175px'
            }
        }
    },
    tabFormat: [
        "prestige-button", "blank",
        ["display-text",
        function() {
            return `You have ${formatWhole(player[this.layer].points)} rockets, which are making your acceleration & maximum velocity boost themselves (log(x+1)<sup>${format(getRocketEffect())}</sup>)`
        }], "blank",
        "buyables", "blank",
        ["display-text",
        function() {
            return `You have ${formatWhole(player[this.layer].buyables[11])} Rocket Fuel, which boosts the effect of rockets by ${format(getFuelEff().sub(1).times(100))}%, and adds ${format(getFuelEff2())} additional rockets to their effect.`
        }]
    ]
})