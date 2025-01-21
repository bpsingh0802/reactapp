import { useState } from 'react'
import {BrowserRouter} from 'react-router-dom'
import Login from './Components/Login'
import Signup  from './Components/Signup'
import Home from './Components/Home'
import Logout from './Components/Logout'




import { Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/homepage" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
  
    
    </>
  )
}

export default App
