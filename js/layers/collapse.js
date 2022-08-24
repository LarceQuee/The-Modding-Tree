// Collapse
function getCadaverGainMult() {
    let mult = new Decimal(1)
    let ucMil = tmp.uc.milestones
    if (hasMilestone('uc', 5)) mult = mult.times(ucMil[5].effect) //Collapse Milestone 5
    if (hasMilestone('uc', 10)) mult = mult.times(ucMil[10].effect) //Collapse Milestone 10
    if (hasAchievement('a', 38)) mult = mult.times(achievementEffect('a', 38)) // Ach 38
    if (hasAchievement('a', 65)) mult = mult.times(achievementEffect('a', 65)) // Ach 65
    return mult
}
function getCadaverEffSoftcapStart() {
    let sc = new Decimal(1e12)
    if (player.p.unlocked) sc = sc.times(tmp.p.buyables[44].effect)
    return sc
}
function getCadaverEffSoftcapPower() {
    return new Decimal(1)
}
function getCadaverEff() {
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    let cadavers = player.uc.points
    let scs = getCadaverEffSoftcapStart()
    let scp = getCadaverEffSoftcapPower()
    let eff = Decimal.log10(rank.plus(tier.times(5)).plus(cadavers).plus(1)).pow(cadavers.plus(1).log(2)).plus(cadavers.sqrt())
    if (eff.gte(scs)) eff = eff.log10().pow(scp.pow(-1)).times(scs.div(scs.log10().pow(scp.pow(-1))))
    return eff
}

function calcCollapseSCS() {
    tmp.uc.sc = new Decimal(100)
    if (player.p.unlocked) tmp.uc.sc = tmp.uc.sc.times(tmp.p.buyables[43].effect)
}

function calcCollapseSacEff() {
    tmp.uc.sacEff = new Decimal(1)
    if (player.p.unlocked) tmp.uc.sacEff = tmp.uc.sacEff.times(tmp.p.buyables[33].effect)
}

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
            onPress() { if (canReset("uc")) doReset("uc") },
            unlocked() { return layerunlocked("uc") }
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
                player[this.layer].lifeEssence = player[this.layer].lifeEssence.plus(player[this.layer].points.times(tmp.uc.sacEff).max(1))
                player[this.layer].points = decimalZero
            },
            style: {
                'min-height': '75px',
                'width': '175px'
            }
        }
    },
    getResetGain() {
        let sc = tmp.uc.sc
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
