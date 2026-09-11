'use server';
import { cookies } from "next/headers";

// logout user
export async function logoutUserAction() {
  try {
    const cookieStore = await cookies();

    const deleteOptions = {
        path: "/", 
        maxAge: 0, // Instantly expires the cookie
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };

    // delete cookies
    cookieStore.delete("ecom-dash-token", deleteOptions);
    cookieStore.delete("ecom-dash-user", deleteOptions);
    return { success : true, message : "Logout successfull" };
  } catch (err) {
    console.log(err);
    return { success : false, message : err?.message || "Can't logout, something went wrong" };
  }
}

