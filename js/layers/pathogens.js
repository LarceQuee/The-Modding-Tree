// Pathogens
function getPathogenGain() {
    tmp.p.st = new Decimal(1.25)
    tmp.p.gainLEpart = player.uc.lifeEssence.plus(1).log10().plus(1).pow(0.1).sub(1)
    tmp.p.gainPTHpart = player.p.points.plus(1).log10().plus(1)
    tmp.p.gain = tmp.p.gainLEpart.times(tmp.p.gainPTHpart)
    if (tmp.p.gain.gte(tmp.p.st)) tmp.p.gain = tmp.p.gain.sqrt().times(tmp.p.st.sqrt())
    if (hasAchievement('a', 63)) tmp.p.gain = tmp.p.gain.times(get63AchEff()) //Ach 63
    if (hasAchievement('a', 68)) tmp.p.gain = tmp.p.gain.times(achievementEffect('a', 68)) // Ach 68
    tmp.p.gain = tmp.p.gain.times(tmp.p.buyables[32].effect)
    return tmp.p.gain
}
const PATHOGEN_TEXT = {
    11: `Time Reversal Upgrade 2 is boosted by your Pathogens.`,
    21: `Rocket gain is boosted by your Cadavers.`,
    22: `Time Cube gain is boosted by your Cadavers.`,
    31: `Maximum Velocity is boosted by your Pathogens.`,
    32: `Boost pathogen gain.`,
    33: `The transfer from Cadavers to Life Essence is more efficient.`,
    41: `The rocket gain softcap starts later.`,
    42: `The rocket effect softcap starts later.`,
    43: `The cadaver gain softcap starts later.`,
    44: `The cadaver effect softcap starts later.`
}
const PATHOGEN_COST_INC = {
    11: new Decimal(3.5),
    21: new Decimal(10),
    22: new Decimal(10),
    31: new Decimal(4),
    32: new Decimal(10/3),
    33: new Decimal(12),
    41: new Decimal(30),
    42: new Decimal(40),
    43: new Decimal(60),
    44: new Decimal(80)
}
const PATHOGEN_COST_START = {
    11: new Decimal(5),
    21: new Decimal(100),
    22: new Decimal(100),
    31: new Decimal(800),
    32: new Decimal(300),
    33: new Decimal(800),
    41: new Decimal(3000),
    42: new Decimal(4000),
    43: new Decimal(6000),
    44: new Decimal(8000)
}
const PTH_UPG_SCS = {
    11: new Decimal(8),
    21: new Decimal(10),
    22: new Decimal(7),
    31: new Decimal(16),
    32: new Decimal(6),
    33: new Decimal(6),
    41: new Decimal(4),
    42: new Decimal(4),
    43: new Decimal(3),
    44: new Decimal(3)
}
let getPathogenUpgEff = (n) => {
    let pathogens = player.p.points
    let cadavers = player.uc.points
    let bought = player.p.buyables[n]
    let softcap = PTH_UPG_SCS[n]
    if (bought.gte(softcap)) bought = bought.sqrt().times(softcap.sqrt())
    switch(n) {
        case '11': { return pathogens.plus(1).log10().plus(1).log10().plus(1).pow(bought.plus(1).log2().plus(bought.gt(0) ? 1 : 0)) }
        case '21': { return cadavers.plus(1).pow(0.3).pow(bought.plus(1).log(1.3)) }
        case '22': { return cadavers.plus(1).pow(0.4).pow(bought.plus(1).log(1.4)) }
        case '31': { return pathogens.plus(1).pow(1.5).pow(bought.pow(0.9)) }
        case '32': { return Decimal.pow(3, bought.sqrt()) }
        case '33': { return Decimal.pow(1.4, bought.sqrt()) }
        case '41': { return bought.plus(1).log2().plus(1).pow(5) }
        case '42': { return bought.plus(1).log2().plus(1).log10() }
        case '43': { return bought.plus(1).log(4).plus(1).pow(1.25) }
        case '44': { return bought.plus(1).log(4).plus(1).sqrt() }
    }
}
let effectDisplay = (s) => {
    let effect = tmp.p.buyables[s].effect
    let softcapped = player.p.buyables[s].gte(PTH_UPG_SCS[s]) ? ' <b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(softcapped)</b>' : ''
    if (s == 11 || s == 33) return `+${formatPrecents(effect)}%${softcapped}`
    else if (s == 21 || s == 22 || s == 31 || s == 32) return `+${format(effect)}x${softcapped}`
    else if (s == 41 || s == 43 || s == 44) return `${format(effect)}x later${softcapped}`
    else if (s == 42) return `${format(effect)} later${softcapped}`
}
let displayName = (x) => `${PATHOGEN_TEXT[x]}<br>${player.p.buyables[x].gte(10) ? 'Scaled ' : ''}Level: ${formatWhole(getBuyableAmount('p', x))}<br>Currently: ${effectDisplay(x)}<br>Cost: ${format(tmp.p.buyables[x].cost)} Pathogens.`
let displayCost = (id, amount) => {
    let pathogens = player.p.points
    let start = PATHOGEN_COST_START[id]
    let inc = PATHOGEN_COST_INC[id]
    let start1 = new Decimal(10)
    let exp1 = Decimal.pow(3, 1)
    let cost = start.times(Math.pow(inc, amount))
    let bulk = pathogens.div(start).max(1).log(inc).add(1)
    if (Decimal.max(amount,bulk).gte(start1)) {
        cost = start.times(Decimal.pow(inc, new Decimal(amount).pow(exp1).div(start1.pow(exp1.sub(1)))))
        bulk = pathogens.div(start).max(1).log(inc).times(start1.pow(exp1.sub(1))).pow(exp1.pow(-1)).add(1)
    }
    return {cost: cost, bulk: bulk}
}
let displayStyle = {
    'height': '150px',
    'width': '150px',
    'margin-left': '-7px',
    'margin-right': '-7px'
}

addLayer("p", {
    name: "pathogens",
    symbol: "P",
    position: 1,
    startData() { return {
        unlocked: false,
        points: new Decimal(0)
    }},
    tooltip() { return `${format(player[this.layer].points)} Pathogens` },
    requires: new Decimal(2.5e5),
    layerShown() { return player.uc.points.gte(2.5e5) || player[this.layer].unlocked },
    resource: "Pathogens",
    color: "#dee8a9",
    row: 2,
    update(diff) { if (player[this.layer].unlocked) player[this.layer].points = player[this.layer].points.plus(getPathogenGain().times(diff)) },
    clickables: {
        11: {
            display: `<h3>Max All</h3>`,
            canClick: true,
            onClick() {
                let id = Object.keys(tmp.p.buyables).slice(0, -3)
                for (let i = 0; i < id.length; i++) {
                    let buyable = player.p.buyables[id[i]]
                    let cost = tmp.p.buyables[id[i]].cost
                    let bulk = displayCost(id[i]).bulk
                    if (player.p.points.lt(cost)) continue
                    player.p.buyables[id[i]] = buyable.max(bulk.floor().max(buyable.plus(1)))
                    player.p.points = player.p.points.sub(cost)
                }
            },
            style: {
                'min-height' : '33px',
                'min-width' : '50px'
            }
        }
    },
    buyables: { //: getPathogenUpgData(Object.keys(PATHOGEN_TEXT).length),/*{
        11: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost },
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        21: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        22: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        31: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        32: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        33: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        41: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        42: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        43: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
        44: {
            display() { return `${displayName(this.id)}` },
            cost(x) { return displayCost(this.id, x).cost},
            effect() { return getPathogenUpgEff(this.id) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() { if (this.canAfford()) {
                player[this.layer].points = player[this.layer].points.minus(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }},
            style: displayStyle
        },
    },
    tabFormat: [
        () => (hasAchievement('a', 63) && !get63AchEff().eq(1)) ? ["column", [["display-text",`Time Doesn't Exist multiplier: ${format(get63AchEff())}x`
        ], "blank"]] : ``,
        ["display-text",
        function() {
            return `You have <h2 style="color: green; text-shadow: purple 0px 0px 10px">${format(player[this.layer].points)}</h2> Pathogens <h2 style="color: green; text-shadow: purple 0px 0px 10px">(+${format(getPathogenGain())}/sec)</h2>`
        }], "blank",
        "clickables", "blank",
        "buyables"
    ],
})
