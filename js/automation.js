addLayer("auto", {
    name: "automation",
    symbol: "Au",
    color: "white",
    startData() { return {
        unlocked: false,
        scraps: new Decimal(0),
        intelligence: new Decimal(0),
        unlockedRankbot: false,
        activeRankbot: true,
        timeRankbot: new Decimal(0),
        unlockedTierbot: false,
        activeTierbot: true,
        timeTierbot: new Decimal(0),
        unlockedFuelbot: false,
        activeFuelbot: true,
        timeFuelbot: new Decimal(0)
    }},
    layerShown() {
        return player.m.points.gte(1e12) || player[this.layer].unlocked
    },
    requires: new Decimal(1e12),
    update(diff) {
        if (layerunlocked("auto")) {
            player[this.layer].scraps = player[this.layer].scraps.plus(getScrapGain().times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).max(0)
            player[this.layer].intelligence = player[this.layer].intelligence.plus(getIntelligenceGain().times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).max(0)
        }
    },
    clickables: {
        11: {
            display() {
                return `Purchase the Rankbot for 10 scraps.`
            },
            canClick() {
                return player[this.layer].scraps.gte(10)
            },
            onClick() {
                player[this.layer].unlockedRankbot = !player[this.layer].unlockedRankbot
                player[this.layer].scraps = player[this.layer].scraps.minus(10)
            },
            unlocked() {
                return !player[this.layer].unlockedRankbot
            },
            style: {
                'min-height': '33px',
                'min-width': '100px'
            }
        },
        12: {
            display() {
                return `Purchase the Tierbot for 50 scraps.`
            },
            canClick() {
                return player[this.layer].scraps.gte(50)
            },
            onClick() {
                player[this.layer].unlockedTierbot = !player[this.layer].unlockedTierbot
                player[this.layer].scraps = player[this.layer].scraps.minus(50)
            },
            unlocked() {
                return !player[this.layer].unlockedTierbot
            },
            style: {
                'min-height': '33px',
                'min-width': '100px'
            }
        },
        13: {
            display() {
                return `Purchase the Fuelbot for 1e6 scraps.`
            },
            canClick() {
                return player[this.layer].scraps.gte(1e6)
            },
            onClick() {
                player[this.layer].unlockedFuelbot = !player[this.layer].unlockedFuelbot
                player[this.layer].scraps = player[this.layer].scraps.minus(1e6)
            },
            unlocked() {
                return !player[this.layer].unlockedFuelbot
            },
            style: {
                'min-height': '33px',
                'min-width': '100px'
            }
        },
        21: {
            display: `<h3>Max All</h3>`,
            canClick: false,
            tooltip() {
                return `Not yet.`
            },
            onClick() {
                false //player.subtabs.auto.robot_content
            },
            style: {
                'min-height' : '33px',
                'min-width' : '50px'
            }
        }
    },
    buyables: {
        11: {
            title() { return `Upgrade Interval` },
            display() { return `<b>Interval</b>: ${formatTime(this.effect())}<br>Cost: ${formatWhole(this.cost())} intelligence.` },
            tooltip() { return `The interval is how quickly the robot can purnase their designated upgrade.` },
            cost() { return getIntCost(this.id) },
            effect(x) { return new Decimal(4).div(x.plus(1)) },
            canAfford() { return player[this.layer].intelligence.gte(this.cost()) },
            buy() {
                if(this.canAfford()) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player[this.layer].intelligence = player[this.layer].intelligence.minus(this.cost())
                }
            }
        },
        12: {
            title() { return `Upgrade Magnitude` },
            display() { return `<b>Magnitude</b>: ${format(this.effect())}<br>Cost: ${formatWhole(this.cost())} intelligence.` },
            tooltip() { return `The magnitude is how many the robot can purnase at once.` },
            cost() { return getMagCost(this.id) },
            effect(x) { return player[this.layer].activeRankbot ? new Decimal(x).pow(2).plus(1).pow(upgradeEffect("tr", 23)) : new Decimal(0) },
            canAfford() { return player[this.layer].intelligence.gte(this.cost()) },
            buy() {
                if(this.canAfford()) {
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    player[this.layer].intelligence = player[this.layer].intelligence.minus(this.cost())
                }
            }
        },
        21: {
            title() {
                return `Upgrade Interval`
            },
            display() {
                return `<b>Interval</b>: ${formatTime(this.effect())}<br>Cost: ${formatWhole(this.cost())} intelligence.`
            },
            tooltip() {
                return `The interval is how quickly the robot can purnase their designated upgrade.`
            },
            cost() {
                return getIntCost(this.id)
            },
            effect(x) {
                return new Decimal(5).div(x.plus(1))
            },
            canAfford() {
                return player[this.layer].intelligence.gte(this.cost())
            },
            buy() {
                if(this.canAfford()) {
                    player[this.layer].intelligence = player[this.layer].intelligence.minus(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            }
        },
        22: {
            title() {
                return `Upgrade Magnitude`
            },
            display() {
                return `<b>Magnitude</b>: ${format(this.effect())}<br>Cost: ${formatWhole(this.cost())} intelligence.`
            },
            tooltip() {
                return `The magnitude is how many the robot can purnase at once.`
            },
            cost() {
                return getMagCost(this.id)
            },
            effect(x) {
                return player[this.layer].activeTierbot ? new Decimal(x).pow(2).plus(1).pow(upgradeEffect("tr", 24)) : new Decimal(0)
            },
            canAfford() {
                return player[this.layer].intelligence.gte(this.cost())
            },
            buy() {
                if(this.canAfford()) {
                    player[this.layer].intelligence = player[this.layer].intelligence.minus(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            }
        },
        31: {
            title() {
                return `Upgrade Interval`
            },
            display() {
                return `<b>Interval</b>: ${formatTime(this.effect())}<br>Cost: ${formatWhole(this.cost())} intelligence.`
            },
            tooltip() {
                return `The interval is how quickly the robot can purnase their designated upgrade.`
            },
            cost() {
                return getIntCost(this.id)
            },
            effect(x) {
                return new Decimal(3600).div(x.plus(1))
            },
            canAfford() {
                return player[this.layer].intelligence.gte(this.cost())
            },
            buy() {
                if(this.canAfford()) {
                    player[this.layer].intelligence = player[this.layer].intelligence.minus(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            }
        },
        32: {
            title() {
                return `Upgrade Magnitude`
            },
            display() {
                return `<b>Magnitude</b>: ${format(this.effect())}<br>Cost: ${formatWhole(this.cost())} intelligence.`
            },
            tooltip() {
                return `The magnitude is how many the robot can purnase at once.`
            },
            cost() {
                return getMagCost(this.id)
            },
            effect(x) {
                return player[this.layer].activeFuelbot ? new Decimal(x).pow(2).plus(1) : new Decimal(0)
            },
            canAfford() {
                return player[this.layer].intelligence.gte(this.cost())
            },
            buy() {
                if(this.canAfford()) {
                    player[this.layer].intelligence = player[this.layer].intelligence.minus(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            }
        }
    },
    row: "side",
    tooltip: "Automation",
    microtabs: {
        robot_content: {
            "Rankbot": {
                content: [
                    ["clickable", [21]],
                    ["buyables", [1]],
                    ["row", [["display-text", function() {
                        return `Activate: `
                    }], ["toggle", ["auto", "activeRankbot"]]]]
                ],
                unlocked() {
                    return player.auto.unlockedRankbot
                }
            },
            "Tierbot": {
                content: [
                    ["clickable", [21]],
                    ["buyables", [2]],
                    ["row", [["display-text", function() {
                        return `Activate: `
                    }], ["toggle", ["auto", "activeTierbot"]]]]
                ],
                unlocked() {
                    return player.auto.unlockedTierbot
                }
            },
            "Fuelbot": {
                content: [
                    ["clickable", [21]],
                    ["buyables", [3]],
                    ["row", [["display-text", function() {
                        return `Activate: `
                    }], ["toggle", ["auto", "activeFuelbot"]]]]
                ],
                unlocked() {
                    return player.auto.unlockedFuelbot
                }
            }
        }
    },
    tabFormat: [
        "blank",
        ["display-text", function() {
            return `You have ${format(player[this.layer].scraps)} scraps (+${format(getScrapGain().times(timeSpeed()))}/sec). You have ${format(player[this.layer].intelligence)} intelligence (+${format(getIntelligenceGain().times(timeSpeed()))}/sec).`
        }], "blank",
        ["clickables", [1]],
        ()=> (player.auto.unlockedRankbot + player.auto.unlockedTierbot + player.auto.unlockedFuelbot > 0) ? ["microtabs","robot_content"] : "blank"
    ]
})