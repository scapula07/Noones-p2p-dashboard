import React,{useState,useEffect} from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import Header from './header';
import { useRecoilState } from 'recoil';
import { tokenState } from './recoil';
import { Link,useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';


    const baseUrl="https://noones-be-1.onrender.com"
export default function TradeTable() {
    const [token,setToken]=useRecoilState(tokenState)
    const [trades,setTrades]=useState([])
    const [trade,setTrade]=useState("")
    const [no,setNo]=useState("")

    useEffect(()=>{
        console.log("Run again")
         const getActiveTrades=async()=>{
              toast.loading("Fetching new Trades")
              try{
                      axios.post(`${baseUrl}/api/v1/get-trades`,{token:token},{
                        headers: {
                            'Content-Type': 'application/json'
                          }
                        })
                    .then(response => {
                        console.log('Trades:', response.data?.data?.filter(offer=>offer?.offer_type==="sell"));
                        setTrades(response.data?.data?.filter(offer=>offer?.offer_type==="sell"))
                        setTrade(response.data?.data?.filter(offer=>offer?.offer_type==="sell")[0])
                        response.data?.data?.filter(offer=>offer?.offer_type==="sell")?.length===0 &&setNo("No contact")
                        response.data?.data?.filter(offer=>offer?.offer_type==="sell")?.length >0 &&setNo("")
                        toast.dismiss()
                      
                    })
                    .catch(error => {
                        console.error('Error:',error, error?.response?.status);
                        if(error?.response?.status==401){
                          getAccessToken()
                          toast.dismiss()
                          
                        }else{
    
                        }
                    });
                    toast.dismiss()
                  
                 }catch(e){
                   console.log(e,"eee")
               }
         }
    
         token?.length >0&&getActiveTrades()
         if(token?.length >0){
              const interval = setInterval( getActiveTrades, 60000); // 60000 ms = 1 minute
              return () => clearInterval(interval);
         }
    
    
      },[token?.length])


      console.log(token,"in trade")


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
    <div className='w-full flex justify-center h-screen py-10'>
           <div className='w-4/5 space-y-10'>
                <Header />
                <Trades 
                    trades={trades}
                    setTrade={setTrade}
                    trade={trade}
                    no={no}
                    setNo={setNo}
                />


           </div>

           <Toaster />

    </div>
  )
}







const Trades=({trades,setTrade,trade,no,setNo})=>{
    return(
      <div>
          <table class="table-auto w-full border-separate-4 border-spacing-2">
                  <thead className='py-2 bg-yellow-100'>
                  <tr >
                        {
                          ["Amount",
                            "Partner",
                          "Trade",
                          "Method",
                          "Started",
                          "Status",
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
                      
                      {trades?.map((trading,index)=>{
                           
                            return(
                            
                                <Row 
                                   trading={trading}
                                   setTrade={setTrade}
                                   trade={trade}
                                />
                                
  
                            )
                        })
  
                      }

                         </tbody>

                   
  
               </table>
                {trades?.length ==0&&no?.length >0&&
                        <div className='w-full flex justify-center py-4 '>
                            <h5 className='font-semibold text-slate-800'>No Active Trades</h5>
                        </div>

                }
                 {trades?.length ===0&&no?.length ==0&&
                        <div className='w-full flex justify-center py-4 '>
                            <ClipLoader color="brown" size={15} />
                        </div>

                }
  
      </div>
    )
  }
  
  
  
  
  
  const Row=({trading,setTrade,trade})=>{
    let navigate = useNavigate();
  
      return(

                 <tr className={trading?.trade_hash==trade?.trade_hash?'border-b py-3 bg-green-100':'border-b py-3 hover:bg-green-100'} onClick={()=>setTrade(trading) ||navigate("/chat",{state:trading})}>
                    <td className='text-sm font-light text-slate-500 py-6'>
                        <div className='flex space-x-1'>
                            
                                <h5>{trading?.fiat_currency_code}</h5>
                                <h5>{trading?.fiat_amount_requested}</h5>
                                
        
                            
        
                        </div>
                    </td>
        
                    <td className='text-sm font-light text-slate-500 text-center py-6'>{trading?.responder_username}</td>
        
                    <td className='text-sm font-light text-slate-500 text-center py-6'>{trading?.offer_type}</td>
                    <td className='text-sm font-light text-slate-500 text-center py-6'>{trading?.payment_method_name}</td>
                    <td className='text-sm font-light text-slate-500 text-center py-6'>{trading?.started_at}</td>
                    <td className='text-sm font-light text-slate-500 text-center py-6'>{trading?.trade_status}</td>
        
                </tr>
       
     
  
      )
  }