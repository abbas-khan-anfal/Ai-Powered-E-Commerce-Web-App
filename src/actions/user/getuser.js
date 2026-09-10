'use server';
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function getUserAction(){
    try
    {
        const loggedInUser = await getLoggedInUser();
        const user = loggedInUser ? loggedInUser : null;
        if(!user)
        {
            return { success : false, message : "User not logged in"}
        }
        return { success : true, user };
    }
    catch(error)
    {
        return { success : false, message : error?.message || "Something went wrong"}
    }
}