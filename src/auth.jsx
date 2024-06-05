import React ,{useState} from 'react'
import { ClipLoader } from 'react-spinners'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut} from "firebase/auth";
import { doc,getDoc,setDoc,updateDoc,deleteDoc,collection,addDoc,query,onSnapshot,where,orderBy }  from "firebase/firestore";
import {  onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { tokenState ,userState} from './recoil';
import { useRecoilState } from 'recoil';
import { MdOutlineRefresh } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";

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
export default function Auth() {
    const [cred,setCreds]=useState({})
    const [load,setLoad]=useState(false)
    const [token,setToken]=useRecoilState(tokenState)
    const [otp,setOtp]=useState()
    const [pin,setPin]=useState("")
    const [trigger,setTrigger]=useState(false)
    const [user,setUser]=useState({})


    let navigate = useNavigate();

    const getAccessToken=async()=>{

      try{
           
             axios.get(`${baseUrl}/api/v1/get-token`,{
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
                 }
               })
           .then(response => {
               console.log('Access Token:', response.data?.data?.access_token);
               setToken(response.data?.data?.access_token)
           
            //    toast.dismiss();
           })
           .catch(error => {
               console.error('Error:', error);
               
               toast.error('Try again,something went wrong!',{duration:3000});
               // setTrigger(false)
            //    toast.dismiss();
           });
        //    toast.dismiss();
    
       }catch(e){
          console.log(e)
        //   toast.dismiss();
       }

       
  }


const login=async()=>{
        // toast.loading('Logging in');
        setLoad(true)
    try{
      const response = await signInWithEmailAndPassword(auth,cred?.email,cred?.password)
      console.log(response,"resss")
      const ref =doc(db,"users",response?.user?.uid)
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
              setUser({...docSnap.data(),id:docSnap?.id})
              const otp = Math.floor(10000 + Math.random() * 90000);
              console.log(otp)
              setOtp(otp)
              setTrigger(true)
            

          } else {
            // setTrigger("not_triggered")
            throw new Error("You are not signed up")
              console.log("No such document!");
              
          }
      

       }catch(e){
        setLoad(false)
          console.log(e)
          toast.error(e?.message,{duration:3000});
        //   setTrigger(false)
      }
      setLoad(false)
   

}


const submit=async()=>{

  setLoad(true)
try{
  if (otp===Number(pin)) {
     
         getAccessToken()
         localStorage.clear();
         localStorage.setItem('noone',JSON.stringify(user));
         setLoad(false)
         navigate(`/trades`)

    } else {
      setLoad(false)
      setPin("")
      throw new Error("Wrong pin,Refresh")
    
        
    }


 }catch(e){
     setLoad(false)
    console.log(e)
    toast.error(e?.message,{duration:3000});
}
setLoad(false)


}




  return (
    <div className='w-full h-screen flex justify-center items-center'>

             {!trigger?

             
              
               <div className=' space-y-8 w-1/3 flex flex-col items-center py-8 '>
                                 <h5 className='font-semibold'>Dashboard</h5>

                              <div className='flex flex-col space-y-4 w-full px-4'>
                                    <input 
                                      placeholder='Email'
                                      className='rounded-lg border w-full py-2 text-sm px-2'
                                      onChange={(e)=>setCreds({...cred,email:e.target.value})}
                                    />
                                    <input 
                                      placeholder='Password'
                                      className='rounded-lg border w-full py-2 text-sm px-2'
                                      type={"password"}
                                      onChange={(e)=>setCreds({...cred,password:e.target.value})}
                                    />

                              </div>
                             
                                          
                               {load?
                                 <ClipLoader color='brown' size={10}/>
                                 :
                                 <button className='bg-yellow-400 text-sm py-2 px-10 rounded-sm w-full'   onClick={login}>
                                 Login
                           </button>

                               }
                          
                             
                     </div>
                      :

                 <div className=' space-y-8 w-1/6 flex flex-col items-center py-8 '>
                      <h5 className='font-semibold text-sm'>OTP was sent to your email</h5>

                   <div className='flex flex-col space-y-4 w-full px-4'>
                         <input 
                           placeholder='Enter 4 digits code'
                           className='rounded-lg border w-full py-2 text-sm px-2'
                           value={pin}
                           onChange={(e)=>setPin(e.target.value)}
                         />
                        

                   </div>
                  
                               
                    {load?
                      <ClipLoader color='brown' size={10}/>
                      :
                      <button className='bg-yellow-400 text-sm py-2 px-10 rounded-sm w-full'   onClick={submit}>
                         Submit
                       </button>

                    }

                    <div className='flex items-center space-x-0.5 hover:text-yellow-500'>
                          <MdOutlineRefresh className='text-lg font-semibold'/>
                          <h5 className='text-sm font-semibold'>Regenerate</h5>
                       
                    </div>
                    <div className='flex items-center text-yellow-500 font-bold text-xs' >
                       <IoIosArrowBack onClick={()=>setTrigger(false)} />
                       <h5 onClick={()=>setTrigger(false)}>Back</h5>

                    </div>


               
                  
               </div>

                              }

             <Toaster />

    </div>
  )
}
