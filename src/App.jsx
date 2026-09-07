import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout';
import Register from './Auth/Register/Register';
import Home from './Components/Home/Home';
import Login from './Auth/Login/Login';
import { Toaster } from 'sonner'
import UserContextProvider, { UserContext } from './Context/UserContext'
import Profile from './Components/Profile/Profile'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import AuthRoute from './Components/AuthRoute/AuthRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './Components/PostDetails/PostDetails'
import { useNetworkState } from 'react-use';
import { divWrapper } from './../node_modules/react-universal-interface/src/createEnhancer';
import { MdOutlineWifiOff } from 'react-icons/md';
import Settings from './Components/Settings/Settings';
const query = new QueryClient()
let router = createBrowserRouter([{
  path: "", element: <Layout />, children: [
    { index: true, element: <AuthRoute><Register /></AuthRoute> },
    { path: "login", element: <AuthRoute><Login /></AuthRoute> },
    { path: "home", element: <ProtectedRoute><Home /></ProtectedRoute> },
    { path: "postDetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
    { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
    { path: "settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
  ]
}])
function App() {
  const [count, setCount] = useState(0)
  const { online } = useNetworkState()
  return (
    <>
      {!online && <div className='absolute bg-warning font-semibold z-10 border-2 border-gray-100  w-fit rounded-xl bottom-2 right-2  p-4'>
        <h1 className='flex items-center gap-3 text-xl'><MdOutlineWifiOff /> you are offline😢!</h1>
        </div>}
      <QueryClientProvider client={query}>
        <UserContextProvider>
          <Toaster position="top-right" richColors />
          <RouterProvider router={router}></RouterProvider>
        </UserContextProvider>

      </QueryClientProvider>
    </>
  )
}

export default App
