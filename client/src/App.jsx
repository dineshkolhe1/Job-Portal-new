import React, { useContext } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import RecruiterLogin from './component/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJob from './pages/ManageJob'
import ViewApplication from './pages/ViewApplication'
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const App = () => {

  const {showRecruiterLogin, companyToken} = useContext(AppContext)

  return (
    <div>
      { showRecruiterLogin && <RecruiterLogin/>}
      <ToastContainer/>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/apply-job/:id' element= {<ApplyJob/>}/>
        <Route path='/application' element= {<Application/>}/>
        <Route path='/dashboard' element={<Dashboard/>}>
        {companyToken ? <>
          <Route path='add-job' element={<AddJob/>}/>
          <Route path='manage-job' element={<ManageJob/>}/>
          <Route path='view-application' element={<ViewApplication/>}/>
        </> : null
        }
          

        </Route>
      </Routes>
    </div>
  )
}

export default App
