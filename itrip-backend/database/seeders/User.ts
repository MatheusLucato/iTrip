import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

    public async run() {
        await User.createMany([
            {
                email: 'lucato',
                password: '12345',
            },
            {
                email: 'pz',
                password: '12345',
            }
        ])
    }

}