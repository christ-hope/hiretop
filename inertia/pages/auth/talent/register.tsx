import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import AuthLayout from '../../../layouts/authLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FaGoogle, FaApple } from 'react-icons/fa'

const registerSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

type RegisterForm = z.infer<typeof registerSchema>

function VerificationNotice({ email }: { email: string }) {
  const [isResending, setIsResending] = useState(false)

  const resendEmail = () => {
    setIsResending(true)
    router.post(
      '/email/verification-notification',
      {},
      {
        onFinish: () => setIsResending(false),
      }
    )
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-6">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Compte créé avec succès !</h2>
      <p className="text-sm text-gray-600 mb-6">
        Un email de vérification a été envoyé à <strong>{email}</strong>.<br />
        Cliquez sur le lien dans l’email pour activer votre compte.
      </p>

      <div className="space-y-3">
        <Button
          onClick={resendEmail}
          disabled={isResending}
          className="w-full h-12 rounded-full bg-yellow-400 font-medium hover:bg-yellow-500"
        >
          {isResending ? 'Envoi...' : 'Renvoyer l’email'}
        </Button>

        <Button
          variant="outline"
          onClick={() => router.visit('/login')}
          className="w-full h-12 rounded-full"
        >
          Aller à la connexion
        </Button>
      </div>
    </div>
  )
}

export default function Register() {
  const { appName, flash } = usePage<any>().props
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterForm) => {
    router.post('/register', data, {
      onSuccess: () => {
        setSubmittedEmail(data.email)
        setIsSubmitted(true)
      },
    })
  }

  return (
    <>
      <Head title={`Créer un compte ${appName}`} />
      <AuthLayout>
        <div className="grid h-full min-h-[640px] w-full lg:grid-cols-4">
          <div className="hidden lg:block lg:col-span-2 relative">
            <div className="h-[680px] inset-0 rounded-4xl overflow-hidden">
              <div className="absolute top-4 left-8 flex flex-row items-center gap-2">
                <span className="text-xl font-medium text-gray-400">{appName}</span>
                <span className="w-2 h-2 block rounded-full bg-amber-400"></span>
              </div>

              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
                className="inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 p-8 pointer-events-none">
                <button className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-lg backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="absolute bottom-60 left-20 w-64 rounded-3xl bg-white/20 p-5 shadow-xl backdrop-blur-sm">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-lg font-medium text-gray-800">{appName}</span>
                    <span className="w-2 h-2 block rounded-full bg-amber-400"></span>
                  </div>
                  <div className="text-sm text-white">
                    Les bonnes opportunite pour les bonnes personnes{' '}
                  </div>
                  <br />
                </div>

                <div className="absolute bottom-16 left-8 w-60 rounded-3xl bg-white p-5 shadow-xl">
                  <div className="flex flex-row justify-between items-center border-b-[1px] mb-2 pb-2 text-xs text-gray-800">
                    <span>Geraldo</span>
                    <span className="w-2 h-2 block rounded-full bg-amber-400"></span>
                  </div>
                  <div className="mb-3 text-xs text-gray-800">
                    En tant que designer, l'imagination est au centre de tout. Grace a{' '}
                    <strong>{appName}</strong> j'ai pu integrer une entreprise ou j'exprime
                    librement ma passion{' '}
                  </div>
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

          <div className="lg:col-span-2 flex flex-col justify-between p-4 bg-linear-to-b from-[#f9f9f9] to-[#fff8e6] rounded-l-4xl">
            <div className="lg:hidden flex flex-row items-center gap-2">
              <span className="text-lg font-medium text-gray-800">{appName}</span>
              <span className="w-2 h-2 block rounded-full bg-amber-400"></span>
            </div>

            <div className="flex flex-col items-center px-4 lg:px-12">
              {isSubmitted ? (
                <VerificationNotice email={submittedEmail} />
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h1>
                    <p className="text-sm text-gray-600">
                      Renseignez les differents informations pour créer votre compte {appName}
                    </p>
                  </div>

                  {flash?.error && (
                    <p className="mb-4 text-sm text-red-500 w-full max-w-sm">{flash.error}</p>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
                    <div className="grid lg:grid-cols-2 gap-4 space-x-2">
                      <div>
                        <Label className="text-sm text-gray-600">Prénom</Label>
                        <Input
                          placeholder="Amélie"
                          className="h-12 rounded-full bg-white px-5 text-base shadow-sm focus:ring-2 focus:ring-yellow-300"
                          {...register('firstname')}
                        />
                        {errors.firstname && (
                          <p className="mt-1 text-xs text-red-500">{errors.firstname.message}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">Nom</Label>
                        <Input
                          placeholder="Laurent"
                          className="h-12 rounded-full bg-white px-5 text-base shadow-sm focus:ring-2 focus:ring-yellow-300"
                          {...register('lastname')}
                        />
                        {errors.lastname && (
                          <p className="mt-1 text-xs text-red-500">{errors.lastname.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-600">Adresse email</Label>
                      <Input
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
                      <Label className="text-sm text-gray-600">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="****************"
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
                      className="h-12 w-full rounded-full bg-yellow-400 font-semibold text-gray-800 hover:bg-yellow-500"
                    >
                      {isSubmitting ? 'Création...' : 'Submit'}
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-full border-gray-300"
                      >
                        <FaApple className="mr-2" /> Apple
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-full border-gray-300"
                      >
                        <FaGoogle className="mr-2" /> Google
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2 text-center text-xs text-gray-500 lg:flex-row lg:justify-between">
              <span>
                Déjà un compte ?{' '}
                <Link
                  href="/login"
                  className="font-medium text-gray-700 underline hover:text-yellow-600"
                >
                  Se connecter
                </Link>
              </span>
              <Link href="/terms" className="font-medium text-gray-700 underline">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}
