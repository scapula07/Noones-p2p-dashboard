import {atom} from "recoil"


export const tokenState =atom({
   key:"token",
   default:""
})


export const userState =atom({
    key:"user",
    default:{
        id:""
    }
 })
 
