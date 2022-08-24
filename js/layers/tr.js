// Time Reversal
function getTimeCubeGain() {
    let gain = new Decimal(1)
    if (hasUpgrade("tr", 11)) gain = gain.times(upgradeEffect("tr", 11)) //Time Cube Upgrade 1
    if (hasUpgrade("tr", 14)) gain = gain.times(upgradeEffect("tr", 14)) //Time Cube Upgrade 4
    if (player.p.unlocked) gain = gain.times(tmp.p.buyables[22].effect)
    if (hasAchievement("a", 55)) gain = gain.times(achievementEffect("a", 55)) //Ach 55
    return gain
}

function timeSpeed() {
    tmp.timeSpeed = new Decimal(1)
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    if (hasUpgrade("tr", 12)) tmp.timeSpeed = tmp.timeSpeed.times(upgradeEffect("tr", 12)) //Time Cube Upgrade 2
    if (hasUpgrade("tr", 22)) tmp.timeSpeed = tmp.timeSpeed.times(upgradeEffect("tr", 22)) //Time Cube Upgrade 7
    if (rank.gt(35)) tmp.timeSpeed = tmp.timeSpeed.times(RANKS["rank_36"].effect) //Rank 36
    if (rank.gt(45)) tmp.timeSpeed = tmp.timeSpeed.times(RANKS["rank_46"].effect) //Rank 46
    if (tier.gt(6)) tmp.timeSpeed = tmp.timeSpeed.times(TIERS["tier_7"].effect) //Tier 7
    if (tier.gt(7)) tmp.timeSpeed = tmp.timeSpeed.times(TIERS["tier_8"].effect()) //Tier 8
    if (hasAchievement("a", 17)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 17)) //Ach 17
    if (hasAchievement("a", 18)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 18)) //Ach 18
    if (hasAchievement("a", 27)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 27)) //Ach 27
    if (hasAchievement("a", 47)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 47)) //Ach 47
    if (hasAchievement("a", 52)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 52)) //Ach 52
    if (hasAchievement("a", 57)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 57)) //Ach 57
    if (hasAchievement("a", 67)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 67)) //Ach 67
    tmp.timeSpeed = tmp.timeSpeed.times(getCadaverEff().max(1))
    if (hasMilestone("uc", 1)) tmp.timeSpeed = tmp.timeSpeed.times(tmp.uc.milestones[1].effect) //Collapse Milestone 1
    if (hasMilestone("uc", 2)) tmp.timeSpeed = tmp.timeSpeed.times(tmp.uc.milestones[2].effect) //Collapse Milestone 2
    return tmp.timeSpeed
}

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
    requires: new Decimal(DISTANCE.ly),
    layerShown() {
        return player.m.points.gte(DISTANCE.ly) || player[this.layer].unlocked
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
        if (player[this.layer].timeReverse && player[this.layer].unlocked) player[this.layer].points = player[this.layer].points.plus(getTimeCubeGain().times(timeSpeed()).times(diff))
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
            description: () => `Time goes by (log(n+1)) times faster, where <i>n</i> is your Time Cubes.${tmp.p.buyables[11].effect.gt(1) ? `<b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px"> (^${format(tmp.p.buyables[11].effect)})</b>` : ``}`, //  ${getPathogenUpgEff(11).gt(1) ? `<b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(^${format(getPathogenUpgEff(11))})</b>` : ``}
            cost: new Decimal(300),
            effect() {
                let pow = new Decimal(1)
                if (player.p.unlocked) pow = pow.times(tmp.p.buyables[11].effect)
                return new Decimal(player[this.layer].points.plus(1).log10().plus(1).pow(pow))
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
