// Distance
function calcAcceleration() {
    tmp.acc = new Decimal(0.1)
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    if (rank.gt(2)) tmp.acc = tmp.acc.times(RANKS["rank_3"].effect()) //Rank 3
    if (rank.gt(3)) tmp.acc = tmp.acc.times(RANKS["rank_4"].effect) //Rank 4
    if (tier.gt(1)&&rank.gte(3)) tmp.acc = tmp.acc.times(TIERS["tier_2"].effect.acc) //Tier 2 Rank 3
    if (rank.gt(4)) tmp.acc = tmp.acc.times(RANKS["rank_5"].effect()) //Rank 5
    if (rank.gt(5)) tmp.acc = tmp.acc.times(RANKS["rank_6"].effect()) //Rank 6
    if (rank.gt(10)) tmp.acc = tmp.acc.times(RANKS["rank_11"].effect) //Rank 11
    if (tier.gt(3)) tmp.acc = tmp.acc.times(TIERS["tier_4"].effect) //Tier 4
    if (rank.gt(14)) tmp.acc = tmp.acc.times(RANKS["rank_15"].effect()) //Rank 15
    if (rank.gt(15)) tmp.acc = tmp.acc.times(RANKS["rank_16"].effect) //Rank 16
    if (rank.gt(25)) tmp.acc = tmp.acc.times(RANKS["rank_26"].effect) //Rank 26
    if (rank.gt(50)) tmp.acc = tmp.acc.times(RANKS["rank_51"].effect) //Rank 51
    if (tier.gt(5)) tmp.acc = tmp.acc.times(TIERS["tier_6"].effect) //Tier 6
    if (hasAchievement("a", 12)) tmp.acc = tmp.acc.times(achievementEffect("a", 12)) //Ach 12
    if (hasAchievement("a", 14)) tmp.acc = tmp.acc.times(achievementEffect("a", 14)) //Ach 14
    if (hasAchievement("a", 22)) tmp.acc = tmp.acc.times(achievementEffect("a", 22)) //Ach 22
    if (hasAchievement("a", 23)) tmp.acc = tmp.acc.times(achievementEffect("a", 23)) //Ach 23
    if (hasAchievement("a", 32)) tmp.acc = tmp.acc.times(achievementEffect("a", 32)) //Ach 32
    if (hasAchievement("a", 35)) tmp.acc = tmp.acc.times(achievementEffect("a", 35)) //Ach 35
    tmp.acc = tmp.acc.times(tmp.r.accPow)
    return tmp.acc
}
function calcMaxVelocity() {
    tmp.maxVel = new Decimal(1)
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    if (rank.gt(1)) tmp.maxVel = tmp.maxVel.plus(RANKS["rank_2"].effect) //Rank 2
    if (rank.gt(2)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_3"].effect()) //Rank 3
    if (tier.gt(1)&&rank.gte(3)) tmp.maxVel = tmp.maxVel.times(TIERS["tier_2"].effect.maxVel) //Tier 2 Rank 3
    if (rank.gt(4)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_5"].effect()) //Rank 5
    if (rank.gt(5)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_6"].effect()) //Rank 6
    if (rank.gt(8)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_9"].effect()) //Rank 9
    if (rank.gt(14)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_15"].effect()) //Rank 15
    if (rank.gt(55)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_56"].effect()) //Rank 56
    if (player.p.unlocked) tmp.maxVel = tmp.maxVel.times(tmp.p.buyables[31].effect)
    if (hasAchievement("a", 14)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 14)) //Ach 14
    if (hasAchievement("a", 21)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 21)) //Ach 21
    if (hasAchievement("a", 24)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 24)) //Ach 24
    if (hasAchievement("a", 41)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 41)) //Ach 41
    if (hasAchievement("a", 51)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 51)) //Ach 51
    if (hasAchievement("a", 61)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 61)) //Ach 61
    tmp.maxVel = tmp.maxVel.times(tmp.r.mvPow)
    return tmp.maxVel
}
function bestEverMath() {
    let main = player.m
    if (main.points.gt(tmp.bestEverDistance)) tmp.bestEverDistance = main.points
    if (main.currentVelocity.gt(tmp.bestEverVelocity)) tmp.bestEverVelocity = main.currentVelocity
    if (calcAcceleration().gt(tmp.bestEverAcceleration)) tmp.bestEverAcceleration = calcAcceleration()
}

// Rank
function getRankFP() {
    let fp = new Decimal(1)
    let tier = player.m.buyables[12]
    if (tier.gt(0)) fp = fp.times(TIERS["tier_1"].effect) //Tier 1
    if (tier.gt(2)) fp = fp.times(TIERS["tier_3"].effect()) //Tier 3
    if (hasAchievement("a", 43)) fp = fp.times(achievementEffect("a", 43)) //Ach 43
    if (hasUpgrade("tr", 13)) fp = fp.times(1.1)
    return fp
}
function getRankBaseCost() {
    let bc = new Decimal(10)
    return bc
}

// Tier
function getTierFP() {
    let fp = new Decimal(1)
    return fp
}
function getTierBaseCost() {
    let bc = new Decimal(3)
    return bc
}

addLayer("m", {
    name: "main", 
    symbol: "M", 
    position: 0, 
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        currentVelocity: new Decimal(0)
    }},
    tooltip() { return `Main<br>${formatDistance(player[this.layer].points)}<br>${player[this.layer].buyables[11]} Rank | ${player[this.layer].buyables[12]} Tier` },
    update(diff) {
        let auto = player.auto
        player[this.layer].currentVelocity = player[this.layer].currentVelocity.plus(calcAcceleration().times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).min(calcMaxVelocity()).max(0)
        player[this.layer].points = player[this.layer].points.plus(player[this.layer].currentVelocity.times(timeSpeed()).times(player.tr.timeReverse ? -1 : 1).times(diff)).max(0)
        if (auto.activeRankbot && auto.unlockedRankbot) {
            auto.timeRankbot = auto.timeRankbot.plus(timeSpeed().times(diff).times(player.tr.timeReverse ? -1 : 1)).min(60)
            if (auto.timeRankbot.gte(tmp.auto.buyables[11].effect)) {
                if(tmp[this.layer].buyables[11].canAfford) {
                    let bulk = tmp.m.buyables[11].bulk
                    let effect = tmp.auto.buyables[12].effect.floor()
                    setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).add(effect).min(bulk))
                    if (!hasMilestone('uc', 12)) {
                        player[this.layer].points.mag = 0
                        player[this.layer].currentVelocity.mag = 0
                    }
                }
                //layers.m.buyables[11].buy()
                //setBuyableAmount(this.layer, 11, new Decimal(player[this.layer].points.div(getRankBaseCost()).max(1).log(2).sqrt().plus(1).times(getRankFP()).plus(1).round().min(player[this.layer].buyables[11].plus(tmp.auto.buyables[12].effect))))
                auto.timeRankbot = auto.timeRankbot.min(0)
            }
        }
        if (auto.activeTierbot && auto.unlockedTierbot) {
            auto.timeTierbot = auto.timeTierbot.plus(timeSpeed().times(diff).times(player.tr.timeReverse ? -1 : 1)).min(60)
            if (auto.timeTierbot.gte(tmp.auto.buyables[21].effect)) {
                if (tmp[this.layer].buyables[12].canAfford) {
                    let bulk = tmp.m.buyables[12].bulk
                    let effect = tmp.auto.buyables[22].effect.floor()
                    setBuyableAmount(this.layer, 12, getBuyableAmount(this.layer, 12).add(effect).min(bulk))
                    player[this.layer].points.mag = 0
                    player[this.layer].currentVelocity.mag = 0
                    if (!hasMilestone('uc', 11)) {
                        player[this.layer].buyables[11] = decimalOne
                    }
                }
                //layers.m.buyables[12].buy()
                //setBuyableAmount(this.layer, 12, new Decimal(player.m.buyables[11].sub(getTierBaseCost()).max(0).sqrt().times(getTierFP()).add(1).round().min(player.m.buyables[12].plus(tmp.auto.buyables[22].effect))))
                auto.timeTierbot = auto.timeTierbot.min(0)
            }
        }
    },
    buyables: {
        11: {
            title() {
                let scaling = ''
                let x = getBuyableAmount(this.layer, this.id)
                if (x.gte(50)) scaling = 'Scaled '
                return `${scaling}Rank ${formatWhole(player[this.layer].buyables[this.id])}`
            },
            display() { return `Reset your journey,<br>but rank up.<br>Req: ${formatDistance(this.cost())}.` },
            cost(x) {
                let fp = getRankFP()
                let bc = getRankBaseCost()
                let start = new Decimal(50)
                let power = new Decimal(1)
                let exp = Decimal.pow(2, power)
                let cost = new Decimal(bc).times(Decimal.pow(2, x.div(fp).max(1).sub(1).pow(2)))
                if (Decimal.max(x, this.bulk()).gte(start)) cost = new Decimal(bc).times(Decimal.pow(2, x.pow(exp).div(start.pow(exp.sub(1))).div(fp).sub(1).pow(2)))
                return cost
            },
            bulk(x = getBuyableAmount(this.layer, this.id)) {
                let fp = getRankFP()
                let bc = getRankBaseCost()
                let distance = new Decimal(player[this.layer].points)
                let start = new Decimal(50)
                let power = new Decimal(1)
                let exp = Decimal.pow(2, power)
                let bulk = distance.div(bc).max(1).log(2).sqrt().plus(1).times(fp).plus(1).round()
                if (Decimal.max(x, bulk).gte(start)) bulk = distance.div(bc).max(1).log(2).sqrt().plus(1).times(fp).times(start.pow(exp.sub(1))).pow(exp.pow(-1)).plus(1).floor()
                return bulk
            },
            amount() { return player.m.buyables[11] = player.m.buyables[11].max(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(this.canAfford()) {
                    //let amount = player[this.layer].buyables[this.id]
                    //let effect = tmp.auto.buyables[12].effect
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                    if (!hasMilestone('uc', 12)) {
                        player[this.layer].points.mag = 0
                        player[this.layer].currentVelocity.mag = 0
                    }
                }
            }
        },
        12: {
            title() {
                let scaling = ''
                let x = getBuyableAmount(this.layer, this.id)
                if (x.gte(8)) scaling = 'Scaled '
                return `${scaling}Tier ${formatWhole(player[this.layer].buyables[this.id])}`
            },
            display() { return `Reset your ranks,<br>but tier up.<br>Req: Rank ${this.cost()}.` },
            cost(x) {
                let fp = getTierFP()
                let bc = getTierBaseCost()
                let start = new Decimal(8)
                let power = new Decimal(1)
                let exp = Decimal.pow(2, power)
                let cost = new Decimal(bc).plus(x.pow(fp).pow(2)).round()
                if (Decimal.max(x, this.bulk()).gte(start)) cost = new Decimal(bc).plus(x.pow(exp).div(start.pow(exp.sub(1))).div(fp).pow(2)).round()
                return cost
            },
            bulk(x = getBuyableAmount(this.layer, this.id)) {
                let fp = getTierFP()
                let bc = getTierBaseCost()
                let start = new Decimal(8)
                let power = new Decimal(1)
                let exp = Decimal.pow(2, power)
                let ranks = new Decimal(player.m.buyables[11])
                let bulk = ranks.sub(bc).max(0).sqrt().times(fp).add(1).round()
                if (Decimal.max(x, bulk).gte(start)) bulk = ranks.sub(bc).max(0).sqrt().times(fp).times(start.pow(exp.sub(1))).pow(exp.pow(-1)).add(1).floor()
                return bulk
            },
            canAfford() { return player[this.layer].buyables[11].gte(this.cost()) },
            buy() {
                if (this.canAfford()) {
                    //let amount = player[this.layer].buyables[this.id]
                    //let effect = tmp.auto.buyables[22].effect
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
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
