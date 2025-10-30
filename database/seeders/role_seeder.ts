import { BaseSeeder } from '@adonisjs/lucid/seeders'
import data from '#database/data'
import Role from '#models/role';

export default class extends BaseSeeder {
  async run() {
    const rolesData = data.roles;

    // 
    await Role.truncate();
    await Role.updateOrCreateMany('name', rolesData);
  }
}
