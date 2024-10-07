import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import userModel from "@/model/user";
import { verfiyCode } from "@/helper/VerfiyCode";

export const POST= async(req:NextRequest)=>{
    await dbConnect()
try{
const {email,verificationCode} = await req.json();
const user = await userModel.findOne({email});


if(user){
 const {success,message} : any= verfiyCode({userVerfiedcode:verificationCode,verficationCodeInDb:user.verificationCode.toString(),codeExpiry:user.verifiedCodeExpiry})
   if(success){
    user.isVerified = true
    await user.save()
    return NextResponse.json({success:true,message})
   }else{
    return NextResponse.json({success:false,message})
   }
}
}catch(e:any){
    console.log("Could not able to verify code ", e.message)
}
}