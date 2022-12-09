import {useContext} from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Profile from './components/Profile'
import { AppContext } from './contextsAPI/contextAPI'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Register from './pages/Register'

function ProtectRoute(){
  const {isAuthenticated} = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login'/>
}
function RejectRoute(){
  const {isAuthenticated} = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/'/>
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectRoute />,
      children: [
        {
          path: '/login',
          element:
            <RegisterLayout>
              <Login />
            </RegisterLayout> 
        },
        {
          path: '/register',
          element:
            <RegisterLayout>
              <Register />
            </RegisterLayout> 
        }
      ]
    },  
    {
      path: '',
      element: <ProtectRoute />,
      children: [
        {
          path: '/profile',
          element:
            <MainLayout>
              <Profile />
            </MainLayout>
        }
      ]
    },  
    {
      path: '',
      index: true,
      element: 
        <MainLayout>
          <ProductList />
        </MainLayout>
    }
  ])
  return routeElements
}
