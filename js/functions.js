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
    if (rank.gt(14)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_15"].effect()) //Rank 14
    if (hasAchievement("a", 14)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 14)) //Ach 14
    if (hasAchievement("a", 21)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 21)) //Ach 21
    if (hasAchievement("a", 24)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 24)) //Ach 24
    if (hasAchievement("a", 41)) tmp.maxVel = tmp.maxVel.times(achievementEffect("a", 41)) //Ach 41
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

// Rockets
function getRocketGainMult() {
    let mult = new Decimal(1)
    if (hasUpgrade("tr", 25)) mult = mult.times(upgradeEffect("tr", 25)) //Time Cube Upgrade 10
    if (hasAchievement("a", 15)) mult = mult.times(achievementEffect("a", 15)) //Ach 15
    if (hasAchievement("a", 26)) mult = mult.times(achievementEffect("a", 26)) //Ach 26
    if (hasAchievement("a", 34)) mult = mult.times(achievementEffect("a", 34)) //Ach 34
    if (hasAchievement("a", 44)) mult = mult.times(achievementEffect("a", 44)) //Ach 44
    if (hasUpgrade("tr", 25)) mult = mult.times(upgradeEffect("tr", 25)) //
    return mult
}
function getRocketEffect() {
    let r = player.r.points
    if (r.gte(10)) r = r.log10().times(10)
    if (player.r.buyables[11].gt(0)) r = r.plus(getFuelEff2())
    let eff = r.plus(1).log(3).times(getFuelEff())
    if (eff.gte(getRocketEffectSoftcapStars())) eff = eff.sqrt().times(Decimal.sqrt(getRocketEffectSoftcapStars()))
    return eff
}
function getRocketEffectSoftcapStars() {
    return new Decimal(5)
}

//Rocket Fuel
function getFuelPow() {
    return new Decimal(1).times(hasUpgrade("tr", 15) ? 1.1 : 1)
}
function getFreeFuel() {
    return player.tr ? tmp.tr.effect : new Decimal(0)
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

//Automation
function getScrapGain() {
    let gain = player.m.points.plus(1).pow(2).times(player.m.currentVelocity.plus(1)).log10().div(100)
    if (hasAchievement("a", 36)) gain = gain.times(achievementEffect("a", 36)) //Ach 36
    return gain
}
function getIntelligenceGain() {
    let gain = player.m.buyables[11].plus(1).pow(2).times(player.m.buyables[12].plus(1)).cbrt().div(1000)
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    if (rank.gt(20)) gain = gain.times(RANKS["rank_21"].effect) //Rank 20
    if (tier.gt(4)) gain = gain.times(TIERS["tier_5"].effect) //Tier 5
    if (hasAchievement("a", 36)) gain = gain.times(achievementEffect("a", 36)) //Ach 36
    if (hasAchievement("a", 46)) gain = gain.times(achievementEffect("a", 46)) //Ach 46
    if (hasUpgrade("tr", 21)) gain = gain.times(upgradeEffect("tr", 21))
    return gain
}

//Time Reversal
function getTimeCubeGain() {
    let gain = new Decimal(1)
    if (hasUpgrade("tr", 11)) gain = gain.times(upgradeEffect("tr", 11)) //Time Cube Upgrade 1
    if (hasUpgrade("tr", 14)) gain = gain.times(upgradeEffect("tr", 14)) //Time Cube Upgrade 4
    return gain
}

function timeSpeed() {
    tmp.timeSpeed = new Decimal(1)
    if (hasUpgrade("tr", 12)) tmp.timeSpeed = tmp.timeSpeed.times(upgradeEffect("tr", 12)) //Time Cube Upgrade 2
    if (hasUpgrade("tr", 22)) tmp.timeSpeed = tmp.timeSpeed.times(upgradeEffect("tr", 22)) //Time Cube Upgrade 7
    if (hasAchievement("a", 17)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 17)) //Ach 17
    if (hasAchievement("a", 18)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 18)) //Ach 18
    if (hasAchievement("a", 27)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 27)) //Ach 27
    if (hasAchievement("a", 47)) tmp.timeSpeed = tmp.timeSpeed.times(achievementEffect("a", 47)) //Ach 47
    return tmp.timeSpeed
}
