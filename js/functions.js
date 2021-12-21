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