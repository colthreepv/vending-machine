import { Coins } from 'shared-types/src/crud'
import { freshAccount } from './vault.utils'

export class Vault {
  private readonly v = freshAccount()

  constructor(bootstrap: Coins = { '5': 10, '10': 10, '20': 10, '50': 10, '100': 10 }) {
    this.init(bootstrap)
  }

  private init(coins: Coins): Coins {
    for (const coinValue of [100, 50, 20, 10, 5]) {
      this.v[coinValue] = Number(coins[coinValue] ?? 0)
    }

    return this.v
  }

  deposit(coins: Coins): Coins {
    for (const coinValue of [100, 50, 20, 10, 5]) {
      this.v[coinValue] = Number(this.v[coinValue] ?? 0) + Number(coins[coinValue] ?? 0)
    }

    return this.v
  }

  withdraw(coins: Coins): Coins {
    for (const coinValue of [100, 50, 20, 10, 5]) {
      this.v[coinValue] = Number(this.v[coinValue] ?? 0) - Number(coins[coinValue] ?? 0)
    }

    return this.v
  }

  check(): Coins {
    return Object.assign({}, this.v)
  }
}
