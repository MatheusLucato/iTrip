import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {

    public async run() {
        await User.createMany([
            {
                username: 'lucato',
                password: '12345',
                cep: '81010-200',
                cpf: '110.275.379-36',
                ismotorista: false,
                cnh: ''
            },
            {
                username: 'pz',
                password: '12345',
                cep: '81010-210',
                cpf: '110.275.199.54',
                ismotorista: false,
                cnh: ''
            }
        ])
    }

}