import React ,{useState,useEffect} from 'react'
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

import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from "react-icons/ai";
import Modal from './modal';
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

export default function Admin() {
    const [cred,setCreds]=useState({})
    const [trigger, setTrigger] = useState(false)
    const [load, setLoad] = useState(false)
   


    const addUser=async()=>{
        setLoad(true)
        try{
          
          const credential = await createUserWithEmailAndPassword(auth,cred?.email,cred?.password)
          const user=credential.user
          const ref =doc(db,"users",user?.uid)
          await setDoc(ref,{id:user?.uid,role:"user",email:cred?.email})
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
               setTrigger(false)
               setLoad(false)
              }else{

          }
          toast.dismiss();

        }catch(e){
          console.log(e)
          setLoad(false)
          toast.dismiss();
      }
      
    }
    
  return (
    <>
            
            <div className='w-full flex justify-center h-screen py-10'>
                <div className='w-4/5 space-y-10'>
                    <div className='flex justify-between w-full items-center'>
                                <Link to="/trades">
                                <div className='flex items-center text-yellow-500 font-bold ' >
                                      <IoIosArrowBack onClick={()=>setTrigger(false)} />
                                      <h5 onClick={()=>setTrigger(false)}>Back</h5>

                                    </div>
                                </Link>

                                
                            <button className='bg-yellow-100 rounded-lg px-4 text-sm font-semibold py-2 text-slate-800' onClick={()=>setTrigger(true)}>Add a user</button>


                    </div>

                    <div className='w-full flex flex-col space-y-10'>
                        <Users />
                        <Transactions />

                    </div>

                </div>

            </div>
            <Modal trigger={trigger}  cname="w-1/5 py-2  bg-white  px-4 rounded-lg ">
                        
                        <div className=' space-y-8 w-full flex flex-col items-center py-8 '>
                                <h5 className='font-semibold'>Add a user</h5>

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
                                 <button className='bg-yellow-400 text-sm py-2 px-10 rounded-sm'   onClick={addUser}>
                                 Continue
                                </button>


                              }


                 <div className='flex items-center text-yellow-500 font-bold text-xs' >
                      <IoIosArrowBack onClick={()=>setTrigger(false)} />
                      <h5 onClick={()=>setTrigger(false)}>Back</h5>

                    </div>

                             
                                                

                                


                                


        
                            </div>
                
            </Modal>

    </>
  )
}






const Users=()=>{
    const [users,setUsers]=useState([])
  
  
  
    useEffect(()=>{
    
        const q = query(collection(db, "users"),where('role','==','user'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const products = []
              querySnapshot.forEach((doc) => {
                products.push({ ...doc.data(), id: doc.id })
    
              });
    
        
               setUsers(products)
        });
    
    },[])
      return(
        <>
        <div className='space-y-5'>
                  <h5 className='px-8 ' >Active users({users?.length})</h5>
  
                  <div>
          <table class="table-auto w-full border-separate-4 border-spacing-2">
                  <thead className='py-2 bg-yellow-100'>
                  <tr >
                        {
                          ["ID",
                            "Email",
                          ""
                        
  
                          ].map((text)=>{
                              return(
                              <th className='py-3 text-sm text-slate-800 text-center'>{text}</th>
                          )
                          })
                      }
                           </tr>
                      
                  </thead>
  
                  <tbody className='w-full '>
                      
                      {users?.map((user,index)=>{
                           
                            return(
                            
                                <UserRow
                                   user={user}
                                
                                />
                                
  
                            )
                        })
  
                      }
                   
  
  
                  </tbody>
  
          </table>
  
              </div>
  
        </div>




        </>
      )
  }
  
  
  
  
  
  
  
  
  
  
  
  
  const UserRow=({user})=>{
    const deleteUser=async()=>{
     
      try{
  
        await deleteDoc(doc(db,"users",user?.id));
      
        const userauth = auth.currentUser;
      
       await deleteUser(userauth)
       toast.dismiss()
          
      }catch(e){
        toast.dismiss()
          console.log(e)
      }
    
  }
  
      return(
        <tr className={'border-b py-3 bg-green-100'} >
          
             <td className='text-sm font-light text-slate-500 text-center py-6'>{user?.id}</td>
  
             <td className='text-sm font-light text-slate-500 text-center py-6'>{user?.email}</td>
             <td className='text-sm font-light text-slate-500 text-center py-6' onClick={()=>deleteUser()}>
                <AiOutlineDelete className='text-xl text-red-500'/>
             </td>
          
         </tr>
  
      )
  }
  















const Transactions=()=>{
  const [transactions,setTx]=useState([])



  useEffect(()=>{
  
      const q = query(collection(db, "transactions"),orderBy("createdAt","desc"));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const products = []
            querySnapshot.forEach((doc) => {
              products.push({ ...doc.data(), id: doc.id })
  
            });
  
      
            setTx(products)
      });
  
  },[])

  console.log(transactions,"txxxx")
    return(
      <>
      <div className='space-y-5'>
                <h5 className='px-8 ' >Transactions({transactions?.length})</h5>

                <div>
        <table class="table-auto w-full border-separate-4 border-spacing-2">
                <thead className='py-2 bg-yellow-100'>
                <tr >
                      {
                        ["User",
                          "Trade Hash",
                          "Amount",
                          "Date"
                      

                        ].map((text)=>{
                            return(
                            <th className='py-3 text-sm text-slate-800 text-center'>{text}</th>
                        )
                        })
                    }
                         </tr>
                    
                </thead>

                <tbody className='w-full '>
                    
                    {transactions?.map((tx,index)=>{
                         
                          return(
                          
                              <TxRow
                                 tx={tx}
                              
                              />
                              

                          )
                      })

                    } 
                 


                </tbody>

        </table>

            </div>

      </div>




      </>
    )
}












const TxRow=({tx})=>{
    const milliseconds = tx?.createdAt.seconds * 1000 + tx?.createdAt.nanoseconds / 1000000;

    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);
    
    // Format the date to a readable string
    const readableDate = date.toLocaleString();

    return(
      <tr className={'border-b py-3 bg-green-100'} >
        
           <td className='text-sm font-light text-slate-500 text-center py-6'>{tx?.user}</td>

           <td className='text-sm font-light text-slate-500 text-center py-6'>{tx?.trade_hash}</td>
           <td className='text-sm font-light text-slate-500 text-center py-6' >
            {tx?.fiat_currency_code} {tx?.fiat_amount_requested}
              
           </td>
           <td className='text-sm font-light text-slate-500 text-center py-6' >
            {readableDate}
              
           </td>
        
       </tr>

    )
}
