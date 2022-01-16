addLayer("m", {
    name: "main", 
    symbol: "M", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        currentVelocity: new Decimal(0)
    }},
    tooltip() {
        return `Main<br>${formatDistance(player[this.layer].points)}<br>${player[this.layer].buyables[11]} Rank | ${player[this.layer].buyables[12]} Tier`
    },
    update(diff) {
        player[this.layer].currentVelocity = player[this.layer].currentVelocity.plus(calcAcceleration().times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).min(calcMaxVelocity()).max(0)
        player[this.layer].points = player[this.layer].points.plus(player[this.layer].currentVelocity.times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).max(0)
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
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                player[this.layer].points.mag = 0
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
                player[this.layer].points.mag = 0
                player[this.layer].currentVelocity.mag = 0
                player[this.layer].buyables[11] = decimalOne
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        }
    },
    tabFormat: [
        () => timeSpeed() != 1 ? ["display-text", `Time Speed: ${format(timeSpeed())}x`] : `blank`,
        ["display-text", 
        function() {
            return `You have gone a total of ${formatDistance(player[this.layer].points)} (+${formatDistance(player[this.layer].currentVelocity.times(timeSpeed()))}/sec).`
        }],
        ["display-text", 
        function() {
            return `You current velocity is ${formatDistance(player[this.layer].currentVelocity)}/s (+${formatDistance(calcAcceleration().times(timeSpeed()))}/sec). (Maximum Velocity: ${formatDistance(calcMaxVelocity())}/s).`
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

addLayer("r", {
    name: "rockets",
    symbol: "R",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    type: "normal",
    layerShown() {
        return player.m.points.gte(5e7) || player[this.layer].unlocked
    },
    requires: new Decimal(5e7),
    resource: "rockets",
    baseResource: "distance",
    tooltip() {
        return `${player[this.layer].points} rockets<br>${player[this.layer].buyables[11]} Rocket Fuel`
    },
    baseAmount() {
        return player.m.points
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
            return `You have ${formatWhole(player[this.layer].buyables[11])} ${tmp.tr.effect.gt(0) ? `+ ${format(tmp.tr.effect)}` : ``} Rocket Fuel, which boosts the effect of rockets by ${format(getFuelEff().sub(1).times(100))}%, and adds ${format(getFuelEff2())} additional rockets to their effect.`
        }]
    ]
})

addLayer("tr", {
    name: "time reversal",
    symbol: "TR",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        timeReverse: false
    }},
    tooltip() {
        return `Time Reversal<br>${format(player[this.layer].points)} Time Cubes`
    },
    layerShown() {
        return player.m.points.gte(9.461e15) || player[this.layer].points.gt(0)
    },
    resource: "Time Cubes",
    color: "#F037EA",
    row: 1,
    update(diff) {
        if (player[this.layer].timeReverse) player[this.layer].points = player[this.layer].points.plus(getTimeCubeGain().times(timeSpeed()).times(diff))
    },
    effect() {
        return player[this.layer].points.plus(1).log(10).plus(1).log(2)
    },
    clickables: {
        11: {
            display() {
                return (player[this.layer].timeReverse ? `<b>Bring Time back to normal.</b>` : `<b>Reverse Time.</b>`)
            },
            canClick() {
                return true
            },
            onClick() {
                player[this.layer].timeReverse = !player[this.layer].timeReverse
            },
            style: {
                'min-height': '75px',
                'width': '125px'
            }
        }
    },
    upgrades: {
        11: {
            description: `Increase Time Cube gain by 10% for each Rank or Tier.`,
            cost: new Decimal(50),
            effect() {
                let rank = player.m.buyables[11]
                let tier = player.m.buyables[12]
                return Decimal.pow(1.1, rank.plus(tier))
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        12: {
            description: `Time goes by (log(n+1)) times faster, where <i>n</i> is your Time Cubes.`,
            cost: new Decimal(300),
            effect() {
                return new Decimal(player[this.layer].points.plus(1).log10().plus(1))
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        13: {
            description: `The Rank requirement formula is 10% slower.`,
            cost: new Decimal(1000)
        },
        14: {
            description: `Time Cube gain is increased by 33% for every OoM of Rockets (softcaps after a while).`,
            cost: new Decimal(2500),
            effect() {
                let r = player.r.points
                if (r.gte(1e10)) r = r.pow(0.1.times(1e9))
                return Decimal.pow(1.33, r.plus(1).log(10))
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        15: {
            description: `Rocket Fuel is 10% stronger.`,
            cost: new Decimal(1.5e4)
        },
        21: {
            description: `Scrap & Intelligence gain are increased by 10% for every OoM of Time Cubes.`,
            cost: new Decimal(2.5e4),
            effect() {
                return Decimal.pow(1.1, player[this.layer].points.plus(1).log10())
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        22: {
            description: `Time goes by 5% faster for every achievement gotten.`,
            cost: new Decimal(4e4),
            effect() {
                return Decimal.pow(1.05, 0)
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        23: {
            description: `Rankbot's interval boosts its magnitude.`,
            cost: new Decimal(7.5e4),
            tooltip() {
                return `Not realisated`
            }
        },
        24: {
            description: `Tierbot's interval boosts its magnitude, but not as strongly as the previous upgrade.`,
            cost: new Decimal(1.2e5),
            tooltip() {
                return `Not realisated`
            }
        },
        25: {
            description: `Rocket gain is increased by 10% for every OoM of Time Cubes (softcaps after a while).`,
            cost: new Decimal(2e5),
            effect() {
                let c = player[this.layer].points
                if (c.gte(1e10)) c = c.pow(0.1).times(1e9)
                return Decimal.pow(1.1, player[this.layer].points.plus(1).log10())
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        }
    },
    tabFormat: [
        "clickables", "blank",
        ["display-text",
        function() {
            return `You have ${format(player[this.layer].points)} Time Cubes (+${format(getTimeCubeGain().times(timeSpeed()))}/sec), translated to ${format(tmp.tr.effect)} free rocket fuel.`
        }], "blank",
        "upgrades"
    ]
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