import type { HttpContext } from '@adonisjs/core/http'
import Mail from '@adonisjs/mail/services/main'

import { AuthService } from '#services/auth/auth_service'
import { loginValidator, registerUserValidation } from '#validators/auth_request'
import { DateTime } from 'luxon'
import User from '#models/user'
import env from '#start/env'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}

  // vue pour inscription Talent
  async registerTalentScreen({ request, inertia }: HttpContext) {
    return inertia.render('auth/talent/register')
  }

  async storeTalent({ assignRole, request, response }: HttpContext) {
    const data = await request.validateUsing(registerUserValidation)
    const user = await this.authService.registerUser(data)

    assignRole(user, 'TALENT')

    const verificationUrl = this.generateVerificationUrl(user.id)

    // Envoyer email de vérification
    await Mail.send((message) => {
      message
        .to(user.email)
        .from('info@hiretop.com', 'HireTop')
        .subject('Vérifiez votre compte HireTop')
        .htmlView('emails/verify_email', { user, verificationUrl })
    })

    return response.created({ message: 'Inscription réussie. Vérifiez votre email.' })
  }

  // vue inscription pour compte recruiter
  async registerCompanyScreen({ inertia }: HttpContext) {
    return inertia.render('auth/talent/register')
  }
  async storeCompanyAdmin({ assignRole, request, response, session }: HttpContext) {
    const data = await request.validateUsing(registerUserValidation)
    const user = await this.authService.registerUser(data)

    assignRole(user, 'COMPANY_ADMIN')

    const verificationUrl = this.generateVerificationUrl(user.id)

    // Envoyer email de vérification
    await Mail.send((message) => {
      message
        .to(user.email)
        .from('info@hiretop.com', env.get('APP_NAME'))
        .subject('Vérifiez votre compte' + env.get('APP_NAME'))
        .htmlView('emails/verify_email', { user, verificationUrl })
    })

    session.flash('success', 'Compte entreprise créé. Vérifiez votre email.')
    return response.redirect().toPath('/login')
  }

  /**
   * vue pour la connexion
   */

  async loginScreen({ request, inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * handler connexion
   */
  async login({ auth, request, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    // Vérifier que l'email est confirmé
    if (!user.emailVerifiedAt) {
      session.flash('error', 'Veuillez vérifier votre email avant de vous connecter.')
      return response.redirect().back()
    }

    try {
      // Ici utilisation de session
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      // ici utilisation token (ancienne option)
      // User.accessTokens.create(user)
      session.flash('success', 'Connexion réussie ! Bienvenue.')
      return response.redirect('/jobs')
    } catch {
      session.flash('error', 'Identifiants incorrects.')
      return response.redirect().back()
    }
  }

  /**
   * Methode de deconnexion
   */
  async logout({ auth, response, session }: HttpContext) {
    const user = await auth.user!

    if (!user) return null
    await auth.use('web').logout()
    session.flash('success', 'Déconnexion effectuée avec succès')
    return response.redirect().toRoute('auth.login')
  }

  /**
   * Vérification de l'email
   */
  async verifyEmail({ params, response }: HttpContext) {
    const { id, hash } = params
    const user = await this.authService.verifyEmail(id, hash)

    return response.ok({
      message: 'Email vérifié avec succès ! Vous pouvez vous connecter.',
      user: user.serialize(),
    })
  }

  private generateVerificationUrl(userId: number): string {
    const hash = Buffer.from(`${userId}|${DateTime.now().toMillis()}`).toString('base64url')
    return `http://localhost:3333/auth/verify/${userId}/${hash}`
  }
}
