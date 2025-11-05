import TalentProfile from '#models/talent_profile'
import { TalentService } from '#services/talent_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckTalentProfileCompletionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user!
    const userHasRole = await ctx.hasRole(user, 'TALENT')
    if(!userHasRole) return next()

      const talentService = new TalentService()
      const talentProfile = await TalentProfile.query().where('user_id', user.id).firstOrFail()

      const completion = await talentService.getTalentProfileCompletion(talentProfile.id)
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
