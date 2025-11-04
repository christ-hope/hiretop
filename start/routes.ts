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
router.on('/').renderInertia('home')

router.get('/login', [AuthController, 'loginScreen']).as('auth.login')
router.post('/login', [AuthController, 'login'])
router.get('/register', [AuthController, 'registerTalentScreen']).as('talent.register')
router.post('/register', [AuthController, 'storeTalent']).as('talent.store')
router
  .get('/comany/register', [AuthController, 'registerCompanyScreen'])
  .as('company.register.admin')
router.post('/company/register', [AuthController, 'storeCompanyAdmin']).as('company.admin.store')

router.group(() => {
    router.get('/talents', [TalentController, 'index']).as('talents.index')
    router.get('/talents/:id', [TalentController, 'show']).as('talents.show')
    router.get('/talents/:id/edit', [TalentController, 'edit']).as('talents.edit')
    router.put('/talents/:id', [TalentController, 'update']).as('talents.update')
  })
  .use([middleware.auth()])
