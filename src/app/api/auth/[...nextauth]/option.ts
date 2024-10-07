import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConfig";
import bcrypt from "bcryptjs"
import userModel from "@/model/user";
import { sendVerificationCode } from "@/helper/sendVerificationCode";

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"Credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user = await userModel.findOne({email: credentials.identifier.email});
                    if(!user){
                        throw new Error("User not found")
                    }
                    // if user exists then check user is verified or not , if not then send verification code then login
                    
                        const {username,email,password} = user
                        const verificationCode = Math.floor(
                            100000 + Math.random() * 900000
                          ).toString();
                          const expiry = new Date();
                          expiry.setHours(expiry.getHours() + 1);
                        if(!user.isVerified) {
                            // setting new verification code for user in db
                            user.verificationCode = verificationCode;
                            user.verifiedCodeExpiry = expiry;
                            await user.save();
                            // send verification code
                            await sendVerificationCode(username.toString(),email.toString(),verificationCode)
                        }
                        // if user is verified then check the password 
                         const isPasswordCorrect = await bcrypt.compare(credentials.password,password.toString())
                         if(isPasswordCorrect){
                            return user
                         }else throw new Error("Invalid Credentails")
                    
                    
                } catch (error:any) {
                    throw new Error(error.message)
                }
              }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id,
                token.username = user.username,
                token.email = user.email,
                token.isVerified = user.isVerified,
                token.isAdmin = user.isAdmin
            }
            return token
        },
        async session({session,token}){
            if(token ){
                session.user._id = token._id,
                session.user.username = token.username,
                session.user.email = token.email,
                session.user.isVerified = token.isVerified,
                session.user.isAdmin = token.isAdmin
            }
            return session
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },

    secret:process.env.NEXTAUTH_SECRET
}