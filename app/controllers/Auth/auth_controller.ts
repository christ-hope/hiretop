import type { HttpContext } from '@adonisjs/core/http'
import Mail from '@adonisjs/mail/services/main'

import { AuthService } from '#services/Auth/auth_service'
import { loginValidator, registerUserValidation } from '#validators/auth_request'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class AuthController {
  constructor(protected authService: AuthService) {}

  async registerTalent({ assignRole, request, response }: HttpContext) {
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

  async registerCompanyAdmin({ assignRole, request, response }: HttpContext) {
    const data = await registerUserValidation.validate(request.all())
    const user = await this.authService.registerUser(data)

    assignRole(user, 'COMPANY_ADMIN')

    const verificationUrl = this.generateVerificationUrl(user.id)

    // Envoyer email de vérification
    await Mail.send((message) => {
      message
        .to(user.email)
        .from('info@hiretop.com', 'HireTop')
        .subject('Vérifiez votre compte HireTop')
        .htmlView('emails/verify_email', { user, verificationUrl })
    })

    return response.created({ user, message: 'utilisateur créé avec succès' })
  }

  /**
   * Mise en plqce de la Connexion
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    // Vérifier que l'email est confirmé
    if (!user.emailVerifiedAt) {
      return response.unprocessableEntity({
        message: 'Veuillez vérifier votre email avant de vous connecter.',
      })
    }
    User.accessTokens.create(user)
  }

  /**
   * Methode de deconnexion
   */
  async logout({ auth }: HttpContext) {
    const user = await auth.user!

    User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'Déconnexion effectuée avec succès' }
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
