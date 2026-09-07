import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiCheck, FiEye, FiEyeOff, FiLock, FiShield } from 'react-icons/fi'
import { toast } from 'sonner'

export default function ChangePassword() {
    const [showPasswords, setShowPasswords] = useState(false)
    const form = useForm({
        defaultValues: {
            password: '',
            newPassword: ''
        }
    })
    const { register, handleSubmit,reset } = form
    function changePass(body){
        return axios.patch(`https://route-posts.routemisr.com/users/change-password`,body,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }
    const {mutate} = useMutation({
        mutationFn:changePass,
        onSuccess:()=>{
            toast.success('Password Changed successfully!')
            reset()
        }
    })
    function hanldeChangePass(values){
        mutate(values)
    }
    return (
        <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">
                        Account settings
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Change password
                    </h1>
                    <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                        Keep your account secure with a strong password you do not use anywhere else.
                    </p>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-start gap-4 border-b border-slate-100 bg-sky-50/70 px-6 py-5 sm:px-8">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                            <FiShield size={22} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900">Protect your account</h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Your password should be at least 8 characters long and include a mix of letters and numbers.
                            </p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(hanldeChangePass)}>
                        <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Current password</span>
                                <div className="relative">
                                    <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input {...register('password')}
                                        type={showPasswords ? 'text' : 'password'}
                                        placeholder="Enter your current password"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                    />
                                </div>
                            </label>

                            <div>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">New password</span>
                                    <div className="relative">
                                        <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input {...register('newPassword')}
                                            type={showPasswords ? 'text' : 'password'}
                                            placeholder="Create a new password"
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                                        />
                                    </div>
                                </label>

                            </div>

                            <div className="rounded-xl bg-slate-50 px-4 py-4">
                                <p className="mb-3 text-sm font-semibold text-slate-700">Password requirements</p>
                                <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                                    <p className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> At least 8 characters</p>
                                    <p className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> One uppercase letter</p>
                                    <p className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> One lowercase letter</p>
                                    <p className="flex items-center gap-2"><FiCheck className="text-emerald-500" /> One number or symbol</p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords((visible) => !visible)}
                                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                                >
                                    {showPasswords ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                                    {showPasswords ? 'Hide passwords' : 'Show passwords'}
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-500 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-100"
                                >
                                    Update password
                                </button>
                            </div>
                        </div>
                    </form>

                </section>
            </div>
        </main>
    )
}
