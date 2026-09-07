import { useContext, useState } from 'react'
import { Input, Button } from '@heroui/react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ErrorMessage from '../../Components/ErrorMessage/ErrorMessage'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { ImSpinner4 } from 'react-icons/im'
import { UserContext } from '../../Context/UserContext'
export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  let {setuserLogin} = useContext(UserContext)
  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Invalid password: Must be at least 8 characters and include uppercase, lowercase, numbers, and special characters."),
  })
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: 'all'
  })
  let { register, handleSubmit, formState } = form
  const navigate = useNavigate()
  async function handleRegister(values) {
    // console.log(values);
    try {
      setisLoading(true)
      let { data } = await axios.post(`https://route-posts.routemisr.com/users/signin`, values)
      console.log(data);
      console.log(data.message);
      console.log(data.data.token);
      localStorage.setItem("userToken", data.data.token)
      setuserLogin(data.data.token)
      
      toast.success(data.message)
      setTimeout(() => {
        navigate('/home')
      }, 500);

    } catch (error) {
      toast.error(error.response.data.errors)
    } finally {
      setisLoading(false)
    }
  }
  return (
    <main className="min-h-screen  bg-slate-50 px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid w-full max-w-5xl mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-sky-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-32 border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-42 border-white/10" />
          <div className="relative">
            <p className="text-lg font-bold tracking-tight">Socail App</p>
            <div className="mt-20 max-w-xs">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Your community awaits</p>
              <h1 className="text-4xl font-bold leading-tight">Stay connected to the people who matter.</h1>
              <p className="mt-5 text-sm leading-7 text-sky-50">Share your moments, discover new conversations, and keep your world close.</p>
            </div>
          </div>
          <p className="relative text-xs text-sky-100">A simpler way to stay social.</p>
        </aside>

        <section className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-sky-500">Welcome back</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Enter your details to continue where you left off.</p>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <Input {...register('email')} type="email" className="w-full" placeholder="you@example.com" />
              <ErrorMessage error={formState.errors.email} />
            </div>

            {/* Password */}
            <div className='relative'>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <Input {...register('password')} type={showPass ? "text" : "password"} className="w-full" placeholder="••••••••" />
              <button type="button" aria-label={showPass ? 'Hide password' : 'Show password'} onClick={() => setShowPass(!showPass)} className='absolute right-3 top-9 z-10 cursor-pointer text-slate-400 transition hover:text-sky-500'> {showPass ? <FaEye /> : <FaEyeSlash />} </button>
              <ErrorMessage error={formState.errors.password} />
            </div>


            {/* Submit Button */}
            <div className='mt-2'>
              <Button isDisabled={isLoading} type="submit" className="w-full rounded-xl bg-sky-500 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-sky-600 hover:shadow-md">
                {isLoading ? <ImSpinner4 className='animate-spin' /> : 'Login'}
              </Button>
              <p className="mt-5 text-center text-sm text-slate-500">Don't have an account? <Link to={'/'} className='font-semibold text-sky-500 transition hover:text-sky-600'>Register now</Link></p>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
