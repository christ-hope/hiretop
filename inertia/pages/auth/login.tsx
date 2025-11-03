import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import AuthLayout from '../../layouts/authLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FaGoogle, FaGithub } from 'react-icons/fa'

const loginSchema = z.object({
  email: z
    .string()
    .email('Cet email est invalide, veuillez entrez un email valide (ex: example@hiretop.com)'),
  password: z.string().min(8, 'Le mot de passe doit contenir au minimum 8 caractères'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const { appName, flash } = usePage<any>().props

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <>
      <Head title={`Connexion à votre compte ${appName}`} />
      <AuthLayout>
        <div className="grid h-full w-full lg:grid-cols-5">
          <div className="lg:col-span-2 flex flex-col justify-between p-8 bg-gradient-to-b from-[#f9f9f9] to-[#fff8e6] rounded-l-4xl">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-linear-to-r from-yellow-400 to-blue-500" />
              <span className="text-lg font-medium text-gray-800">{appName}</span>
            </div>

            <div className="flex flex-col items-center px-4 lg:px-12">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonjour !</h1>
                <p className="text-sm text-gray-600">
                  Connectez-vous à votre compte {appName} avec votre email et mot de passe.
                </p>
              </div>

              {flash?.error && <p className="mb-3 text-sm text-red-500">{flash.error}</p>}
              {flash?.success && <p className="mb-3 text-sm text-green-600">{flash.success}</p>}

              <form
                method="POST"
                action="/login"
                onSubmit={handleSubmit(() => {})}
                className="w-full max-w-sm space-y-4"
              >
                <div>
                  <Label htmlFor="email" className="text-xs text-gray-500 pl-1">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@hiretop.com"
                    className="h-12 rounded-full bg-white px-5 text-base shadow-sm focus:ring-2 focus:ring-yellow-300"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-xs text-gray-500 pl-1">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="***********"
                      className="h-12 rounded-full bg-white px-5 pr-12 text-base shadow-sm focus:ring-2 focus:ring-yellow-300"
                      {...register('password')}
                    />
                    <button type="button" className="absolute right-4 top-3.5 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full bg-yellow-400 font-medium hover:bg-yellow-500"
                >
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-11 rounded-full text-sm">
                    <FaGithub className="mr-1.5" /> GitHub
                  </Button>
                  <Button variant="outline" className="flex-1 h-11 rounded-full text-sm">
                    <FaGoogle className="mr-1.5" /> Google
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-2 text-center text-xs text-gray-500 lg:flex-row lg:justify-between">
              <span>
                Pas de compte ?{' '}
                <Link
                  href="/register"
                  className="font-medium text-gray-700 underline hover:text-yellow-600"
                >
                  S’inscrire
                </Link>
              </span>
              <Link href="/terms" className="font-medium text-gray-700 underline">
                Termes & Conditions
              </Link>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-3 relative">
            <div className="card absolute inset-0 rounded-r-4xl overflow-hidden bg-gradient-to-b from-[#fffbe6] to-[#fefce8]">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 p-8 pointer-events-none">
                <button className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="absolute top-8 left-8 max-w-xs rounded-full bg-yellow-400 p-3 text-sm font-medium text-gray-800 shadow-lg">
                  <div>Task Review With Team</div>
                  <div className="text-xs opacity-80">09:30am–10:00am</div>
                </div>

                <div className="absolute top-32 right-12 flex -space-x-3">
                  {['44', '68', '32', '22'].map((id) => (
                    <img
                      key={id}
                      src={`https://randomuser.me/api/portraits/women/${id}.jpg`}
                      alt="Team member"
                      className="h-12 w-12 rounded-full border-4 border-white shadow-md"
                    />
                  ))}
                </div>

                <div className="absolute bottom-40 left-8 w-64 rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur-sm">
                  <div className="mb-3 flex justify-between text-xs font-medium text-gray-500">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {[22, 23, 24].map((d) => (
                      <div key={d} className="py-2">{d}</div>
                    ))}
                    <div className="rounded-lg bg-yellow-400 py-2 font-bold text-gray-800">25</div>
                    {[26, 27, 28].map((d) => (
                      <div key={d} className="py-2">{d}</div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-16 left-8 w-60 rounded-3xl bg-white p-5 shadow-xl">
                  <div className="mb-1 text-xs text-gray-500">Daily Meeting</div>
                  <div className="mb-3 text-base font-semibold text-gray-800">12:00pm–01:00pm</div>
                  <div className="flex -space-x-2">
                    {['44', '32', '68'].map((id) => (
                      <img
                        key={id}
                        src={`https://randomuser.me/api/portraits/women/${id}.jpg`}
                        alt="Attendee"
                        className="h-10 w-10 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}
