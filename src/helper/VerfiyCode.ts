
export const verfiyCode = ({userVerfiedcode,verficationCodeInDb,codeExpiry}:{userVerfiedcode:string,verficationCodeInDb:string,codeExpiry:Date} )=>{

try{
   
 if(userVerfiedcode && verficationCodeInDb && codeExpiry){
    const isCodeValid =userVerfiedcode === verficationCodeInDb;
    const isCodeNotExpired = new Date(codeExpiry) > new Date();
    if(isCodeValid && isCodeNotExpired){
      
        return {success:true,message:"user verfied"}
    } 
    if(!isCodeValid) return {success:false,message:"Invalid Verfication code"}
    if(!isCodeNotExpired) return {success:false,message:"Code Expired"}
 }

 
    
    
}catch(e:any){
    console.log("Could not able to verify code ", e.message)
}
}