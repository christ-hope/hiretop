import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Company from '#models/company'
import CompanyMember from '#models/company_member'
import JobOffer from '#models/job_offer'
import Skill from '#models/skill'
import Hash from '@adonisjs/core/services/hash'
import Role from '#models/role'
import { DateTime } from 'luxon'

export default class UserAndCompanySeeder extends BaseSeeder {
  async run() {
    // Creation des utilisateurs
    const usersData = [
      {
        email: 'alice@digitalcompany.com',
        firstname: 'Alice',
        lastname: 'Dupont',
        role: 'COMPANY_ADMIN',
        memberRole: 'ADMIN',
      },
      {
        email: 'bob@digitalcompany.com',
        firstname: 'Bob',
        lastname: 'Martin',
        role: 'RECRUITER',
        memberRole: 'RECRUITER',
      },
      {
        email: 'emma@digitalcompany.com',
        firstname: 'Emma',
        lastname: 'Leroy',
        role: 'VIEWER',
        memberRole: 'VIEWER',
      },
      {
        email: 'charlie@talent.com',
        firstname: 'Charlie',
        lastname: 'Lemoine',
        role: 'TALENT',
        memberRole: null,
      },
      {
        email: 'sarah@hiretop.com',
        firstname: 'Sarah',
        lastname: 'System',
        role: 'ADMIN',
        memberRole: null,
      },
      {
        email: 'super@hiretop.com',
        firstname: 'Super',
        lastname: 'Admin',
        role: 'SUPER_ADMIN',
        memberRole: null,
      },
    ]

    const createdUsers: User[] = []

    for (const data of usersData) {
      const user = await User.firstOrCreate(
        { email: data.email },
        {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: await Hash.make('password123'),
          profile: '',
        }
      )

      // Assignation des rôles et permissions
      if (data.role) {
        const role = await Role.query().where('name', data.role).firstOrFail()
        await user.related('roles').sync([role.id], false)
      }

      createdUsers.push(user)
    }

    // Creation entreprive fictive
    const company = await Company.firstOrCreate({
      name: 'digital Company',
      country: 'Ghana',
      address: 'Aflao rivery',
      description:
        'Entreprise spécialisée dans le developpement de solution web et les services clouds.',
      admin_id: 1,
    })

    // Ajouter des membre a l'entreprise
    for (const member of usersData) {
      if (member.memberRole) {
        // rechercher l'utilisateur
        const user = await User.findByOrFail('email', member.email)

        await CompanyMember.firstOrCreate(
          { company_id: company.id, user_id: user.id },
          {
            company_id: company.id,
            user_id: user.id,
          }
        )
      }
    }

    // Création d'une offre d’emploi
    const jobOffer = await JobOffer.firstOrCreate(
      { company_id: company.id, title: 'Développeur Full-Stack React / Node.js' },

      {
      company_id: company.id,
      title: 'Développeur Full-Stack React / Node.js',
      description: 'Nous recherchons un développeur passionné pour rejoindre notre équipe. **Missions principales :* - Concevoir et développer des applications web moderne - Intégrer des API RESTfu - Optimiser les performances et l’expérience utilisateu - Collaborer avec les designers et les product owner **Profil recherché :* - Minimum 3 ans d’expérienc - Maîtrise de React, Node.js, TypeScrip - Connaissance de Git, Docker, CI/C - Esprit d’équipe et autonomi **Avantages :* - Télétravail 3 jours/semain - 13ème mois + prime - Formation continu - Équipe dynamique',
      location: 'Paris ou Remote',
      contract_type: 'CDI',
      status: 'PUBLISHED',
      is_active: true,
      expire_at: DateTime.now().plus({ days: 30 }).set({ millisecond: 0 }),
    })

    // Competences associees a l'offre
    const requiredSkills = ['React', 'Node.js', 'TypeScript', 'Git', 'Docker']
    const skills = await Skill.query().whereIn('name', requiredSkills)
    const skillIds = skills.map(s => s.id)

    if (skillIds.length > 0) {
      await jobOffer.related('skills').sync(skillIds, false)
    }
    console.log(`Offre créée : "${jobOffer.title}"`)
    console.log(`Entreprise : ${company.name}`)
    console.log(`Utilisateurs créés : ${createdUsers.map((u) => u.email).join(', ')}`)
  }
}
