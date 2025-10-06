"use server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"


export const signInGoogle =async () =>{
 const {url} = await auth.api.signInSocial({
    body:{
        provider:"google",
        callbackURL:"/u",
    }
    
 })
  if(url){
    redirect(url)
  }
}
export const signInGithub =async () =>{
 const {url} = await auth.api.signInSocial({
    body:{
        provider:"github",
        callbackURL:"/u",
    }
    
 })
  if(url){
    redirect(url)
  }
}

export const signOut = async ()=>{
    const result = await auth.api.signOut({headers: await headers()})
    return result
}

