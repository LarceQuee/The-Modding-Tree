function getAchStats(n) {
    let name = n
    let done = () => hasAchievement("a", n) || PROGRESSION_MILESTONES[n]()
    let tooltip = () => PROGRESSION_MILESTONES_TEXT[n]
    let effect = PROGRESSION_MILESTONES_EFFECT[n]
    let style = () => ({
        'height': '60px',
        'width': '60px'
    })
    return {name: `${name}`, done: done, tooltip: tooltip, style: style, effect: effect}
}

function getAchData(n) {
    let obj = {}
    for (i = 10; i <= n; i++) {
        if (i % 10 > 0 & i % 10 < 9) {
            obj[i] = getAchStats(i)
        }
    }
    obj.rows = Math.floor(n / 10)
    obj.cols = 8
    return obj
}

function get68Ach() {
    if (player.p.buyables[11].eq(0)) return false
    else if (player.p.buyables[21].eq(0)) return false
    else if (player.p.buyables[22].eq(0)) return false
    else if (player.p.buyables[31].eq(0)) return false
    else if (player.p.buyables[32].eq(0)) return false
    else if (player.p.buyables[33].eq(0)) return false
    else if (player.p.buyables[41].eq(0)) return false
    else if (player.p.buyables[42].eq(0)) return false
    else if (player.p.buyables[43].eq(0)) return false
    else if (player.p.buyables[44].eq(0)) return false
    else return true
}

function get63AchEff() {
    let eff = timeSpeed().pow(0.025)
    if (!hasAchievement('a', 63))
        return new Decimal(1)
    return eff
}

const PROGRESSION_MILESTONES = {
    11: () => player.m.points.gte(100),
    12: () => player.m.buyables[11].gt(1),
    13: () => player.m.buyables[12].gte(1),
    14: () => player.r.points.gt(0),
    15: () => player.r.buyables[11].gt(0),
    16: () => player.auto.unlocked == true,
    17: () => tmp.tr.layerShown == true,
    18: () => player.uc.points.gt(0),
    21: () => player.m.points.gte(5e5),
    22: () => player.m.buyables[11].gte(8),
    23: () => player.m.buyables[12].gte(3),
    24: () => player.r.points.gte(2),
    25: () => player.r.buyables[11].gte(2),
    26: () => player.auto.unlockedRankbot == true,
    27: () => player.tr.points.gte(1000),
    28: () => player.uc.points.gte(66),
    31: () => player.m.points.gte(1e12),
    32: () => player.m.buyables[11].gt(11),
    33: () => player.m.buyables[12].gt(3),
    34: () => player.r.points.gte(10),
    35: () => player.r.buyables[11].gt(2),
    36: () => player.auto.unlockedTierbot == true,
    37: () => player.tr.upgrades.length > 4,
    38: () => player.uc.milestones.length == 12,
    41: () => player.m.points.gte(3.086e17),
    42: () => player.m.buyables[11].gt(19),
    43: () => player.m.buyables[12].gt(4),
    44: () => player.r.points.gte(1e5),
    45: () => player.r.buyables[11].gt(5),
    46: () => player.auto.scraps.gte(5000),
    47: () => player.tr.upgrades.length > 9,
    48: () => player.auto.intelligence.gte(1e10),
    51: () => player.m.points.gte(DISTANCE['uni']),
    52: () => player.r.points.gte(1e8),
    53: () => player.r.buyables[11].gt(9),
    54: () => player.tr.points.gte(1e7),
    55: () => timeSpeed().gte(1e5),
    56: () => player.auto.unlockedFuelbot == true,
    57: () => player.tr.points.gte(9e15),
    58: () => player.m.points.gte(DISTANCE['uni']*2.22e22),
    61: () => player.p.unlocked,
    62: () => player.uc.lifeEssence.gte(1e6),
    63: () => player.tr.points.gte(1e28),
    64: () => player.m.buyables[11].gte(50),
    65: () => player.uc.points.gte(5e7),
    66: () => tmp.auto.buyables[31].effect.lte(120),
    67: () => player.m.points.gte(1e80 *DISTANCE.uni),
    68: () => get68Ach()
}

const PROGRESSION_MILESTONES_TEXT = {
    11: `<b>Quick Sprint</b><br>Go at least 100 m.`,
    12: `<b>Better Shoes</b><br>Do a rank reset.<br>Reward: Acceleration is 10% higher.`,
    13: `<b>Extreme Workout</b><br>Do a tier reset.`,
    14: `<b>Off to Space!</b><br>Do a rocket reset.<br>Reward: Acceleration & Maximum Velocity are 50% higher.`,
    15: `<b>Rocket Blast</b><br>Get at least 1 rocket fuel.<br>Reward: Rocket gain is increased by 5%.`,
    16: `<b>Humans are Irrelevant</b><br>Unlock automation.`,
    17: `<b>Yet you're still moving forward.</b><br>Unlock Time Reversal.<br>Reward: Time goes by 1% faster.`,
    18: `<b>Intentional Death</b><br>Preform a Universal Collapse reset.<br>Reward: Time goes by 50% faster.`,
    21: `<b>Driving for Hours</b><br>Go at least five hundred km.<br>Reward: Maximum Velocity is 10% higher.`,
    22: `<b>Oil Change</b><br>Reach Rank eight.<br>Reward: Acceleration is 5% higher.`,
    23: `<b>Three's the Lucky Number</b><br>Reach Tier 3.<br>Reward: Acceleration is 20% higher.`,
    24: `<b>Blastoff Again?</b><br>Reach 2 Rockets.<br>Reward: Maximum Velocity is 25% higher.`,
    25: `<b>Refuel</b><br>Get at least 2 rocket fuel.`,
    26: `<b>Automated Evolution</b><br>Unlock Rankbot.<br>Reward: Rocket gain is increased by 10%.`,
    27: `<b>Time of the Fittest</b><br>Reach 1000 Time Cubes.<br>Rewarrd: Time goes by 10% faster.`,
    28: `<b>Piling the Bodies</b><br>Reach 66 Cadavers.`,
    31: `<b>Just Under a Saturn Revolution</b><br>Go at least 1Tm.`,
    32: `<b>Putting in the Fake Fuel</b><br>Reach Rank 12.<br>Reward: Acceleration is 80% higher.`,
    33: `<b>IV Test</b><br>Reach Tier 4.`,
    34: `<b>Why fly once when you can fly ten times?</b><br>Reach 10 Rockets.<br>Reward: Rocket gain is increased by 10%.`,
    35: `<b>Triple the Fuel</b><br>Get at least 3 rocket fuel.<br>Reward: Acceleration is 80% higher.`,
    36: `<b>Automated Power Boosts</b><br>Unlock Tierbot.<br>Reward: Scrap & intelligence gain are increased by 50%.`,
    37: `<b>That's so many?</b><br>Purchase 5 Time Reversal Upgrades.`,
    38: `<b>The Pain is Real</b><br>Reach all 12 Collapse Milestones.<br>Reward: Cadaver gain is doubled.`,
    41: `<b>Parallax Time to the Tenth</b><br>Go at least 10 pc.<br>Reward: Maximum Velocity is 50% higher.`,
    42: `<b>Strong Winds</b><br>Reach Rank 20.`,
    43: `<b>Like the drink</b><br>Reach Tier 5.<br>Reward: The Rank requirement formula is 2.5% slower.`,
    44: `<b>Now this is just pointless.</b><br>Reach 1e5 Rockets.<br>Reward: Rocket gain is increased by 15%.`,
    45: `<b>Not Quite Nine Thousand...</b><br>Get at lest 6 normal rocket fuel.`,
    46: `<b>A magnet's work.</b><br>Reach 5000 scraps.<br>Reward: Intelligence gain is doubled.`,
    47: `<b>Gotta buy em all!</b><br>Purchase 10 Time Reversal Upgrades.<br>Reward: Time goes by 50% faster.`,
    48: `<b>Super Smart</b><br>Reach 1e10 intelligence.<br>Reward: You can buy max robot upgrades.(Not yet)`,
    51: `<b>Out of this World</b><br>Go at least 1 uni.<br>Reward: Maximum Velocity is 50% higher.`,
    52: `<b>Taking up all the space.</b><br>Reach 1e8 Rockets.<br>Reward: Time goes by 20% faster.`,
    53: `<b>2+2=10</b><br>Get at least 10 normal rocket fuel.`,
    54: `<b>Cacophany of Pain</b><br>Reach 1e7 Time Cubes.`,
    55: `<b>Zooming at the Speed of Sound</b><br>Get at Time Speed above 1e5x.<br>Reward: You gain 10% more Time Cubes.`,
    56: `<b>Auto-Gas</b><br>Unlock Fuelbot.`,
    57: `<b>No More Thinking</b><br>Reach 9e15 Time Cubes.<br>Reward: Time goes by 10% faster.`,
    58: `<b>The Multiverse is Ever-Expanding</b><br>Go at least 2.22e22 uni.<br>Reward: The Rocket Fuel reset only Rockets to 50% of their current amount.`,
    61: `<b>Jimmy the Crow's Debut</b><br>Unlock Pathogens.<br>Reward: Maximum Velocity is 60% higher`,
    62: `<b>Alive Plus</b><br>Reach 1e6 Life Essence.`,
    63: `<b>Time Doesn't Exist</b><br>Reach 1e28 Time Cubes.<br>Reward: Time Speed boosts Pathogen gain at a reduced rate.`,
    64: `<b>Acceleration does nothing.</b><br>Reach Rank 50.`,
    65: `<b>One Death</b><br>Reach 5e7 Cadavers.<br>Reward: Cadaver gain is increased by 40%`,
    66: `<b>I thought that was a lot?</b><br>Get Fuelbot's interval less that or equal to 2m.`,
    67: `<b>Atoms in the universe, of universes.</b><br>Reach 1e80 uni.<br>Reward: Time goes by 11.11% faster.`,
    68: `<b>Corvid Twenty</b><br>Get one of each pf the 10 Pathogens upgrades.<br>Reward: Pathogen gain is 2.5x faster.`
}

const PROGRESSION_MILESTONES_EFFECT = {
    12: new Decimal(1.1),
    14: new Decimal(1.5),
    15: new Decimal(1.05),
    17: new Decimal(1.01),
    18: new Decimal(1.5),
    21: new Decimal(1.1),
    22: new Decimal(1.05),
    23: new Decimal(1.2),
    24: new Decimal(1.25),
    26: new Decimal(1.1),
    27: new Decimal(1.1),
    32: new Decimal(1.8),
    34: new Decimal(1.1),
    35: new Decimal(1.8),
    36: new Decimal(1.5),
    38: new Decimal(2),
    41: new Decimal(1.5),
    43: new Decimal(1.025),
    44: new Decimal(1.15),
    46: new Decimal(2),
    47: new Decimal(1.5),
    48: true,
    51: new Decimal(1.5),
    52: new Decimal(1.2),
    55: new Decimal(1.1),
    57: new Decimal(1.1),
    58: true,
    61: new Decimal(1.6),
    63: true,
    65: new Decimal(1.4),
    67: new Decimal(1.1111),
    68: new Decimal(2.5)
}

addLayer("a", {
    name: "achievements",
    symbol: "A",
    color: "yellow",
    row: "side",
    tooltip: "Achievements",
    achievements: getAchData(68),
    tabFormat: [
        "blank","blank",
        ["display-text",
        () => `You completed ${formatWhole(player.a.achievements.length)}/${formatWhole(Object.keys(tmp.a.achievements).length - 2)} Achievements.`], "blank","blank",
        "achievements"
    ]
})
