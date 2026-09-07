import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
import { myProfile } from '../../api/getMyProfile.api'
import { useQuery } from '@tanstack/react-query'
import { FiHome, FiLogIn, FiLogOut, FiMenu, FiSettings, FiUser, FiUserPlus, FiX } from 'react-icons/fi'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { userLogin, setuserLogin } = useContext(UserContext)
  const navigate = useNavigate()
  const SignOut = () => {
    localStorage.removeItem("userToken")
    setuserLogin(null)
    navigate('/login')
  }
  const { data: user1 } = useQuery({
    queryKey: ['myProfile'],
    queryFn: myProfile,
    select: (user1) => user1?.data?.data?.user
  })
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={'/home'} className="group flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-bold text-white shadow-sm shadow-sky-200 transition group-hover:bg-sky-600">
            S
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">Socail<span className="text-sky-500"> App</span></span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {userLogin != null && <Link to="/home" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-sky-50 hover:text-sky-600">
            <FiHome size={17} /> Home
          </Link>}
          {userLogin == null ? <div className="flex items-center gap-3">
            <Link to="/login" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              <FiLogIn size={17} /> Login
            </Link>
            <Link to="/" className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600">
              <FiUserPlus size={17} /> Register
            </Link>
          </div> : <div className="dropdown dropdown-end">
            <button tabIndex={0} type="button" aria-label="Open account menu" className="flex items-center gap-3 rounded-full  bg-white py-1.5 pl-1.5 pr-3 transition cursor-pointer">
              <span className="h-9 w-9 overflow-hidden rounded-full bg-sky-100 ring-2 ring-sky-100">
                <img alt={user1?.name || 'Profile'} src={user1?.photo} className="h-full w-full object-cover" />
              </span>
            </button>
            <ul tabIndex="-1" className="menu menu-sm dropdown-content z-1 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/70">
              <li><Link to={'/profile'} className="gap-3 rounded-xl py-3 text-slate-600 hover:bg-sky-50 hover:text-sky-600"><FiUser size={17} /> Profile</Link></li>
              <li><Link to={'/settings'} className="gap-3 rounded-xl py-3 text-slate-600 hover:bg-sky-50 hover:text-sky-600"><FiSettings size={17} /> Settings</Link></li>
              <li><button onClick={SignOut} className="gap-3 rounded-xl py-3 text-red-500 hover:bg-red-50"><FiLogOut size={17} /> Logout</button></li>
            </ul>
          </div>}
        </div>

        <button type="button" aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setIsMenuOpen((open) => !open)} className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 md:hidden">
          {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {isMenuOpen && <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-2">
          {userLogin != null && <>
            <Link to="/home" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600"><FiHome size={18} /> Home</Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600"><FiUser size={18} /> Profile</Link>
            <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600"><FiSettings size={18} /> Settings</Link>
            <button onClick={() => { setIsMenuOpen(false); SignOut() }} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"><FiLogOut size={18} /> Logout</button>
          </>}
          {userLogin == null && <>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"><FiLogIn size={18} /> Login</Link>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white"><FiUserPlus size={18} /> Register</Link>
          </>}
        </div>
      </div>}
    </header>
  )
}
