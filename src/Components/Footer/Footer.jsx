import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-xl font-bold text-white shadow-sm shadow-sky-200">
            S
          </div>
          <div>
            <p className="font-bold tracking-tight text-slate-900">Socail<span className="text-sky-500"> App</span></p>
            <p className="mt-1 text-xs text-slate-400">Stay connected. Share what matters.</p>
          </div>
        </div>

        <p className="text-sm text-slate-400 md:order-last">© {new Date().getFullYear()} Socail App. All rights reserved.</p>

        <nav aria-label="Social links" className="flex items-center gap-2">
          <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-500 hover:text-white">
            <FaTwitter size={15} />
          </a>
          <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-500 hover:text-white">
            <FaYoutube size={15} />
          </a>
          <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-500 hover:text-white">
            <FaFacebookF size={15} />
          </a>
        </nav>
      </div>
    </footer>
  )
}
