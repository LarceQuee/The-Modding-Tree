// Distance
function calcAcceleration() {
    tmp.acc = new Decimal(0.1)
    tmp.r.accPow = new Decimal(tmp.acc.plus(1).log10().pow(getRocketEffect()).plus(player.r.points).max(1))
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
    tmp.acc = tmp.acc.times(tmp.r.accPow)
    return tmp.acc
}
function calcMaxVelocity() {
    tmp.maxVel = new Decimal(1)
    tmp.r.mvPow = new Decimal(tmp.maxVel.plus(1).log10().pow(getRocketEffect()).plus(player.r.points).max(1))
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    if (rank.gt(1)) tmp.maxVel = tmp.maxVel.plus(RANKS["rank_2"].effect) //Rank 2
    if (rank.gt(2)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_3"].effect()) //Rank 3
    if (tier.gt(1)&&rank.gte(3)) tmp.maxVel = tmp.maxVel.times(TIERS["tier_2"].effect.maxVel) //Tier 2 Rank 3
    if (rank.gt(4)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_5"].effect()) //Rank 5
    if (rank.gt(5)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_6"].effect()) //Rank 6
    if (rank.gt(8)) tmp.maxVel = tmp.maxVel.times(RANKS["rank_9"].effect()) //Rank 9
    tmp.maxVel = tmp.maxVel.times(tmp.r.mvPow)
    return tmp.maxVel
}

// Rank
function getRankFP() {
    let fp = new Decimal(1)
    let tier = player.m.buyables[12]
    if (tier.gt(0)) fp = fp.times(TIERS["tier_1"].effect) //Tier 1
    if (tier.gt(2)) fp = fp.times(TIERS["tier_3"].effect()) //Tier 3
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
    return mult
}
function getRocketEffect() {
    let r = player.r.points
    if (r.gte(10)) r = r.log10().times(10)
    if (player.r.buyables[11].gt(0)) r = r.plus(getFuelEff2())
    let eff = r.plus(1).log(3).times(getFuelEff())
    return eff
}

//Rocket Fuel
function getFuelPow() {
    return new Decimal(1)
}
function getFreeFuel() {
    return new Decimal(0)
}
function getFuelEff() {
    let rf = player.r.buyables[11]
    let trf = rf.plus(getFreeFuel()).times(getFuelPow())
    let eff = trf.plus(1).log(2).plus(1).pow(0.05)
    return eff
}
function getFuelEff2() {
    let eff = player.r.buyables[11].sqrt().div(2)
    return eff
}