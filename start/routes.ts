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
router.on('/').renderInertia('home')

router.get('/login', [AuthController, 'loginScreen']).as('auth.login')
router.post('/login', [AuthController, 'login'])
router.get('/register', [AuthController, 'registerTalentScreen']).as('talent.register')
router.post('/register', [AuthController, 'storeTalent']).as('talent.store')
router.get('/comany/register', [AuthController, 'registerCompanyScreen']).as('company.register.admin')
router.post('/company/register', [AuthController, 'storeCompanyAdmin']).as('company.admin.store')
