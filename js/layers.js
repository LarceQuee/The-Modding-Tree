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
        let auto = player.auto
        player[this.layer].currentVelocity = player[this.layer].currentVelocity.plus(calcAcceleration().times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).min(calcMaxVelocity()).max(0)
        player[this.layer].points = player[this.layer].points.plus(player[this.layer].currentVelocity.times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).max(0)
        if (auto.activeRankbot && auto.unlockedRankbot) {
            auto.timeRankbot = auto.timeRankbot.plus(timeSpeed().times(diff).times(player.tr.timeReverse ? -1 : 1)).min(60)
            if (auto.timeRankbot.gte(tmp.auto.buyables[11].effect)) {
                layers.m.buyables[11].buy()
                //setBuyableAmount(this.layer, 11, new Decimal(player[this.layer].points.div(getRankBaseCost()).max(1).log(2).sqrt().plus(1).times(getRankFP()).plus(1).round().min(player[this.layer].buyables[11].plus(tmp.auto.buyables[12].effect))))
                auto.timeRankbot = auto.timeRankbot.min(0)
            }
        }
        if (auto.activeTierbot && auto.unlockedTierbot) {
            auto.timeTierbot = auto.timeTierbot.plus(timeSpeed().times(diff).times(player.tr.timeReverse ? -1 : 1)).min(60)
            if (auto.timeTierbot.gte(tmp.auto.buyables[21].effect)) {
                layers.m.buyables[12].buy()
                //setBuyableAmount(this.layer, 12, new Decimal(player.m.buyables[11].sub(getTierBaseCost()).max(0).sqrt().times(getTierFP()).add(1).round().min(player.m.buyables[12].plus(tmp.auto.buyables[22].effect))))
                auto.timeTierbot = auto.timeTierbot.min(0)
            }
        }
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
            bulk() {
                return new Decimal(player[this.layer].points.div(getRankBaseCost()).max(1).log(2).sqrt().plus(1).times(getRankFP()).plus(1).round())
            },
            amount() {
                return player.m.buyables[11] = player.m.buyables[11].max(1)
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if(this.canAfford()) {
                    let amount = player[this.layer].buyables[this.id]
                    let effect = tmp.auto.buyables[12].effect
                    setBuyableAmount(this.layer, this.id, player.auto.activeRankbot ? this.bulk().min(amount.add(effect).round()) : getBuyableAmount(this.layer, this.id).add(1))
                    if (!hasMilestone('uc', 12)) {
                        player[this.layer].points.mag = 0
                        player[this.layer].currentVelocity.mag = 0
                    }
                }
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
                return new Decimal(getTierBaseCost()).plus(x.pow(getTierFP()).pow(2)).round()
            },
            bulk() {
                return new Decimal(player.m.buyables[11].sub(getTierBaseCost()).max(0).sqrt().times(getTierFP()).add(1).round())
            },
            canAfford() {
                return player[this.layer].buyables[11].gte(this.cost())
            },
            buy() {
                if (this.canAfford()) {
                    let amount = player[this.layer].buyables[this.id]
                    let effect = tmp.auto.buyables[22].effect
                    setBuyableAmount(this.layer, this.id, player.auto.activeTierbot ? this.bulk().min(amount.add(effect).round()) : getBuyableAmount(this.layer, this.id).add(1))
                    player[this.layer].points.mag = 0
                    player[this.layer].currentVelocity.mag = 0
                    if (!hasMilestone('uc', 11)) {
                        player[this.layer].buyables[11] = decimalOne
                    }
                }
            }
        }
    },
    hotkeys: [
        {
            key: "r",
            description: `R -> Rank Reset`,
            onPress() {
                layers.m.buyables[11].buy()
            },
            unlocked() {
                return true
            }
        },
        {
            key: "t",
            description: `T -> Tier Reset`,
            onPress() {
                layers.m.buyables[12].buy()
            },
            unlocked() {
                return true
            }
        }
    ],
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
    color: "lime",
    row: 0, 
    layerShown(){return true},
    doReset(layer) {
        //let keep = []
        if (layers[layer].row > this.row) {
            player[this.layer].points = decimalZero
            player[this.layer].currentVelocity = decimalZero
            player[this.layer].buyables[11] = decimalOne
            player[this.layer].buyables[12] = decimalZero
        }
        //if (layers[layer].row > this.row) layerDataReset("m", keep)
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
    update(diff) {
        if (getRocketGain().gt(0)) player.r.points = player.r.points.plus(getRocketGain().times(diff))
        let auto = player.auto
        if (auto.activeFuelbot && auto.unlockedFuelbot) {
            auto.timeFuelbot = auto.timeFuelbot.plus(timeSpeed().times(diff).times(player.tr.timeReverse ? -1 : 1)).min(6000)
            if (auto.timeFuelbot.gte(tmp.auto.buyables[31].effect)) {
                layers.r.buyables[11].buy()
                //setBuyableAmount(this.layer, 11, new Decimal(player[this.layer].points.div(getRankBaseCost()).max(1).log(2).sqrt().plus(1).times(getRankFP()).plus(1).round().min(player[this.layer].buyables[11].plus(tmp.auto.buyables[12].effect))))
                auto.timeFuelbot = auto.timeFuelbot.min(0)
            }
        }
    },
    type: "normal",
    layerShown() {
        return player[this.layer].unlocked || player.m.points.gte(5e7)
    },
    requires: new Decimal(5e7),
    resource: "rockets",
    baseResource: "distance",
    tooltip() {
        return `${formatWhole(player[this.layer].points)} rockets<br>${player[this.layer].buyables[11]} Rocket Fuel`
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
    hotkeys: [
        {
            key: "R",
            description: `Shift+R -> Rocket Reset`,
            onPress() {
                if (canReset("r")) doReset("r")
            },
            unlocked() {
                return layerunlocked("r")
            }
        },
        {
            key: "f",
            description: `F -> Rocket Fuel Reset`,
            onPress() {
                layers.r.buyables[11].buy()
            },
            unlocked() {
                return layerunlocked("r")
            }
        }
    ],
    color: "lightgray",
    row: 1,
    buyables: {
        11: {
            display() {
                return `Reset your rockets<br>(but nothing else)<br>to get 1 rocket fuel<br>Req: ${formatWhole(this.cost())} rockets.`
            },
            cost(x) {
                return new Decimal(25).times(Decimal.pow(5, x.pow(1.1))).round()
            },
            bulk() {
                return new Decimal(player[this.layer].points.div(25).max(1).log(5).pow(1 / 1.1).times(1).add(1).floor())
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if (this.canAfford()) {
                    let amount = player[this.layer].buyables[this.id]
                    let effect = tmp.auto.buyables[32].effect
                    setBuyableAmount(this.layer, this.id, player.auto.activeFuelbot ? this.bulk().min(amount.add(effect).round()) : getBuyableAmount(this.layer, this.id).add(1))
                    if (hasAchievement(`a`, 12)) player[this.layer].points = player[this.layer].points.div(2).max(10)
                    else if (hasMilestone(`uc`, 3)) player[this.layer].points = new Decimal(10)
                    else player[this.layer].points = decimalZero
                }
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
            return `You have ${formatWhole(player[this.layer].points)} rockets${getRocketGain().gt(0) ? ` (+${format(getRocketGain())}/sec)` : ``}, which are making your acceleration & maximum velocity boost themselves (log(x+1)<sup>${format(getRocketEffect())}</sup>)${getRocketEffect().gte(getRocketEffectSoftcapStars()) ? ` <b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(softcapped)</b>` : ``}`
        }], "blank",
        "buyables", "blank",
        ["display-text",
        function() {
            return `You have ${formatWhole(player[this.layer].buyables[11])} ${tmp.tr.effect.gt(0) ? `+ ${format(tmp.tr.effect)}` : ``} Rocket Fuel, which boosts the effect of rockets by ${format(getFuelEff().sub(1).times(100))}%, and adds ${format(getFuelEff2())} additional rockets to their effect.`
        }]
    ],
    doReset(layer) {
        //let keep = []
        if (layers[layer].row > this.row) {
            //player[this.layer].unlocked = false
            player[this.layer].points = hasMilestone("uc", 3) ? new Decimal(10) : decimalZero
            player[this.layer].buyables[11] = hasMilestone("uc", 4) ? decimalOne : decimalZero
        }
        //if (layers[layer].row > this.row) layerDataReset("m", keep)
    },
    getResetGain() {
        let sc = getRocketSoftcapStart()
        if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return decimalZero
        let gain = tmp[this.layer].baseAmount.div(tmp[this.layer].requires).pow(tmp[this.layer].exponent)
        if (gain.gte(sc)) gain = gain.sqrt().times(Decimal.sqrt(sc))
        gain = gain.times(tmp[this.layer].gainMult)
        return gain.floor().max(0)
    },
    prestigeButtonText() {
        return `Reset all previous progress to gain <b>${formatWhole(tmp[this.layer].resetGain)}</b> rockets`
    }
})

addLayer("tr", {
    name: "time reversal",
    symbol: "TR",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        timeReverse: false
    }},
    tooltip() {
        return `Time Reversal<br>${format(player[this.layer].points)} Time Cubes`
    },
    layerShown() {
        return player.m.points.gte(9.461e15) || player[this.layer].unlocked
    },
    resource: "Time Cubes",
    color: "magenta",
    row: 1,
    hotkeys: [
        {
            key: "u",
            description: `U -> Time Reversal`,
            onPress() {
                if (layerunlocked("tr")) layers.tr.clickables[11].onClick()
            },
            unlocked() {
                return layerunlocked("tr")
            }
        }
    ],
    update(diff) {
        if (player[this.layer].timeReverse) player[this.layer].points = player[this.layer].points.plus(getTimeCubeGain().times(timeSpeed()).times(diff))
    },
    effect() {
        let cubes = player[this.layer].points
        let softcap = new Decimal(1e20)
        if (cubes.gte(softcap)) cubes = cubes.cbrt().times(Math.pow(softcap, 2 / 3))
        return cubes.plus(1).log10().plus(1).log2()
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
                if (r.gte(1e10)) r = r.pow(0.1).times(1e9)
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
                return Decimal.pow(1.05, player.a.achievements.length)
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        23: {
            description: `Rankbot's interval boosts its magnitude.`,
            cost: new Decimal(7.5e4),
            effect() {
                return Decimal.div(4, tmp.auto.buyables[11].effect.max(1e-10)).pow(1/3).max(1)
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        24: {
            description: `Tierbot's interval boosts its magnitude, but not as strongly as the previous upgrade.`,
            cost: new Decimal(1.2e5),
            effect() {
                return Decimal.div(5, tmp.auto.buyables[21].effect.max(1e-10)).pow(1/5).max(1)
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            }
        },
        25: {
            description: `Rocket gain is increased by 10% for every OoM of Time Cubes (softcaps after a while).`,
            cost: new Decimal(2e5),
            effect() {
                let c = player[this.layer].points
                if (c.gte(1e10)) c = c.pow(0.1).times(1e9)
                return Decimal.pow(1.1, c.plus(1).log10())
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
            return `You have ${format(player[this.layer].points)} Time Cubes (+${format(getTimeCubeGain().times(timeSpeed()))}/sec), translated to ${format(tmp.tr.effect)} free rocket fuel.${player.tr.points.gte(new Decimal(1e20)) ? ` <b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(softcapped)</b>` : ``}`
        }], "blank",
        "upgrades"
    ],
    doReset(layer) {
        //let keep = []
        if (layers[layer].row > this.row) {
            player[this.layer].unlocked = false
            player[this.layer].points = decimalZero
            player[this.layer].timeReverse = false
            if (!hasMilestone("uc", 7)) player[this.layer].upgrades = []
        }
    }
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
                ["raw-html", () => {
                        let html = ""
                        for (let id in RANKS) {
                            let data = RANKS[id]
                            if (data.display)
                                if (data.display()) {
                                    html += "<div><h3>" + data.title + "</h3><br>" + data.info()
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
                ["raw-html", () => {
                        let html = ""
                        for (let id in TIERS) {
                            let data = TIERS[id]
                            if (data.display)
                                if (data.display()) {
                                    html += "<div><h3>" + data.title + "</h3><br>" + data.info()
                                    html += "</div><br><br>"
                                }
                        }
                        return html
                    }]
            ]
        }
    }
})

addLayer("uc", {
    name: "universal collapse",
    symbol: "UC",
    position: 0,
    row: 2,
    type: "normal",
    layerShown() {
        return player[this.layer].unlocked || player.m.points.gte(50*DISTANCE['Mpc'])
    },
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        lifeEssence: new Decimal(0)
    }},
    tooltip() {
        return `Universal Collapse<br>${formatWhole(player[this.layer].points)} Cavaders<br>${formatWhole(player[this.layer].lifeEssence)} life essence`
    },
    requires: new Decimal(50*DISTANCE['Mpc']),
    resource: "cavaders",
    baseResource: "distance",
    color: "purple",
    baseAmount() {
        return player.m.points
    },
    exponent() {
        return 1/10
    },
    gainMult() {
        return getCadaverGainMult()
    },
    hotkeys: [
        {
            key: "c",
            description: `C -> Collapse Reset`,
            onPress() {
                if (canReset("uc")) doReset("uc")
            },
            unlocked() {
                return layerunlocked("uc")
            }
        }
    ],
    milestones: {
        1: {
            requirementDescription: "1 Life Essence (1)",
            effectDescription: "Time goes by 100x faster, but this gets weaker the further you go (minimum 2x, at 50 Mpc).",
            effect() {
                let distance = player.m.points
                return new Decimal(100).div(distance.plus(1).pow(0.06989).plus(1).min(50))
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            },
            done() {
                return player[this.layer].lifeEssence.gte(1)
            }
        },
        2: {
            requirementDescription: "2 Life Essence (2)",
            effectDescription: "Time goes by faster.",
            effect() {
                return new Decimal(5)
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            },
            done() {
                return player[this.layer].lifeEssence.gte(2)
            }
        },
        3: {
            requirementDescription: "3 Life Essence (3)",
            effectDescription: "Start with 10 Rockets on reset.",
            done() {
                return player[this.layer].lifeEssence.gte(3)
            }
        },
        4: {
            requirementDescription: "5 Life Essence (4)",
            effectDescription: "Start with 1 Rocket Fuel on reset.",
            done() {
                return player[this.layer].lifeEssence.gte(5)
            }
        },
        5: {
            requirementDescription: "10 Life Essence (5)",
            effectDescription: "Unlock Fuelbot, and Cadaver gain is boosted by Time Cubes.",
            effect() {
                let cubes = player.tr.points
                let eff = new Decimal(cubes).plus(1).log10().plus(1).log10().plus(1)
                if (eff.gte(2.5)) eff = eff.log(2.5).plus(1.5)
                return eff
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            },
            done() {
                return player[this.layer].lifeEssence.gte(10)
            }
        },
        6: {
            requirementDescription: "15 Life Essence (6)",
            effect() {
                return new Decimal(10)
            },
            effectDescription: "Gain 10x more Rockets.",
            done() {
                return player[this.layer].lifeEssence.gte(15)
            }
        },
        7: {
            requirementDescription: "25 Life Essence (7)",
            effectDescription: "Keep Time Reversal upgrades or reset.",
            done() {
                return player[this.layer].lifeEssence.gte(25)
            }
        },
        8: {
            requirementDescription: "50 Life Essence (8)",
            effectDescription: "Time Speed multiplies Rocket gain at a reduced rate.",
            effect() {
                let eff = new Decimal(timeSpeed()).plus(1).log(2).max(1)
                if (eff.gte(50)) eff = eff.times(2).log10().times(25)
                return eff
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            },
            done() {
                return player[this.layer].lifeEssence.gte(50)
            }
        },
        9: {
            requirementDescription: "75 Life Essence (9)",
            effectDescription: "Gain 1% of Rocket gain every second (unaffected by Time Speed).",
            done() {
                return player[this.layer].lifeEssence.gte(75)
            }
        },
        10: {
            requirementDescription: "100 Life Essence (10)",
            effectDescription: "Life Essence boosts Cadavar gain.",
            effect() {
                let lifeEssence = player[this.layer].lifeEssence
                let eff = new Decimal(lifeEssence).plus(1).log10().plus(1).sqrt().pow(8)
                if (eff.gte(40)) eff = eff.times(2.5).log10().times(20)
                return eff
            },
            tooltip() {
                return `Currently: ${format(this.effect())}x`
            },
            done() {
                return player[this.layer].lifeEssence.gte(100)
            }
        },
        11: {
            requirementDescription: "1000 Life Essence (11)",
            effectDescription: "Tiers do not reset Ranks.",
            done() {
                return player[this.layer].lifeEssence.gte(1000)
            }
        },
        12: {
            requirementDescription: "10000 Life Essence (12)",
            effectDescription: "Ranks do not reset anything.",
            done() {
                return player[this.layer].lifeEssence.gte(10000)
            }
        },
    },
    clickables: {
        11: {
            display() {
                return "Sacrifice all your cadavers into life essence."
            },
            canClick() {
                return player[this.layer].points.gt(0)
            },
            onClick() {
                player[this.layer].lifeEssence = player[this.layer].lifeEssence.plus(player[this.layer].points.max(1))
                player[this.layer].points = decimalZero
            },
            style: {
                'min-height': '75px',
                'width': '175px'
            }
        }
    },
    getResetGain() {
        let sc = new Decimal(100)
        if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return decimalZero
        let gain = tmp[this.layer].baseAmount.div(tmp[this.layer].requires).pow(tmp[this.layer].exponent)
        if (gain.gte(sc)) gain = gain.sqrt().times(Decimal.sqrt(sc))
        gain = gain.times(tmp[this.layer].gainMult)
        return gain.floor().max(0)
    },
    prestigeButtonText() {
        return `Reset all previous progress to gain <b style="color: #7f698c; text-shadow: #958e99 0px 0px 10px">${formatWhole(tmp[this.layer].resetGain)}</b> cavaders ${this.getResetGain().gte(100) ? `<b  style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(softcapped)</b>` : ``}`
    },
    tabFormat: [
        "prestige-button", "blank",
        ["display-text",
        function() {
            return `You have <h2 style="color: purple; text-shadow: purple 0px 0px 10px">${formatWhole(player[this.layer].points)}</h2> cadavers, which make time go <h2 style="color: purple; text-shadow: purple 0px 0px 10px">${format(getCadaverEff())}</h2>x faster.${getCadaverEff().gte(getCadaverEffSoftcapStart()) ? ` <b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(softcapped)</b>` : ``}`
        }], "blank",
        "clickables", "blank",
        ["display-text",
        function() {
            return `You have <h2 style="color: green; text-shadow: green 0px 0px 10px">${formatWhole(player[this.layer].lifeEssence)}</h2> life essence.`
        }], "blank",
        "milestones"
    ]
})