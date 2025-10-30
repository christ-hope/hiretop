// types/http.ts
import Role from "#models/role"
import User from "#models/user"

declare module '@adonisjs/core/http' {
  interface HttpContext {
    hasRole: (user: User, roleName: string) => Promise<boolean>
    hasPermission: (user: User, permissionName: string) => Promise<boolean>
    roleHasPermission: (role: Role, permissionName: string) => Promise<boolean>
    assignRole: (user: User, roleName: string) => Promise<void>
    assignPermission: (user: User, permissionName: string) => Promise<void>
    removeRole: (user: User, roleName: string) => Promise<void>
    removePermission: (user: User, permissionName: string) => Promise<void>
    can: (user: User, permissionName: string) => Promise<boolean>
  }
}
