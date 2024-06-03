import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes,Route,BrowserRouter as Router } from "react-router-dom"
import Auth from './auth'
import TradeTable from './trades'
import Chat from './chat'
import Admin from './admin'
import { useRecoilState } from 'recoil'
import { tokenState ,userState} from './recoil'
import { useNavigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut} from "firebase/auth";
import { doc,getDoc,setDoc,updateDoc,deleteDoc,collection,addDoc,query,onSnapshot,where,orderBy }  from "firebase/firestore";
import {  onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';




const baseUrl="https://noones-be-1.onrender.com"
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



function App() {
  const [count, setCount] = useState(0)
  const [token,setToken]=useRecoilState(tokenState)
  const [user,setUser]=useRecoilState(userState)
  let navigate = useNavigate();

  const userNoone = localStorage.getItem("noone");
     useEffect( ()=>{ 
        if(JSON.parse(userNoone)?.id?.length >0){
          const unsub = onSnapshot(doc(db,"users",JSON.parse(userNoone)?.id), (doc) => {
            
            setUser({...doc.data(),id:doc?.id})
            if(doc?.id?.length !=undefined){
             
               getAccessToken()
            
            }else{
                localStorage.clear();

               
                toast.error("You are not signed up",{duration:3000})
                navigate("/")
            }

          });

        
          }else{
            const userLogged = localStorage.getItem("noone");
            setUser(JSON.parse(userLogged ))
          }

    },[userNoone])


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

  return (
    <>
               <Routes>
                     <Route exact path="/"  element={<Auth/>} />
                     <Route exact path="/trades"  element={<TradeTable/>} />
                     <Route exact path="/chat"  element={<Chat/>} />
                     <Route exact path="/admin"  element={<Admin/>} />
              </Routes>
  
    </>
  )
}

export default App
