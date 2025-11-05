// app/controllers/talent_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { TalentService } from '#services/talent_service'
import { updateTalentRequest } from '#validators/update_talent_request'
import Skill from '#models/skill'

@inject()
export default class TalentController {
  constructor(private talentService: TalentService) {}

  /**
   * Recuperations des profils talents
   */
  async index({ request, inertia }: HttpContext) {
    const filters = {
      search: request.input('search'),
      skills: request.input('skills', []),
      location: request.input('location'),
      page: request.input('page', 1),
      limit: 12,
    }

    // Recuperations des competences disponible dans le systeme
    const skills = Skill.all()

    const { data: talents, meta } = await this.talentService.getTalents(filters)

    return inertia.render('Talent/Index', { skills, talents, meta, filters })
  }

  /**
   * Details d'un profil Talent
   */
  async show({ params, inertia }: HttpContext) {
    const talent = await this.talentService.getTalent(Number(params.id))
    if (!talent) return inertia.render('Errors/404')

    return inertia.render('Talent/Show', { talent })
  }

  /**
   * Vue d'edition d'un profi Talent
   * -----------------------------------------
   * -----------------------------------------
   * Seul le detenteur du compte peut modifier
   * les informations de son profil Talent
   */
  async edit({ auth, params, inertia, response }: HttpContext) {
    const user = auth.user!
    const talentId = Number(params.id)

    // Vérifier ce profil Talent apparitent a l'utilisateur connecté
    const talent = await this.talentService.getTalent(talentId)
    if (!talent || talent.user.id !== user.id) {
      return response.forbidden('Vous ne pouvez modifier que votre propre profil Talent.')
    }

    return inertia.render('Talent/Edit', { talent })
  }

  /**
   * Mise à jour du profil Talent
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const talentId = Number(params.id)

    const data = await request.validateUsing(updateTalentRequest)
    const cv = request.file('cv')

    const talent = await this.talentService.getTalent(talentId)
    if (!talent || talent.user.id !== user.id) {
      return response.forbidden('Accès refusé.')
    }

    try {
      const updated = await this.talentService.updateTalent(talentId, { ...data, cv }, user.id)
      return response.ok({ message: 'Profil mis à jour', talent: updated.serialize() })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  async completeProfile({ auth, inertia }: HttpContext) {
    const user = auth.user!
    const talent = await this.talentService.getTalent(user.talentProfile.id)
    let completion = 0

    if (talent?.id != null) {
      completion = await this.talentService.getTalentProfileCompletion(talent?.id)
    }

    return inertia.render('Profile/Complete', { talent, completion })
  }
}
