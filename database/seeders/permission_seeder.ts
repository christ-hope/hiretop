import data from '#database/data'
import Permission from '#models/permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const permissionsData = data.permissions

    permissionsData.map(async (permission) => {
      await Permission.firstOrCreate({
        name: permission.name,
        description: permission.description,
      })
    });
  }
}
