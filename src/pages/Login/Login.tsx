import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from 'src/apis/auth.api'
import { rules } from 'src/others/rules'
import { isAxiosUnprocessableEntityError } from 'src/others/ultis'
import { ErrorResponse } from 'src/types/ultis.type'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from 'src/contextsAPI/contextAPI'

interface FormData {
  email: string
  password: string
  confirm_password: string
}
export default function Login() {
  const nav = useNavigate()
  const {setIsAuthenticated} = useContext(AppContext)
  const { register, handleSubmit, setError, watch, formState: { errors }} = useForm<FormData>()

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => login(body)
  })
  const onSubmit = handleSubmit( (data) => {
    const body = omit(data, ['confirm_password'])
    loginAccountMutation.mutate(body, {
      onSuccess: () => {
        setIsAuthenticated(true)
        nav('/')
        toast.success('Đăng Nhập Thành Công')
      },
      onError: error => {
        if(isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)){
          const formError = error.response?.data.data
          if(formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Sever'
            })
          } 
          if(formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Sever'
            })
          } 
        }
      }
    })
  })

  const value = watch()
  console.log(value);

  return (
    <div className="bg-orange">
      <div className="max-w-6xl mx-auto px-4 w-[100%]">
          <div className="bg-[url('https://cf.shopee.vn/file/0b9a0fd62e7de74a93f48c7c234b0009')] bg-no-repeat bg-cover">
            <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
              <div className="lg:col-span-2 lg:col-start-4">
                <form className="p-7 rounded bg-white shadow-sm" onSubmit={onSubmit} noValidate>
                  <div className="text-xl">Đăng Nhập</div>
                  <div className="mt-6">
                    <input type="email" className={`p-3 w-full outline-none border  ${errors.email?.message ? 'bg-red-100 border-red-600 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}  rounded-sm focus:shadow-sm text-sm`} placeholder='Email'
                    {...register('email', rules.email)}
                    />
                    <div className="mt-1 text-red-600 min-h-[1rem] text-[13px] ml-2">{errors.email?.message}</div>
                  </div>
                  <div className="mt-3">
                    <input type="password" className={`p-3 w-full outline-none border ${errors.password?.message ? 'bg-red-100 border-red-600 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'} rounded-sm focus:shadow-sm text-sm`} placeholder='Password'
                    {...register('password', rules.password)}
                    autoComplete='on'/>
                    <div className="mt-1 text-red-600 min-h-[1rem] text-[13px] ml-2">{errors.password?.message}</div>
                  </div>
                  <div className="mt-3">
                    <button type='submit' className="w-full text-center py-3 px-2 uppercase bg-[#ee4d2d] text-white text-sm  hover:shadow-[0 1px 1px rgb(0 0 0 / 9%)] hover:opacity-90">
                      Đăng Nhập
                    </button>
                  </div>
                  <div className="mt-5 text-center">
                    <div className="flex items-center justify-center text-sm">
                      <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                      <Link className='ml-2 text-[#ee4d2d]' to='/register'>Đăng ký</Link>
                    </div>
                </div>
                </form>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
