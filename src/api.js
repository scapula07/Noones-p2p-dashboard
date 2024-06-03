import axios from "axios";



export const getAccessToken=async(baseUrl)=>{

    toast.loading('Waiting for Access Token');
  try{
       
         axios.get(`${baseUrl}/api/v1/get-token`,{
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
             }
           })
       .then(response => {
           console.log('Access Token:', response.data?.data?.access_token);
           setToken(response.data?.data?.access_token)
           setTrigger("triggered")
       
           toast.dismiss();
       })
       .catch(error => {
           console.error('Error:', error);
           
           toast.error('Try again,something went wrong!');
           // setTrigger(false)
           toast.dismiss();
       });
       toast.dismiss();

   }catch(e){
      console.log(e)
      toast.dismiss();
   }

   
}