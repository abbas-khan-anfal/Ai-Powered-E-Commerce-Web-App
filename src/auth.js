import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import userModel from '@/models/userModel';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers : [
        Google({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
            name : "Credentials",
            credentials : {
                email : {label : "Email", type : "email"},
                password : {label : "Password", type : "password"}
            },
            async authorize(credentials){
               if(!credentials.email || !credentials.password){
                return null
               }
               await connectDB();
               const userExist = await userModel.findOne({ email : credentials.email.toLowerCase()})
               if(userExist && ['seller','admin'].includes(userExist.role))
               {
                return null;
               }
               if(!userExist){
                return null
               }
               if(userExist.password === "" || userExist.password === null || !userExist.password){
                return null
               }
               const isMatchPassword = await bcrypt.compare(credentials.password, userExist.password);
               if(!isMatchPassword){
                return null
               }

               return {
                id : userExist._id.toString(),
                email : userExist.email,
                username : userExist.username,
                avatar : userExist.avatar_path
               }
            }
        })
    ],
    secret : process.env.NEXTAUTH_SECRET,

    // Expiry for jwt and session
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    jwt: {
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },


    callbacks : {

        // google login
       async signIn({ user, account }) {
            try {
                if (account.provider === "google") {
                await connectDB();

                const userExist = await userModel.findOne({ email: user.email });

                    if (!userExist) {
                        await userModel.create({
                        email: user.email,
                        username: user.name,
                        avatar_path: user.image,
                        });
                    }
                }

                return true;
            } catch (error) {
                console.log("SIGNIN ERROR:", error);
                return false; // causes AccessDenied
            }
        },

       async jwt({ token, user, account }){
           // on first login
           if(user)
           {
                // if(account.provider === "google"){
                    await connectDB();
                    const dbUser = await userModel.findOne({ email : user.email });
                    token.id = dbUser._id.toString();
                    token.username = dbUser.username;
                    token.avatar = dbUser.avatar_path;
                    token.role = dbUser.role;
                // }
           }
           return token;
       },
       async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.avatar = token.avatar;
                session.user.role = token.role;
            }
            return session;
        }
    }
})