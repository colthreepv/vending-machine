import { Coins, validCoinList } from 'shared-types/src/crud'
import { freshAccount } from './vault.utils'

export class Vault {
  private readonly v = freshAccount()

  constructor(bootstrap: Coins = { '5': 10, '10': 10, '20': 10, '50': 10, '100': 10 }) {
    this.init(bootstrap)
  }

  private init(coins: Coins): Coins {
    for (const coinValue of validCoinList) {
      this.v[coinValue] = coins[coinValue]
    }

    return this.v
  }

  deposit(coins: Coins): Coins {
    for (const coinValue of validCoinList) {
      this.v[coinValue] = this.v[coinValue] + coins[coinValue]
    }

    return this.v
  }

  withdraw(coins: Coins): Coins {
    for (const coinValue of validCoinList) {
      this.v[coinValue] = this.v[coinValue] - coins[coinValue]
    }

    return this.v
  }

  check(): Coins {
    return Object.assign({}, this.v)
  }
}
