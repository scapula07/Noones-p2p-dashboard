import React,{useState,useEffect,useRef} from 'react'
import Header from './header'
import { useRecoilState } from 'recoil';
import { tokenState ,userState} from './recoil';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { IoMdDownload } from "react-icons/io";
import Modal from './modal';
import { MdOutlineRefresh } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut} from "firebase/auth";
import { doc,getDoc,setDoc,updateDoc,deleteDoc,collection,addDoc,query,onSnapshot,where,orderBy }  from "firebase/firestore";
import {  onAuthStateChanged } from "firebase/auth";


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
export default function Chat() {
    const [token,setToken]=useRecoilState(tokenState)
    const location =useLocation()
    const [trigger, setTrigger] = useState(false)
    const [load, setLoad] = useState(false)
    

    const trade=location?.state
    console.log(location,"trdade")


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
  return (
    <>
    
  
    <div className='w-full flex justify-center py-10'>
          <div className='w-4/5 space-y-8'>
               <Header />

               <div className='flex w-full space-x-8'>
                         
                           <Details
                                  trade={trade}
                                  token={token}
                                  setTrigger={setTrigger}
                                  setLoad={setLoad}
                                  trigger={trigger}
                                  load={load}
                             />

                          <ChatBox 
                             trade={trade}
                             token={token}
                              
                            />
                  
                      

               </div>


          </div>

    </div>



    </>
  )
}






const Details=({trade,token,setLoad,setTrigger,trigger,load})=>{
  const [isTrigger, setisTrigger] = useState(false)
  const [pin, setPin] = useState("")
  const [otp, setOtp] = useState()
  const [user,setUser]=useRecoilState(userState)

  let navigate = useNavigate();

     
    const release=async()=>{
        
        if(trade?.trade_status != "Paid"){
             toast.error('Trade is not marked as paid',{duration:3000});
    
              return
    
        }

        const otp = Math.floor(10000 + Math.random() * 90000);
        console.log(otp)
        setOtp(otp)
        setisTrigger(true)
  }
  
  
  const submit=async()=>{

              setLoad(true)
            try{
              if (otp===Number(pin)) {
                
                      axios.post(`${baseUrl}/api/v1/release`,{
                        token:token,
                        hash:trade?.trade_hash,

                        },{
                        headers: {
                            'Content-Type': 'application/json'
                          }
                        })
                        .then(async(response )=> {
                            
                            console.log('Trades:', response.data?.data?.status);
                            await addDoc(collection(db, "transactions"),{
           
                              createdAt:new Date(),
                              ...trade,
                              user:user?.email
                              
                            })
                            setTrigger(false)
                            toast.success('Crypto has been released!',{duration:3000});

                            navigate("/trades")
                            
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            setTrigger(false)
                            toast.error("Something went wrong!,Try again",{duration:3000})
                        });
            
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
  
  


  
     return(
        <>
        
     
        <div className='bg-white h-56 rounded-lg shadow-lg w-1/3  '>
              <div className='py-4 border-b '>
                 <h5 className='px-4 text-sm font-semibold'>You are selling {trade?.fiat_amount_requested} {trade?.fiat_currency_code} using {trade?.payment_method_name}</h5>
  
              </div>
  
              <div className='py-4 px-4 space-y-4'>
                   <h5 className={trade?.trade_status !="Active funded"? 'text-sm font-semibold text-green-500':'text-sm font-semibold text-red-500'}>{trade?.trade_status !="Active funded"? "Buyer has marked has paid" : "Do not release" }</h5>
                   <button className='bg-yellow-300 py-2 px-4 text-sm rounded-lg' onClick={()=>setTrigger(true)}>Release</button>
  
              </div>
  
        </div>
            <Modal trigger={trigger}  cname="w-1/5 py-2  bg-white  px-4 rounded-lg py-8 ">


              {!isTrigger ?


              
                        
                <div className='  w-full flex  flex-col space-y-4 items-center'>
                    <h5 className='font-semibold text-red-600 text-xl'>Are you sure?</h5>
                    <div className='flex items-center  space-x-4'>
                    <button className='border border-red-600 text-slate rounded-lg text-xs font-semibold px-4 py-1' onClick={()=>setTrigger(false)}>Cancel</button>
                      {load?
                        <ClipLoader color='brown' size={10}/>
                        :
                        <button className='bg-yellow-100 text-slate rounded-lg text-xs font-semibold px-4 py-1' onClick={release} >Contine</button>


                      }
                    
                    </div>
                    

                </div>

                :
              
                <div className=' space-y-8 w-full flex flex-col items-center py-4'>
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
                      <IoIosArrowBack onClick={()=>setisTrigger(false)} />
                      <h5 onClick={()=>setisTrigger(false)}>Back</h5>

                    </div>


              
                  
              </div>
          }
    
</Modal>
</>
     )
  }







const ChatBox=({trade,token})=>{
    const [msgs,setMsg]=useState([])
    const [text,setText]=useState("")
    const chatRef= useRef(null);
    const [load,setLoad]=useState("not_loaded")
 
    const getActiveTrades=async()=>{
  
     try{
             axios.post(`${baseUrl}/api/v1/get-chat`,{
               token:token,
               hash:trade?.trade_hash,
               },{
               headers: {
                   'Content-Type': 'application/json'
                 }
               })
           .then(response => {
               console.log('message:', response.data?.data);
               setMsg(response.data?.data)
               toast.dismiss();
             
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
       console.log("Run again")
     
 
      token?.length >0&&getActiveTrades()
      if(token?.length >0){
       const interval = setInterval( getActiveTrades, 60000); // 60000 ms = 1 minute
       return () => clearInterval(interval);
      }
 
   },[trade?.trade_hash])
 
 
   useEffect(() => {
     if (chatRef.current) {
       chatRef.current.scrollTop = chatRef.current.scrollHeight;
     }
   },[msgs])
 
 
   const sendMsg=async()=>{
           setLoad("loading")
        
         try{
           axios.post(`${baseUrl}/api/v1/send-chat`,{
             token:token,
             hash:trade?.trade_hash,
             msg:text
             },{
             headers: {
                 'Content-Type': 'application/json'
               }
             })
             .then(response => {
                 setText("")
                 console.log('Trades:', response.data?.data?.status);
                 response.data?.data?.status==="success"&&getActiveTrades()
                 setLoad("not_loadded")

                
               
             })
             .catch(error => {
                 console.error('Error:', error);
                   setLoad("not_loadded")
                   toast.error("Something went wrong!,Try again",{duration:300})
             });
             
 
         }catch(e){
           console.log(e)
         }
       

   }

   console.log(load,"laode")
 
   return(
    <div className='w-1/2 shadow-lg  py-6 rounded-lg  relative bg-white' style={{height:"80vh"}}>
             <div className='flex items-center justify-between  bg-white px-6'>
                    <div className='flex items-center space-x-3'>
                          <h5 className='text-green-500 font-semibold text-sm'>{trade?.responder_username}</h5>
                          <img
                            src={trade?.responder_avatar_url}
                             className="h-6 rounded-full  w-6"
                           />
 
                    </div>
                    <h5 className='text-xs font-light text-slate-700'>Last seen:{trade?.responder_last_seen}</h5>
 
             </div>
 
 
             <div className='flex px-6 flex-col space-y-4 py-6 h-4/5 py-6 overflow-y-scroll ' ref={chatRef}>
                        {msgs?.map((msg)=>{
                             const url="https://noones.com/trade/attachment/wjma4EPWbod?s=2"
                          return(
                            <div className='pb-4'>
                               {msg?.author==null?
                                 <div className='bg-green-100 py-2 px-2 rounded-lg'>
                                     {msg?.text?.bank_account != undefined?
                                         <div>
                                             {/* {msg?.text?.bank_account?.holder_name} */}
                                         </div>
                                         :
                                         <div className=''>
                                           <p className='text-xs font-semibold'>{msg?.text}</p>
 
                                         </div>
                                     }
 
                                 </div>
                                 :
                                 <>
                                 {msg?.type == "trade_attach_uploaded"?
                                   <div className={msg?.author==trade?.owner_username? 'flex w-full justify-end':"flex w-full justify-start"}>
                                 
                                       <div className='flex flex-col '>
                                        <Link to={msg?.text?.files[0]?.full_url}> 
                                             <IoMdDownload className='text-xl text-slate hover:text-yellow-700'/>
                                        </Link>
                                    
                                        <h5 className='text-xs font-light'>{msg?.text?.template}</h5>

                                       </div>
                                    </div>
                                    :
                                    <div className={msg?.author==trade?.owner_username? 'flex w-full justify-end':"flex w-full justify-start"}>
                                    <div className={msg?.author==trade?.owner_username?'bg-slate-400 py-2 px-4 rounded-lg ':'bg-green-400 py-2 px-4 rounded-lg '}>
                                          <p className='text-xs'>
                                            {msg?.text}
                                         </p>
                                   </div>
                             </div>
 
                                 }
                                 
                                 
                                 </>
                            
                                }
                            </div>
                          )
                        })
 
                        }
 
 
             </div>
 
 
             <div className='bg-white border-t bottom-0 absolute h-20  w-full  py-2 '>
                    <div className='bg-white h-full w-full flex items-center space-x-4 px-4' >
                             <textarea
                                  className='border border-green-300 px-4 py-2 w-full h-12 rounded-lg outline-none text-xs'
                                  onChange={(e)=>setText(e.target.value)}
                                  value={text}
                             />
                             {load==="loading"?
                                 <ClipLoader color='brown' size={10}/>
                                 :
                               <button className=' font-semibold bg-yellow-400 py-2 rounded-lg text-xs  px-4' onClick={sendMsg}>Send</button>
 
                                   
                               
 
 
                             }
                
  
                    </div>
 
             </div>
 
       </div>
   )
    
 }
 
 
 
 