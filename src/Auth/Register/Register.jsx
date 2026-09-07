import { useState } from 'react'
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
export default function Register() {
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(15, "Name cannot exceed 15 characters"),
    username: z.string().min(3, "Name must be at least 3 characters").max(15, "Name cannot exceed 15 characters"),
    email: z.string().email("Invalid email"),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid date").refine((date) => {
      const userDate = new Date(date)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return userDate < now
    }, "Can't enter future date"),
    gender: z.enum(["male", "female"], "Gender must be one of Male or Female"),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Invalid password: Must be at least 8 characters and include uppercase, lowercase, numbers, and special characters."),
    rePassword: z.string(),
  }).refine((object) => object.password === object.rePassword, {
    error: "Make sure your passwords match!",
    path: ["rePassword"]
  })
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: ""
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
      let { data } = await axios.post(`https://route-posts.routemisr.com/users/signup`, values)
      console.log(data);
      console.log(data.message);
      toast.success(data.message)
      setTimeout(() => {
        navigate('/login')
      }, 1500);

    } catch (error) {
      toast.error(error.response.data.errors)
    } finally {
      setisLoading(false)
    }
  }
  return (
    <main className="min-h-[calc(100vh-100px)] bg-slate-50 px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto mt-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="relative hidden overflow-hidden bg-sky-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-32 border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-42 border-white/10" />
          <div className="relative">
            <p className="text-lg font-bold tracking-tight">Socail App</p>
            <div className="mt-20 max-w-xs">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Make it yours</p>
              <h1 className="text-4xl font-bold leading-tight">Your people. Your moments. Your space.</h1>
              <p className="mt-5 text-sm leading-7 text-sky-50">Create your account and start sharing what matters with your community.</p>
            </div>
          </div>
          <p className="relative text-xs text-sky-100">A simpler way to stay social.</p>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-sky-500">Get started</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Join the conversation and connect with your community.</p>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
              <Input {...register('name')} type="text" className="w-full" placeholder="e.g. Eyad Ibrahim" />
              <ErrorMessage error={formState.errors.name} />
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
              <Input {...register('username')} type="text" className="w-full" placeholder="e.g. Eyad_07" />
              <ErrorMessage error={formState.errors.username} />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <Input {...register('email')} type="email" className="w-full" placeholder="you@example.com" />
              <ErrorMessage error={formState.errors.email} />
            </div>

            {/* Date & Gender Row */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Date of birth</label>
                <Input {...register('dateOfBirth')} type="date" className="w-full text-slate-600" />
                <ErrorMessage error={formState.errors.dateOfBirth} />
              </div>

              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Gender</label>
                <fieldset>
                  <select {...register('gender')} defaultValue="Pick a browser" className="select h-12 w-full rounded-xl border-slate-200 bg-white text-sm transition-all hover:bg-slate-50 focus:border-sky-500 focus:outline-none">
                    <option disabled={true}>Pick a gender</option>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                  </select>
                </fieldset>
                <ErrorMessage error={formState.errors.gender} />
              </div>
            </div>

            {/* Password */}
            <div className='relative'>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <Input {...register('password')} type={showPass ? "text" : "password"} className="w-full" placeholder="••••••••" />
              <button type="button" aria-label={showPass ? 'Hide password' : 'Show password'} onClick={() => setShowPass(!showPass)} className='absolute right-3 top-9 z-10 cursor-pointer text-slate-400 transition hover:text-sky-500'> {showPass ? <FaEye /> : <FaEyeSlash />} </button>
              <ErrorMessage error={formState.errors.password} />
            </div>

            {/* Re-Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
              <Input {...register('rePassword')} type="password" className="w-full" placeholder="••••••••" />
              <ErrorMessage error={formState.errors.rePassword} />
            </div>

            {/* Submit Button */}
            <div className='mt-2'>
              <Button isDisabled={isLoading} type="submit" className="w-full rounded-xl bg-sky-500 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-sky-600 hover:shadow-md">
                {isLoading ? <ImSpinner4 className='animate-spin' /> : 'Register'}
              </Button>
              <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to={'/login'} className='font-semibold text-sky-500 transition hover:text-sky-600'>Sign in</Link></p>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
