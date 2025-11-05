/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import TalentController from '#controllers/talents_controller'
import JobOffersController from '#controllers/job_offers_controller'
router.on('/').renderInertia('home')

// Authentification
router.get('/login', [AuthController, 'loginScreen']).as('auth.login')
router.post('/login', [AuthController, 'login'])
router.get('/register', [AuthController, 'registerTalentScreen']).as('talent.register')
router.post('/register', [AuthController, 'storeTalent']).as('talent.store')
router
  .get('/comany/register', [AuthController, 'registerCompanyScreen'])
  .as('company.register.admin')
router.post('/company/register', [AuthController, 'storeCompanyAdmin']).as('company.admin.store')

// Jobs route
router.get('/jobs', [JobOffersController, 'index']).as('jobs.index')

router
.group(() => {
  router.get('/profile/complete', [TalentController, 'completeProfile']).as('complete-profile')
    // Jobs route
    router.get('/jobs/:id', [JobOffersController, 'show']).as('jobs.show')
    router.get('/jobs/create', [JobOffersController, 'create']).as('jobs.create')
    router.post('/jobs', [JobOffersController, 'store']).as('jobs.store')
    router.get('/jobs/:id/edit', [JobOffersController, 'edit']).as('jobs.edit')
    router.put('/jobs/:id', [JobOffersController, 'update']).as('jobs.update')
    router.delete('/jobs/:id', [JobOffersController, 'delete']).as('jobs.destroy')
    router.post('/jobs/:id/close', [JobOffersController, 'close']).as('jobs.close')

    // Talents profile route
    router.get('/talents', [TalentController, 'index']).as('talents.index')
    router.get('/talents/:id', [TalentController, 'show']).as('talents.show')
    router.get('/talents/:id/edit', [TalentController, 'edit']).as('talents.edit')
    router.put('/talents/:id', [TalentController, 'update']).as('talents.update')
  })
  .use([middleware.auth()])
