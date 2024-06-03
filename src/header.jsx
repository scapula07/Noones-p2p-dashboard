import React ,{useState,useEffect} from 'react'
import { IoIosArrowDropleft, IoIosArrowDropright} from "react-icons/io";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut} from "firebase/auth";
import { doc,getDoc,setDoc,updateDoc,deleteDoc,collection,addDoc,query,onSnapshot,where,orderBy }  from "firebase/firestore";
import {  onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useRecoilState,useRecoilValue } from 'recoil';
import { tokenState,userState } from './recoil';
import { MdDashboard } from "react-icons/md";
import { Link } from 'react-router-dom';

const firebaseConfig = {
    apiKey: "AIzaSyCIFa1gbo2BWLuHAo3Oozozyt5jK_UShVY",
    authDomain: "devspage-a55cf.firebaseapp.com",
    projectId: "devspage-a55cf",
    storageBucket: "devspage-a55cf.appspot.com",
    messagingSenderId: "91329266555",
    appId: "1:91329266555:web:72941933425ad1b71ef3de",
    measurementId: "G-C2NVHD34Y1"
  };
  
  
     const app = initializeApp(firebaseConfig);
     const auth =getAuth(app)
     const db=getFirestore()

     const baseUrl="https://noones-be-1.onrender.com"



export default function Header({}) {
    
     let navigate = useNavigate();

     const [balance,setbalance]=useState(false)
     const token=useRecoilValue(tokenState)
     const user=useRecoilValue(userState)

     const getActiveTrades=async()=>{
      
      try{
              axios.post(`${baseUrl}/api/v1/user`,{
                token:token,
                },{
                headers: {
                    'Content-Type': 'application/json'
                  }
                })
            .then(response => {
                console.log('balance', response.data?.data?.data               );
              
                if(Number(response.data?.data?.data?.preferredFiatCurrency?.balance) <300){
                     setbalance("Low")
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Something went wrong!');
                toast.dismiss();
  
            });
  
          
         }catch(e){
        console.log(e)
       }

       
  }

  useEffect(()=>{
    token?.length >0&&getActiveTrades()
  },[token?.length])
 

  const logout=async()=>{
  
  
    
     try{
        const response=await signOut(auth)
        localStorage.clear();
        navigate(`/`)

   
     }catch(e){
         console.log(e)

     }
     
  }

  return (
    <div className='flex items-center w-full justify-between'>
           <div className='flex space-x-10'>
               <button className='border-yellow-500 px-4 py-1 border text-sm font-light' onClick={logout}>Log out</button>

              {balance=="Low"&&

               <h5 className='text-lg font-light space-x-4  '>
                    Balance is

                  <span className={balance==="Low"?"text-red-500":"text-green-500"}> {balance}</span>
               </h5>
}

           </div>
           {user?.role !="user"&&user?.id !=0&&

           
           <Link to='/admin'>
               <MdDashboard className='text-3xl font-semibold text-yellow-600'/>
           </Link>
}
      
           <Toaster />
    

    </div>
  )
}
