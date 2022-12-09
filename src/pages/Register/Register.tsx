import {useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { rules } from 'src/others/rules'
import { useMutation } from '@tanstack/react-query'
import { registerAccount } from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/others/ultis'
import { ErrorResponse } from 'src/types/ultis.type'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from 'src/contextsAPI/contextAPI'

interface FormData {
  email: string
  password: string
  confirm_password: string
}

export default function Register() {
  const nav = useNavigate()
  const {setIsAuthenticated} = useContext(AppContext)
  // register: lấy những dữ liệu mà người dùng nhập vào
  const { register, getValues, handleSubmit, setError , formState: { errors }, watch} = useForm<FormData>()
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })
  const onSubmit = handleSubmit( (data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: () => {
        toast.success('Đăng ký thành công')
        setIsAuthenticated(true)
        nav('/')
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

  return (
    <div className="bg-orange">
    <div className="max-w-6xl mx-auto px-4 w-[100%]">
      <div className="bg-[url('https://cf.shopee.vn/file/0b9a0fd62e7de74a93f48c7c234b0009')] bg-no-repeat bg-cover">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-24 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form className="p-7 rounded bg-white shadow-sm" onSubmit={onSubmit} noValidate>
              <div className="text-xl">Đăng Ký</div>
              <div className="mt-6">
                <input type="email" className={`p-3 w-full outline-none border ${errors.email?.message ? 'bg-red-100 border-red-600 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'} rounded-sm focus:shadow-sm text-sm`} placeholder='Email' 
                  {...register('email', rules.email)} 
                />
                <div className="mt-1 text-red-600 min-h-[1.25rem] text-[13px] ml-2">{errors.email?.message}</div>
              </div>
              <div className="mt-2">
                <input type="password" className={`p-3 w-full outline-none border ${errors.password?.message ? 'bg-red-100 border-red-600 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'} rounded-sm focus:shadow-sm text-sm`} placeholder='Password' 
                {...register('password', rules.password)}
                autoComplete='on'
                />
                <div className="mt-1 text-red-600 min-h-[1.25rem] text-[13px] ml-2">{errors.password?.message}</div>
              </div>
              <div className="mt-2">
                <input type="password" className={`p-3 w-full outline-none border ${errors.confirm_password?.message ? 'bg-red-100 border-red-600 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'} rounded-sm focus:shadow-sm text-sm`} placeholder='Confirm Password' 
                {...register('confirm_password', {
                  ...rules.confirm_password, 
                  validate: (value) => value === getValues('password') || 'Password không khớp, vui lòng kiểm tra lại'
                })}
                autoComplete='on'
                />
                <div className="mt-1 text-red-600 min-h-[1rem] text-[13px] ml-2">{errors.confirm_password?.message}</div>
              </div>
              <div className="mt-3">
                <button type='submit' className="w-full text-center py-3 px-2 uppercase bg-[#ee4d2d] text-white text-sm  hover:shadow-[0 1px 1px rgb(0 0 0 / 9%)] hover:opacity-90">
                  Đăng ký
                </button>
              </div>
              <div className="mt-5 text-center">
                <div className="flex items-center justify-center text-sm">
                  <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                  <Link className='ml-2 text-[#ee4d2d]' to='/login'>Đăng Nhập</Link>
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
