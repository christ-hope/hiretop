import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import {
  hasRole,
  hasPermission,
  roleHasPermission,
  assignRole,
  assignPermission,
  can,
  removeRole,
  removePermission } from '../helpers/rbac.js'

export default class RbacMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    ctx.hasRole = hasRole
    ctx.hasPermission = hasPermission
    ctx.roleHasPermission = roleHasPermission
    ctx.assignRole = assignRole
    ctx.assignPermission = assignPermission
    ctx.can = can
    ctx.removeRole = removeRole
    ctx.removePermission = removePermission

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
