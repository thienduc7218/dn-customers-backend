import { CoreModule } from '@dn-customers/core'
import { Module } from '@nestjs/common'

@Module({
  imports: [CoreModule],
})
export class AppModule {}
