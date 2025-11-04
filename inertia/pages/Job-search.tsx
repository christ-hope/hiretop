// resources/js/Pages/Talent/JobSearch.tsx
import { Head, Link, usePage } from '@inertiajs/react'
import AuthLayout from '../layouts/authLayout'
import { Search, MapPin, Clock, Filter, Bell } from 'lucide-react'
import { useState } from 'react'

interface Job {
  id: number
  title: string
  company: string
  logo: string
  type: string
  salary?: string
  location: string
  posted: string
  urgent: boolean
  bullets: string[]
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Product Designer',
    company: 'Gojek',
    logo: 'gojek',
    type: 'Full-time',
    location: 'Marina East, Singapore',
    posted: '5 mins ago',
    urgent: true,
    bullets: [
      'Within this role, you will be creating content for a wide range of local and international clients',
      'This role is suited to Bali based creatives looking to work in-house.',
    ],
  },
  {
    id: 2,
    title: 'Copywriting Specialist',
    company: 'Odama Studio',
    logo: 'odama',
    type: 'Freelance',
    salary: '$1,600–$1,800 USD',
    location: 'Paris, France',
    posted: '3 days ago',
    urgent: false,
    bullets: [
      'Collaborate with the marketing team to optimize conversion',
      'Develop inspiring, persuasive, and convincing copy for a wide array of writing needs',
    ],
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'Twitter',
    logo: 'twitter',
    type: 'Full-time',
    salary: '$100–$2,000 USD',
    location: 'Malaga, Spain',
    posted: '3 days ago',
    urgent: false,
    bullets: [
      'Responsible for designing, planning, and testing of any projects/products',
      'Building effective and reusable modules that will enhance user experience in each projects/products',
    ],
  },
]

export default function JobSearch() {
  const { auth } = usePage().props as any

  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')

  return (
    <AuthLayout>
      <Head title="Find Jobs - Jobelia" />

      {/* === HEADER === */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                Jo
              </div>
              <span className="text-xl font-bold text-gray-900">Jobelia</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/jobs" className="text-green-600 border-b-2 border-green-600 pb-1">
                Find Jobs
              </Link>
              <Link href="/talent" className="hover:text-gray-900">
                Find Talent
              </Link>
              <Link href="/upload" className="hover:text-gray-900">
                Upload Job
              </Link>
              <Link href="/about" className="hover:text-gray-900">
                About Us
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-orange-500 rounded-full" />
          </div>
        </div>
      </header>

      {/* === HERO === */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Find your dream job</h1>
          <p className="text-gray-600 mb-8">
            Looking for jobs? Browse our latest job openings to view & apply to the best jobs today!
          </p>

          {/* === SEARCH BAR === */}
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search job title or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <div className="hidden md:flex flex-1 items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Country or timezone"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <button className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition">
              Find Jobs
            </button>
          </div>
        </div>
      </section>

      {/* === MAIN CONTENT === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* === SIDEBAR FILTERS === */}
          <aside className="w-80 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filter</h3>
                <button className="text-sm text-red-600 hover:underline">Clear all</button>
              </div>

              {/* Date Post */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Post</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                  <option>Anytime</option>
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job type</label>
                <div className="space-y-2">
                  {['Full-time', 'Internship', 'Freelance', 'Volunteer'].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Range Salary</label>
                <div className="space-y-2">
                  {['Under $1000', '$1000 to $2500', '$2500 to $5000', 'Custom'].map((range) => (
                    <label key={range} className="flex items-center gap-2">
                      <input type="radio" name="salary" className="text-green-600 focus:ring-green-500" />
                      <span className="text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$1,500</span>
                    <span>$2,500</span>
                  </div>
                </div>
              </div>

              {/* On-site/Remote */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">On-site/remote</label>
                <div className="space-y-2">
                  {['On-site', 'Hybrid', 'Remote'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                      <span className="text-sm text-gray-700">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Function */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job function</label>
                <div className="space-y-2">
                  {['Public Relations', 'Management', 'Freelance', 'Finance'].map((func) => (
                    <label key={func} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
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
              <h2 className="text-lg font-semibold text-gray-900">250 Jobs results</h2>
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {job.logo[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>{job.company}</span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {job.type}
                          </span>
                          {job.urgent && (
                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                              Urgently hiring
                            </span>
                          )}
                        </div>
                        {job.salary && <p className="text-sm font-medium text-gray-900 mt-2">{job.salary}</p>}
                        <ul className="mt-3 space-y-1">
                          {job.bullets.map((bullet, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>Posted {job.posted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </AuthLayout>
  )
}
