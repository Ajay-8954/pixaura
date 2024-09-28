import React from 'react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { useSelector } from 'react-redux'

const MainLayout = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user){
        navigate("/login");
    }
},[])
  return (
    <>
    <LeftSidebar/>
    <div>
        <Outlet/>
    </div>
    </>
  )
}

export default MainLayout