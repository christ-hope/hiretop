// app/services/talent_service.ts
import TalentProfile from '#models/talent_profile'
import User from '#models/user'
import Skill from '#models/skill'
import TalentEducation from '#models/talent_education'
import TalentExperience from '#models/talent_experience'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

interface TalentFilters {
  search?: string
  skills?: string[]
  location?: string
  page?: number
  limit?: number
}

interface UpdateTalentData {
  phone?: string | null
  title?: string | null
  bio?: string | null
  location?: string | null
  isAvailable?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  cv?: any
  skills?: { skillId: number; level?: string }[]
  experiences?: Array<{
    id?: number
    title: string
    company: string
    location?: string
    startDate: string
    endDate?: string | null
    current?: boolean
    description?: string
  }>
  educations?: Array<{
    id?: number
    school: string
    degree: string
    field: string
    startDate: string
    endDate?: string | null
    current?: boolean
  }>
}

interface TalentResponse {
  data: (TalentProfile & { user: User })[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export class TalentService {
  /**
   * Récupère les talents depuis TalentProfile (meilleure approche)
   */
  async getTalents(filters: TalentFilters = {}): Promise<TalentResponse> {
    const { search = '', skills = [], location = '', page = 1, limit = 20 } = filters

    const query = TalentProfile.query()
      .preload('user')
      .preload('skills')
      .preload('experiences')
      .preload('educations')

    // Recherche a partir des filtres si definies
    if (search) {
      query
        .whereHas('user', (user) => {
          user.whereILike('firstname', `%${search}%`).orWhereILike('lastname', `%${search}%`)
        })
        .orWhereILike('title', `%${search}%`)
        .orWhereILike('bio', `%${search}%`)
    }

    if (location) {
      query.whereILike('location', `%${location}%`)
    }

    if (skills.length > 0) {
      query.whereHas('skills', (skillQuery) => {
        skillQuery.whereIn('name', skills)
      })
    }

    const result = await query.paginate(page, limit)

    return {
      data: result.all(),
      meta: result.getMeta(),
    }
  }

  /**
   * Récuperer un talent par son ID
   */
  async getTalent(id: number) {
    return TalentProfile.query()
      .where('id', id)
      .preload('user')
      .preload('skills')
      .preload('experiences')
      .preload('educations')
      .first()
  }

  /**
   * Mise à jour des informations du profil talent
   * @param talentId ID du profil talent
   * @param data Données à mettre à jour
   * @param userId ID de l'utilisateur
   */
  /**
   * Mise à jour complète du profil talent
   */
  async updateTalent(talentId: number, data: UpdateTalentData, userId: number): Promise<TalentProfile> {
    const {
      phone,
      title,
      bio,
      location,
      isAvailable,
      linkedinUrl,
      githubUrl,
      cv,
      skills,
      experiences,
      educations,
    } = data

    //  Recuperation des informations du profile talent
    const talentProfile = await TalentProfile.query()
      .where('id', talentId)
      .preload('user')
      .preload('skills')
      .preload('experiences')
      .preload('educations')
      .firstOrFail()

      // Verification de l'autorisation
    if (talentProfile.user_id !== userId) {
      throw new Error("Vous n'êtes pas autorisé à effectuer cette action:")
    }

    if (phone !== undefined) talentProfile.phone = phone
    if (title !== undefined) talentProfile.title = title
    if (bio !== undefined) talentProfile.bio = bio
    if (location !== undefined) talentProfile.location = location
    if (isAvailable !== undefined) talentProfile.is_available = isAvailable
    if (linkedinUrl !== undefined) talentProfile.linkedin_url = linkedinUrl
    if (githubUrl !== undefined) talentProfile.github_url = githubUrl

    // Envoie ou mise a jour du CV
    if (cv) {
      const fileName = `${cuid()}.${cv.extname}`
      await cv.moveToDisk('cvs', { name: fileName }, 'local')
      talentProfile.cv_url = await drive.use().getUrl(`cvs/${fileName}`)
    }

    // Creation ou mise a jour des competences
    if (skills !== undefined) {
      const validSkillIds = await Skill.query().whereIn('id', skills.map(s => s.skillId)).select('id')
      const validIds = validSkillIds.map(s => s.id)

      if (validIds.length !== skills.length) {
        throw new Error('Une ou plusieurs compétences sont invalides.')
      }

      await talentProfile.related('skills').detach()

      const attachData: Record<number, { level: string }> = {}
      for (const { skillId, level } of skills) {
        attachData[skillId] = { level: level || 'debutant' }
      }

      await talentProfile.related('skills').attach(attachData)
    }

    // Creation ou mise a jour des experiences professionnelles
    if (experiences !== undefined) {
      const existingIds = talentProfile.experiences.map(e => e.id).filter(Boolean)
      const incomingIds = experiences.map(e => e.id).filter(Boolean)

      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      if (toDelete.length > 0) {
        await TalentExperience.query().whereIn('id', toDelete).where('talent_profile_id', talentId).delete()
      }

      for (const exp of experiences) {
        const payload = {
          title: exp.title,
          company: exp.company,
          location: exp.location,
          start_date: exp.startDate,
          end_date: exp.current ? null : exp.endDate,
          current: exp.current || false,
          description: exp.description,
        }

        if (exp.id) {
          await TalentExperience.query().where('id', exp.id).update(payload)
        } else {
          await talentProfile.related('experiences').create(payload)
        }
      }
    }

    // Creation ou mise a jour des formations
    if (educations !== undefined) {
      const existingIds = talentProfile.educations.map(e => e.id).filter(Boolean)
      const incomingIds = educations.map(e => e.id).filter(Boolean)

      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      if (toDelete.length > 0) {
        await TalentEducation.query().whereIn('id', toDelete).where('talent_profile_id', talentId).delete()
      }

      for (const edu of educations) {
        const payload = {
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          start_date: edu.startDate,
          end_date: edu.current ? null : edu.endDate,
          current: edu.current || false,
        }

        if (edu.id) {
          await TalentEducation.query().where('id', edu.id).update(payload)
        } else {
          await talentProfile.related('educations').create(payload)
        }
      }
    }

    await talentProfile.save()

    await talentProfile.load('user')
    await talentProfile.load('skills')
    await talentProfile.load('experiences')
    await talentProfile.load('educations')

    return talentProfile
  }
}
