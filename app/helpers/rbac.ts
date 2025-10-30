import Permission from "#models/permission"
import Role from "#models/role"
import User from "#models/user"

//  Mise en place de la methode hasRole pour verifier les role utilisateur
export async function hasRole(user: User, roleName: string): Promise<boolean> {
  return !! (await user.related('roles').query().where('name', roleName).first())
}

// Mise en place de la methode hasPermission pour verifier les permissions de l'utilisateur
export async function hasPermission(user: User, permissionName: string): Promise<boolean> {
  return !!(await user.related('permissions').query().where('name', permissionName))
}

// Mise en place de la methode roleHasPermission pour verifier les permission associe a un role specifique
export async function roleHasPermission(role: Role, permissionName: string): Promise<boolean> {
  return !!(await role.related('permissions').query().where('name', permissionName))
}

// Methode pour assigner un role a un utilisateur
export async function assignRole(user: User, roleName: string): Promise<void> {
  const role = await Role.query().where('name', roleName).firstOrFail();

  await user.related('roles').attach([role.id]);
}

// Methode pour assigner une permission a un utilisateur
export async function assignPermission(user: User, permissionName: string): Promise<void> {
  const permission = await Permission.query().where('name', permissionName).firstOrFail();

  await user.related('permissions').attach([permission.id]);
}

// Methode pour retirer un role d'un utilisateur
export async function removeRole(user: User, roleName: string): Promise<void> {
  const role = await Role.query().where('name', roleName).firstOrFail();

  await user.related('roles').detach([role.id]);
}

// Methode pour retirer une permission d'un utilisateur
export async function removePermission(user: User, permissionName: string): Promise<void> {
  const permission = await Permission.query().where('name', permissionName).firstOrFail();

  await user.related('permissions').detach([permission.id]);
}

/**
 * Veifier une permission pour un utilisateur
 * ---------------------------------------------------------------------
 * cette methode permet de verifier si un utilisateur peut ou non
 * faire une action ou pas
 */

export async function can(user: User, permissionName: string): Promise<boolean> {
  return await hasPermission(user, permissionName);
}
