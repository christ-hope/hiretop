// database/seeders/05_role_permission_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'

export default class RolePermissionSeeder extends BaseSeeder {
  async run() {
    const roles = await Role.all()
    const superAdmin = roles.find(r => r.name === 'SUPER_ADMIN')!
    const admin = roles.find(r => r.name === 'ADMIN')!
    const companyAdmin = roles.find(r => r.name === 'COMPANY_ADMIN')!
    const recruiter = roles.find(r => r.name === 'RECRUITER')!
    const viewer = roles.find(r => r.name === 'VIEWER')!
    const talent = roles.find(r => r.name === 'TALENT')!

    const permissions = await Permission.all()

    // PERMISSIONS DU SUPER_ADMIN
    await superAdmin.related('permissions').sync(permissions.map(p => p.id))

    // PERMISSIONS DE ADMIN
    await admin.related('permissions').sync(
      permissions
        .filter(p => ['manage_users', 'manage_roles', 'view_dashboard'].includes(p.name))
        .map(p => p.id)
    )

    // PERMISSIONS DU COMPANY_ADMIN
    await companyAdmin.related('permissions').sync(
      permissions
        .filter(p => [
          'manage_company',
          'add_member',
          'remove_member',
          'create_job_offer',
          'edit_job_offer',
          'delete_job_offer',
          'view_applications',
          'view_dashboard'
        ].includes(p.name))
        .map(p => p.id)
    )

    // PERMISSIONS DU RECRUITER
    await recruiter.related('permissions').sync(
      permissions
        .filter(p => ['create_job_offer', 'edit_job_offer', 'view_applications', 'view_dashboard'].includes(p.name))
        .map(p => p.id)
    )

    // PERMISSIONS VIEWER
    await viewer.related('permissions').sync(
      permissions
        .filter(p => ['view_applications', 'view_dashboard'].includes(p.name))
        .map(p => p.id)
    )

    // PERMISSIONS TALENT
    await talent.related('permissions').sync(
      permissions
        .filter(p => ['apply_job', 'view_own_applications', 'view_dashboard'].includes(p.name))
        .map(p => p.id)
    )
  }
}
