const RANKS = {
    rank_2: {
        title: `Rank 2`,
        effect: new Decimal(1),
        display() {
            return player.m.buyables[11].gte(2)
        },
        info() {
            return `Increase the maximum velocity by 1/s.`
        }
    },
    rank_3: {
        title: `Rank 3`,
        effect() {
            return new Decimal(1.1).pow(player.m.buyables[11])
        },
        display() {
            return player.m.buyables[11].gte(3)
        },
        info() {
            return `Increase the acceleration and maximum velocity by 10% for each rank up.<br>Currently: ${formatWhole(this.effect())}x`
        }
    },
    rank_4: {
        title: `Rank 4`,
        effect: new Decimal(2),
        display() {
            return player.m.buyables[11].gte(4)
        },
        info() {
            return `Double your acceleration.`
        }
    },
    rank_5: {
        title: `Rank 5`,
        effect() {
            return new Decimal(3).pow(player.m.buyables[12])
        },
        display() {
            return player.m.buyables[11].gte(5)
        },
        info() {
            return `Triple your acceleration & maximum velocity for each tier up.<br>Currently: ${format(this.effect())}x`
        }
    },
    rank_6: {
        title: `Rank 6`,
        effect() {
            return new Decimal(1.975).pow(player.m.buyables[11])
        },
        display() {
            return player.m.buyables[11].gte(6)
        },
        info() {
            return `Increase the acceleration and maximum velocity by 97.5% for each rank up.<br>Currently: ${format(this.effect())}x`
        }
    },
    rank_9: {
        title: `Rank 9`,
        effect() {
            return new Decimal(1.1).pow(player.m.buyables[11])
        },
        display() {
            return player.m.buyables[11].gte(9)
        },
        info() {
            return `Increase your maximum velocity by 10% for each rank up.<br>Currently: ${format(this.effect())}x`
        }
    },
    rank_11: {
        title: `Rank 11`,
        effect: new Decimal(2),
        display() {
            return player.m.buyables[11].gte(11)
        },
        info() {
            return `Double your acceleration.`
        }
    }
}
const TIERS = {
    tier_1: {
        title: `Tier 1`,
        effect: new Decimal(1.25),
        display() {
            return player.m.buyables[12].gte(1)
        },
        info() {
            return `Make the rank requirement formula 25% slower.`
        }
    },
    tier_2: {
        title: `Tier 2`,
        effect: {
            acc: new Decimal(2),
            maxVel: new Decimal(5)
        },
        display() {
            return player.m.buyables[12].gte(2)
        },
        info() {
            return `Double your acceleration and quintuple your maximum velocity if you are at least Rank 3`
        }
    },
    tier_3: {
        title: `Tier 3`,
        effect() {
            return new Decimal(1.1).pow(player.m.buyables[12])
        },
        display() {
            return player.m.buyables[12].gte(3)
        },
        info() {
            return `Make the rank requirement formula 10% slower for each tier up.<br>Currently: ${format(this.effect())}x`
        }
    },
    tier_4: {
        title: `Tier 4`,
        effect: new Decimal(3),
        display() {
            return player.m.buyables[12].gte(4)
        },
        info() {
            return `Triple your acceleration.`
        }
    }
}