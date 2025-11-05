// resources/js/Pages/JobOffer/Index.tsx
import { Head, Link, router, usePage } from '@inertiajs/react'
import AuthLayout from '../layouts/authLayout'
import {
  Search,
  MapPin,
  Clock,
  Filter,
  LogOut,
  Building2,
  Briefcase,
  DollarSign,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { useState, useEffect } from 'react'

interface Company {
  id: number
  name: string
  logo_url?: string
}

interface Skill {
  id: number
  name: string
}

interface JobOffer {
  id: number
  title: string
  company: Company
  contract_type: 'CDI' | 'CDD' | 'FREELANCE' | 'INTERNSHIP'
  salary_min?: number
  salary_max?: number
  location: string
  created_at: string
  is_urgent: boolean
  description_bullets: string[]
  skills: Skill[]
}

interface PageProps {
  appName: string
  flash: { message?: string; error?: string }
  auth: {
    user?: {
      id: number
      firstname: string
      lastname: string
      roles: string[]
      talent_profile?: {
        skills: { id: number }[]
      }
    } | null
  } | null
  offers: JobOffer[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
  filters: {
    search: string
    location: string
    contract_type?: string
  }
  [key: string]: any
}

export default function Jobs() {
  const { appName, flash, auth, offers, meta, filters } = usePage<PageProps>().props

  const user = auth?.user ?? null
  const isLoggedIn = !!user
  const userRoles = user?.roles ?? []
  const userSkills = user?.talent_profile?.skills?.map((s) => s.id) ?? []

  const [search, setSearch] = useState(filters.search || '')
  const [location, setLocation] = useState(filters.location || '')
  const [contractType, setContractType] = useState(filters.contract_type || '')
  const [isLoading, setIsLoading] = useState(false)

  // === LOADER GLOBAL ===
  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleStop = () => setIsLoading(false)

    router.on('start', handleStart)
    router.on('finish', handleStop)

    return () => {
      router.cancelAll()
    }
  }, [])

  const canApply = (jobSkills: number[]) => {
    if (!isLoggedIn) return false
    return jobSkills.some((id) => userSkills.includes(id))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.get(
      '/jobs',
      { search, location, contract_type: contractType },
      { preserveState: true, replace: true }
    )
  }

  const handleApply = (jobId: number) => {
    if (!isLoggedIn) {
      router.visit('/login', {
        data: { flash: { error: 'Veuillez vous connecter pour postuler.' } },
        preserveState: true,
      })
      return
    }
    router.post(`/jobs/${jobId}/apply`)
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null
    if (min && max) return `${min} € – ${max} €`
    if (min) return `À partir de ${min} €`
    return `Jusqu'à ${max} €`
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diff = now.getTime() - posted.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) return `Il y a ${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }

  return (
    <AuthLayout>
      <Head title={`Offres d'emploi - ${appName}`} />

      {/* === LOADER GLOBAL === */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <div className="flex flex-row items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <span className="text-white font-bold text-sm">hire</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{appName}</span>
              <span className="w-2 h-2 block rounded-full bg-amber-400"></span>
            </div>
            <span className="text-lg font-medium text-gray-700">Chargement...</span>
          </div>
        </div>
      )}

      {/* === FLASH MESSAGES === */}
      {flash?.message && (
        <div className="bg-green-100 text-green-800 p-3 text-center text-sm">{flash.message}</div>
      )}
      {flash?.error && (
        <div className="bg-red-100 text-red-800 p-3 text-center text-sm">{flash.error}</div>
      )}

      {/* === HEADER === */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <span className="text-white font-bold text-sm">hire</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{appName}</span>
              <span className="w-2 h-2 block rounded-full bg-amber-400"></span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/jobs" className="text-green-600 border-b-2 border-green-600 pb-1">
                Trouver un job
              </Link>
              <Link href="/talent" className="hover:text-gray-900">
                Trouver un talent
              </Link>
              <Link href="/jobs/create" className="hover:text-gray-900">
                Publier une offre
              </Link>
              <Link href="/about" className="hover:text-gray-900">
                À propos
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-linear-to-br from-orange-400 to-pink-500 text-white text-xs">
                        {user.firstname.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-linear-to-br from-orange-400 to-pink-500 text-white">
                          {user.firstname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstname}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          En ligne
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        Profil
                      </Link>
                      <Link
                        href="/applications"
                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        Mes candidatures
                      </Link>
                      <Link
                        href="/notifications"
                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        Notifications
                      </Link>
                      {(userRoles.includes('COMPANY_ADMIN') || userRoles.includes('RECRUITER')) && (
                        <Link
                          href="/company"
                          className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                        >
                          Mon entreprise
                        </Link>
                      )}
                    </div>
                    <Separator />
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.visit('/login')}>
                  Connexion
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  S’inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* === HERO === */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Trouvez l’emploi de vos rêves</h1>
              <p className="text-gray-600 mt-2">
                Vous cherchez un emploi ? Parcourez nos dernières offres pour postuler aux meilleurs
                jobs dès aujourd’hui !
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="relative w-48 h-32">
                <div className="absolute top-0 right-0 w-20 h-16 bg-green-600 rounded-lg transform rotate-12"></div>
                <div className="absolute bottom-0 left-0 w-24 h-20 bg-black rounded-lg transform -rotate-6"></div>
                <div className="absolute bottom-8 right-8 w-16 h-12 bg-yellow-400 rounded-lg transform rotate-3"></div>
              </div>
            </div>
          </div>

          {/* === SEARCH BAR === */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex-1 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Intitulé ou mot-clé"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <div className="hidden md:flex flex-1 items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pays ou fuseau horaire"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8">
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* === SIDEBAR === */}
          <aside className="w-80 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filtres</h3>
                <button className="text-sm text-red-600 hover:underline">Effacer tout</button>
              </div>

              {/* Date Post */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Tout moment</option>
                  <option>Dernières 24 heures</option>
                  <option>Derniers 7 jours</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d’emploi
                </label>
                <div className="space-y-2">
                  {['Temps plein', 'Stage', 'Freelance', 'Bénévolat'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-green-600" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plage salariale
                </label>
                <div className="space-y-2">
                  {['Moins de 1000€', '1000€ à 2500€', '2500€ à 5000€', 'Personnalisé'].map(
                    (range) => (
                      <label key={range} className="flex items-center gap-2">
                        <input type="radio" name="salary" className="text-green-600" />
                        <span className="text-sm text-gray-700">{range}</span>
                      </label>
                    )
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 500€</span>
                    <span>2 500€</span>
                  </div>
                </div>
              </div>

              {/* On-site/Remote */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sur site/À distance
                </label>
                <div className="space-y-2">
                  {['Sur site', 'Hybride', 'À distance'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-green-600" />
                      <span className="text-sm text-gray-700">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Function */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                <div className="space-y-2">
                  {['Relations publiques', 'Gestion', 'Freelance', 'Finance'].map((func) => (
                    <label key={func} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-green-600" />
                      <span className="text-sm text-gray-700">{func}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* === JOB LISTINGS === */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {meta.total} résultat{meta.total > 1 ? 's' : ''}
              </h2>
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {offers.map((job) => {
                const hasMatch = canApply(job.skills.map((s) => s.id))
                return (
                  <Sheet key={job.id}>
                    <SheetTrigger asChild>
                      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {job.company.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4" />
                                  {job.company.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-700 text-xs"
                                >
                                  {job.contract_type}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-pink-100 text-pink-700 text-xs"
                                >
                                  Recrutement urgent
                                </Badge>
                                {/* {job.is_urgent && (
                                )} */}
                              </div>
                              {/* {formatSalary(job.salary_min, job.salary_max) && (
                                <p className="text-sm font-medium text-gray-900 mt-2 flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {formatSalary(job.salary_min, job.salary_max)}
                                </p>
                              )}
                              <ul className="mt-3 space-y-1">
                                {job.description_bullets.slice(0, 2).map((bullet, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {bullet}
                                  </li>
                                ))}
                              </ul> */}
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 mt-1">
                              <Clock className="w-4 h-4" />
                              <span>Publié {timeAgo(job.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetTrigger>

                    {/* === DRAWER 60% ÉCRAN (SIDEBAR STYLE) === */}
                    <SheetContent
                      side="right"
                      className="w-full p-8 overflow-y-auto bg-gray-50 border-l border-gray-200"
                    >
                      <div>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                            {job.company.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                            <p className="text-gray-600">{job.company.name}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span>{job.contract_type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{job.location}</span>
                          </div>
                          {/* {formatSalary(job.salary_min, job.salary_max) && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                            </div>
                          )} */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>Publié {timeAgo(job.created_at)}</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-900 mb-3">Description du poste</h3>
                          {/* <ul className="space-y-2">
                            {job.description_bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-600 mt-0.5">•</span>
                                {bullet}
                              </li>
                            ))}
                          </ul> */}
                        </div>

                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-900 mb-3">Compétences requises</h3>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill.id} variant="outline" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button variant="outline" asChild>
                            <Link href={`/jobs/${job.id}`}>Voir les détails</Link>
                          </Button>
                          {isLoggedIn && hasMatch && (
                            <Button
                              onClick={() => handleApply(job.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Postuler maintenant <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                          {isLoggedIn && !hasMatch && (
                            <Button disabled variant="secondary">
                              Compétences non correspondantes
                            </Button>
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    </AuthLayout>
  )
}
