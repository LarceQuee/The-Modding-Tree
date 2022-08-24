const ROBOT_COST_INC = {
    interval: {
        11: new Decimal(7),
        21: new Decimal(8),
        31: new Decimal(15)
    },
    magnitude: {
        12: new Decimal(3),
        22: new Decimal(4),
        32: new Decimal(12)
    }
}
const ROBOT_COST_START = {
    interval: {
        11: new Decimal(2),
        21: new Decimal(2),
        31: new Decimal(1e5)
    },
    magnitude: {
        12: new Decimal(1),
        22: new Decimal(1),
        32: new Decimal(4e5)
    }
}

// Automation
function getScrapGain() {
    let gain = player.m.points.plus(1).pow(2).times(player.m.currentVelocity.plus(1)).log10().div(100)
    if (hasAchievement("a", 36)) gain = gain.times(achievementEffect("a", 36)) //Ach 36
    if (hasUpgrade("tr", 21)) gain = gain.times(upgradeEffect("tr", 21)) //TR Upgrade 21
    return gain
}
function getIntelligenceGain() {
    let rank = player.m.buyables[11]
    let tier = player.m.buyables[12]
    let gain = rank.plus(1).pow(2).times(tier.plus(1)).cbrt().div(1000)
    if (rank.gt(20)) gain = gain.times(RANKS["rank_21"].effect) //Rank 21
    if (rank.gt(30)) gain = gain.times(RANKS["rank_31"].effect) //Rank 31
    if (rank.gt(40)) gain = gain.times(RANKS["rank_41"].effect()) //Rank 41
    if (tier.gt(4)) gain = gain.times(TIERS["tier_5"].effect) //Tier 5
    if (hasAchievement("a", 36)) gain = gain.times(achievementEffect("a", 36)) //Ach 36
    if (hasAchievement("a", 46)) gain = gain.times(achievementEffect("a", 46)) //Ach 46
    if (hasUpgrade("tr", 21)) gain = gain.times(upgradeEffect("tr", 21)) //TR Upgrade 21
    return gain
}
function getIntCost(x) {
    return Decimal.pow(ROBOT_COST_INC.interval[x], player.auto.buyables[x]).times(ROBOT_COST_START.interval[x])
}
function getMagCost(x) {
    return Decimal.pow(ROBOT_COST_INC.magnitude[x], player.auto.buyables[x].plus(1).pow(2)).times(ROBOT_COST_START.magnitude[x])
}
function getBuyAutomation(v) {
    return false
}
