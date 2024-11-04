import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const ProtectedRoutes = ({children}) => {
    const {user}= useSelector(store=>store.auth);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!user){
            navigate('/login');
        }
    },[])

  return (<>
  <Header/>
  {children}</>)
}

export default ProtectedRoutes
