import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  getProtectedHello(username: string) {
    return { message: `Hello ${username}!` }
  }
}
