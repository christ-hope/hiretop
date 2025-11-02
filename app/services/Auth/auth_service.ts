import Company from '#models/company'
import CompanyMember from '#models/company_member'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export class AuthService {
  // Enregistrement d'un nouvelle utilisateur
  async registerUser(data: any) {
    return await User.firstOrCreate(
      { email: data.email },
      {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: await Hash.make(data.password),
        profile: '',
      }
    )
  }

  // Enregistrement d'une nouvelle entreprise
  async registerCompany(user: User, data: any) {
    const company = await Company.firstOrCreate(
      { name: data.name },
      {
        admin_id: user.id,
        name: data.name,
        country: data.country,
        address: data.address,
        description: data.description,
      }
    )

    await CompanyMember.firstOrCreate(
      { company_id: company.id, user_id: user.id },
      {
        company_id: company.id,
        user_id: user.id,
      }
    )

    return { user, company }
  }

  // Connexion de l'utilisateur
  async loginUser(email: string, password: string) {
    const user = await User.query().where('email', email).first()
    if (!user) {
      throw new Error('Utilisateur introuvable verifier cet adresse et reessayer...')
    }

    // Verification du mot de passe
    if (!(await Hash.verify(user.password, password))) {
      throw new Error('Identifiants invalides')
    }

    return user
  }

  async verifyEmail(id: number, hash: string) {
    const user = await User.findOrFail(id)

    if (user.emailVerifiedAt) {
      throw new Error('Ce compte est déjà vérifé. Veuillez vous connectez...')
    }

    const decoded = Buffer.from(hash, 'base64url').toString()
    const [userId, timestamp] = decoded.split('|')
    const sentAt = DateTime.fromMillis(Number(timestamp))

    if (userId !== String(id) || sentAt < DateTime.now().minus({ hours: 1 })) {
      throw new Error('Lien invalide ou expiré')
    }

    user.emailVerifiedAt = DateTime.now()
    await user.save()

    return user
  }

}
