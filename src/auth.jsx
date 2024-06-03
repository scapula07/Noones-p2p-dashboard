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
import { tokenState } from './recoil';
import { useRecoilState } from 'recoil';

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
               getAccessToken()
            //    toast.dismiss();
               localStorage.clear();
               localStorage.setItem('noone',JSON.stringify(docSnap.data()));
               setLoad(false)
               navigate(`/trades`)

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


  return (
    <div className='w-full h-screen flex justify-center items-center'>
              
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

             <Toaster />

    </div>
  )
}
