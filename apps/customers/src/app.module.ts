import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CustomersModule } from './services/customers.module'

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI, { useNewUrlParser: true }), CustomersModule],
})
export class AppModule {}
