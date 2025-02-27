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
            return `Increase the acceleration and maximum velocity by 10% for each rank up.<br>Currently: ${format(this.effect())}x`
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
    },
    rank_15: {
        title: `Rank 15`,
        effect() {
            return new Decimal(player.r.buyables[11].plus(1)).pow(1.6)
        },
        display() {
            return player.m.buyables[11].gte(15)
        },
        info() {
            return `Multiply your acceleration & maximum velocity by (n+1)^1.6, where <i>n</i> is your rocket fuel.<br>Currently: ${format(this.effect())}x`
        }
    },
    rank_16: {
        title: `Rank 16`,
        effect: new Decimal(4),
        display() {
            return player.m.buyables[11].gte(16)
        },
        info() {
            return `Quadruple your acceleration.`
        }
    },
    rank_21: {
        title: `Rank 21`,
        effect: new Decimal(2),
        display() {
            return player.m.buyables[11].gte(21)
        },
        info() {
            return `Double intelligence gain.`
        }
    },
    rank_26: {
        title: `Rank 26`,
        effect: new Decimal(10),
        display() {
            return player.m.buyables[11].gte(26)
        },
        info() {
            return `Multiply your acceleration by 10.`
        }
    },
    rank_31: {
        title: `Rank 31`,
        effect: new Decimal(3),
        display() {
            return player.m.buyables[11].gte(31)
        },
        info() {
            return `Triple intelligence gain.`
        }
    },
    rank_36: {
        title: `Rank 36`,
        effect: new Decimal(1.5),
        display() {
            return player.m.buyables[11].gte(36)
        },
        info() {
            return `Time goes by 50% faster.`
        }
    },
    rank_41: {
        title: `Rank 41`,
        effect() {
            let eff = primesLTE(player.auto.scraps).max(1)
            if (eff.gte(1e9)) eff = eff.log10().times(1e9 / 9)
            return eff
        },
        display() {
            return player.m.buyables[11].gte(41)
        },
        info() {
            return `Multiply intelligence gain by the number of primes less than or equal to your scrap amount (minimum 1, softcaps after 1e9 primes).<br>Currently: ${format(this.effect())}x`
        }
    },
    rank_46: {
        title: `Rank 46`,
        effect: new Decimal(1.8),
        display() {
            return player.m.buyables[11].gte(46)
        },
        info() {
            return `Time goes by 80% faster.`
        }
    },
    rank_51: {
        title: `Rank 51`,
        effect: new Decimal(15),
        display() {
            return player.m.buyables[11].gte(51)
        },
        info() {
            return `Multiply your acceleration by 15.`
        }
    },
    rank_56: {
        title: `Rank 56`,
        effect() {
            return Decimal.pow(2, player.m.buyables[11])
        },
        display() {
            return player.m.buyables[11].gte(56)
        },
        info() {
            return `Double your maximum velocity for each rank up.<br>Currently: ${format(this.effect())}x`
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
    },
    tier_5: {
        title: `Tier 5`,
        effect: new Decimal(2),
        display() {
            return player.m.buyables[12].gte(5)
        },
        info() {
            return `Double intelligence gain.`
        }
    },
    tier_6: {
        title: `Tier 6`,
        effect: new Decimal(5),
        display() {
            return player.m.buyables[12].gte(6)
        },
        info() {
            return `Quintyple your acceleration.`
        }
    },
    tier_7: {
        title: `Tier 7`,
        effect: new Decimal(1.5),
        display() {
            return player.m.buyables[12].gte(7)
        },
        info() {
            return `Time goes by 50% faster.`
        }
    },
    tier_8: {
        title: `Tier 8`,
        effect() {
            return Decimal.pow(1.1, player.r.buyables[11])
        },
        display() {
            return player.m.buyables[12].gte(8)
        },
        info() {
            return `Time goes by 10% faster for each rocket fuel.<br>Currently: ${format(this.effect())}x`
        }
    }
}