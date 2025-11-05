import User from '#models/user'
import { JobOfferService } from '#services/job_offer_service'
import { createJobOfferRequest, updateJobOfferRequest } from '#validators/create_job_offer_request'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class JobOffersController {
  constructor(private jobOfferService: JobOfferService) {}

  /**
   * Recuperations des offre d'emploi/jobs
   */
  async index({ request, inertia }: HttpContext) {
    const filters = {
      search: request.input('search'),
      skills: request.input('skills', []),
      contractType: request.input('contract_type'),
      location: request.input('location'),
      page: request.input('page', 1),
      limit: 12,
    }

    const { data: offers, meta } = await this.jobOfferService.getJobOffers(filters)

    return inertia.render('jobs', {
      offers,
      meta,
      filters,
    })
  }

  /**
   * Page de création de l'offre d'emploi
   */
  async create({ auth, inertia, hasRole, can }: HttpContext) {
    const user = await User.findOrFail(auth.user!.id)

    const userHasRole = (await hasRole(user, 'COMPANY_ADMIN')) || (await hasRole(user, 'RECRUITER'))
    // Verifier si cet utilisateur peut acceder a cette page
    if (!userHasRole) return inertia.render('Errors/403')

    return inertia.render('JobOffer/create')
  }

  /**
   * Sauvegarder une offre
   */
  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const data = await request.validateUsing(createJobOfferRequest)

    try {
      const job = await this.jobOfferService.createJobOffer(userId, data)
      return response.created({
        message: "Offre d'emploi créée avec succès",
        job: job.serialize(),
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Page détail d’une offre
   */
  async show({ params, auth, inertia, hasRole }: HttpContext) {
    const jobId = Number(params.id)
    const userId = auth.user?.id

    const user = await User.findOrFail(userId)
    const userHasRole = await hasRole(user, 'TALENT')

    const offer = await this.jobOfferService.getJobOffer(jobId)
    if (!offer) return inertia.render('Errors/404')

    let canApply = false
    if (userId && userHasRole) {
      const talent = await auth.user.related('talentProfile').query().first()
      if (talent) {
        const talentSkills = await talent.related('skills').query().select('*')
        const offerSkills = offer.skills.map(s => s.id)
        canApply = talentSkills.some(ts => offerSkills.includes(ts.id))
      }
    }

    return inertia.render('JobOffer/Show', {
      offer,
      canApply,
    })
  }

  /**
   * Page de édition de l'offre d'emploi
   */
  async edit({ auth, params, inertia, hasRole, can, response }: HttpContext) {
    const user = await User.findOrFail(auth.user!.id)
    const jobId = Number(params.id)

    const userHasRole = (await hasRole(user, 'COMPANY_ADMIN')) || (await hasRole(user, 'RECRUITER'))
    // Verifier si cet utilisateur peut acceder a cette page
    if (!userHasRole) return inertia.render('Errors/403')

    const jobOffer = await this.jobOfferService.getJobOffer(jobId)
    if (!jobOffer) return inertia.render('Errors/404')

      const member = await jobOffer.related('company').query().preload('members').first()
    const isOwner = member?.members.some(m => m.user_id === user.id)
    if (!isOwner) return response.forbidden('Accès refusé.')

    return inertia.render('JobOffer/Edit', { jobOffer })
  }

  /**
   * Mise à jour d'une offre
   */
  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id
    const jobId = Number(params.id)
    const data = await request.validateUsing(updateJobOfferRequest)

    try {
      const job = await this.jobOfferService.updateJobOffer(jobId, data, userId)
      return response.ok({
        message: "Offre d'emploi mise à jour",
        job: job.serialize(),
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Suppression d'une offre
   */
  async delete({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const jobId = Number(params.id)

    try {
      await this.jobOfferService.deleteJobOffer(userId, jobId)
      return response.ok({ message: 'Offre supprimée' })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Clôturer une offre
   */
  async close({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const jobId = Number(params.id)

    try {
      const job = await this.jobOfferService.closeJobOffer(userId, jobId)
      return response.ok({
        message: 'Offre marquée comme clôturée',
        job: job.serialize(),
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
