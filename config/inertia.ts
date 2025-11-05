// config/inertia.ts
import User from '#models/user'
import env from '#start/env'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Vue racine Edge
   */
  rootView: 'inertia_layout',

  /**
   * Données partagées
   */
  sharedData: {
    /**
     * Utilisateur authentifié + rôles + permissions
     */
    auth: async (ctx) => {
      const loggedUser = ctx.auth.user

      if (!loggedUser) return null

      const user = await User.findOrFail(loggedUser.id)

      // Charger les relations
      await user.load('roles')
      await user.load('permissions')

      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile: user.profile,
        emailVerifiedAt: user.emailVerifiedAt?.toISO(),
        roles: user.roles.map((role) => ({
          id: role.id,
          name: role.name,
        })),
        permissions: user.permissions.map((perm) => perm.name),
        isTalent: user.roles.some(r => r.name === 'TALENT'),
        isCompanyAdmin: user.roles.some(r => r.name === 'COMPANY_ADMIN'),
        isRecruiter: user.roles.some(r => r.name === 'RECRUITER'),
        talentProfile: user.talentProfile,
      }
    },

    /**
     * Flash messages
     */
    flash: (ctx) => {
      const flashes = ctx.session.flashMessages.all()
      return Object.keys(flashes).reduce((acc, key) => {
        acc[key] = flashes[key][0] || null
        return acc
      }, {} as Record<string, string | null>)
    },

    /**
     * Nom de l'application
     */
    appName: () => env.get('APP_NAME') || 'HireTop',
  },

  /**
   * SSR
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

/**
 * Typage global des props partagées
 */
declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
