// Rockets
function getRocketSoftcapStart() {
    let sc = new Decimal(100000)
    if (player.p.unlocked) sc = sc.times(tmp.p.buyables[41].effect)
    return sc
}
function getRocketEffectSoftcapStart() {
    let sc = new Decimal(5)
    if (player.p.unlocked) sc = sc.plus(tmp.p.buyables[42].effect)
    return sc
}
function getRocketGainMult() {
    let mult = new Decimal(1)
    let ucMil = tmp.uc.milestones
    if (hasUpgrade("tr", 25)) mult = mult.times(upgradeEffect("tr", 25)) //Time Cube Upgrade 10
    if (hasAchievement("a", 15)) mult = mult.times(achievementEffect("a", 15)) //Ach 15
    if (hasAchievement("a", 26)) mult = mult.times(achievementEffect("a", 26)) //Ach 26
    if (hasAchievement("a", 34)) mult = mult.times(achievementEffect("a", 34)) //Ach 34
    if (hasAchievement("a", 44)) mult = mult.times(achievementEffect("a", 44)) //Ach 44
    if (hasMilestone('uc', 6)) mult = mult.times(ucMil[6].effect) //Collapse Milestone 6
    if (hasMilestone('uc', 8)) mult = mult.times(ucMil[8].effect) //Collapse Milestone 8
    if (player.p.unlocked) mult = mult.times(tmp.p.buyables[21].effect.max(1)) // PathUpg 21
    return mult
}
function getRocketEffect() {
    let r = player.r.points
    if (r.gte(10)) r = r.log10().times(10)
    if (player.r.buyables[11].gt(0)) r = r.plus(getFuelEff2())
    let eff = r.plus(1).log(3).times(getFuelEff())
    if (eff.gte(getRocketEffectSoftcapStart())) eff = eff.sqrt().times(Decimal.sqrt(getRocketEffectSoftcapStart()))
    return eff
}
function getRocketGain() {
    let gain = tmp.r.resetGain
    if (hasMilestone('uc', 9)) gain = gain.div(100)
    else gain = decimalZero
    return gain
}

// Rocket Fuel
function getFuelPow() {
    return new Decimal(1).times(hasUpgrade("tr", 15) ? 1.1 : 1)
}
function getFreeFuel() {
    return player.tr.unlocked ? tmp.tr.effect : new Decimal(0)
}
function getFuelEff() {
    let rf = player.r.buyables[11]
    let trf = rf.plus(getFreeFuel()).times(getFuelPow())
    let eff = trf.plus(1).log(2).plus(1).pow(0.05)
    return eff
}
function getFuelEff2() {
    let eff = player.r.buyables[11].sqrt().div(2)
    if (eff.gt(player.r.points.plus(1).times(10))) eff = player.r.points.plus(1).times(10)
    return eff
}

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
                if (tmp[this.layer].buyables[11].canAfford) {
                    let bulk = tmp[this.layer].buyables[11].bulk
                    let effect = tmp.auto.buyables[32].effect
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, 11).add(effect).min(bulk))
                    if (hasAchievement(`a`, 58)) player[this.layer].points = player[this.layer].points.div(2).max(10)
                    else if (hasMilestone(`uc`, 3)) player[this.layer].points = new Decimal(10)
                    else player[this.layer].points = decimalZero
                }
                //layers.r.buyables[11].buy()
                //setBuyableAmount(this.layer, 11, new Decimal(player[this.layer].points.div(getRankBaseCost()).max(1).log(2).sqrt().plus(1).times(getRankFP()).plus(1).round().min(player[this.layer].buyables[11].plus(tmp.auto.buyables[12].effect))))
                auto.timeFuelbot = auto.timeFuelbot.min(0)
            }
        }
    },
    type: "normal",
    layerShown() { return player[this.layer].unlocked || player.m.points.gte(5e7) },
    requires: new Decimal(5e7),
    resource: "rockets",
    baseResource: "distance",
    tooltip() { return `${formatWhole(player[this.layer].points)} rockets<br>${player[this.layer].buyables[11]} Rocket Fuel` },
    baseAmount() { return player.m.points },
    exponent() { return 2/5 },
    gainMult() { return getRocketGainMult() },
    hotkeys: [
        {
            key: "R",
            description: `Shift+R -> Rocket Reset`,
            onPress() { if (canReset("r")) doReset("r") },
            unlocked() { return layerunlocked("r") }
        },
        {
            key: "f",
            description: `F -> Rocket Fuel Reset`,
            onPress() { layers.r.buyables[11].buy() },
            unlocked() { return layerunlocked("r") }
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
                let bc = new Decimal(25)
                let start = new Decimal(35)
                let power = new Decimal(1)
                let exp = Decimal.pow(2, power)
                let cost = bc.times(Decimal.pow(5, x.pow(1.1))).round()
                if (Decimal.max(x, this.bulk()).gte(start)) cost = bc.times(Decimal.pow(5, x.pow(exp).div(start.pow(exp.sub(1))).pow(1.1))).round()
                return cost
            },
            bulk(x = getBuyableAmount(this.layer, this.id)) {
                let bc = new Decimal(25)
                let start = new Decimal(35)
                let power = new Decimal(1)
                let exp = Decimal.pow(2, power)
                let bulk = player[this.layer].points.div(bc).max(1).log(5).pow(1 / 1.1).add(1).floor()
                if (Decimal.max(x, bulk).gte(start)) bulk = player[this.layer].points.div(bc).max(1).log(5).pow(1 / 1.1).times(start.pow(exp.sub(1))).pow(exp.pow(-1)).add(1).floor()
                return bulk
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                if (this.canAfford()) {
                    let amount = player[this.layer].buyables[this.id]
                    let effect = tmp.auto.buyables[32].effect
                    setBuyableAmount(this.layer, this.id, player.auto.activeFuelbot ? this.bulk().min(amount.add(effect).round()) : getBuyableAmount(this.layer, this.id).add(1))
                    if (hasAchievement(`a`, 58)) player[this.layer].points = player[this.layer].points.div(2).max(10)
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
            return `You have ${formatWhole(player[this.layer].points)} rockets${getRocketGain().gt(0) ? ` (+${format(getRocketGain())}/sec)` : ``}, which are making your acceleration & maximum velocity boost themselves (log(x+1)<sup>${format(getRocketEffect())}</sup>)${getRocketEffect().gte(getRocketEffectSoftcapStart()) ? ` <b style="color: #8a8767; text-shadow: #a0a67c 0px 0px 10px">(softcapped)</b>` : ``}`
        }], "blank",
        "buyables", "blank",
        ["display-text",
        function() {
            return `You have ${formatWhole(player[this.layer].buyables[11])} ${tmp.tr.effect.gt(0) ? `+ ${format(tmp.tr.effect)}` : ``} ${player.r.buyables[11].gte(35) ? 'Scaled ' : ''}Rocket Fuel, which boosts the effect of rockets by ${format(getFuelEff().sub(1).times(100))}%, and adds ${format(getFuelEff2())} additional rockets to their effect.`
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
