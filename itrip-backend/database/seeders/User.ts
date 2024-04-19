import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

    public async run() {
        await User.createMany([
            {
                username: 'lucato',
                password: '12345',
            },
            {
                username: 'pz',
                password: '12345',
            }
        ])
    }

}