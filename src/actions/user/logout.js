'use server';
import { cookies } from "next/headers";

// logout user
export async function logoutUserAction() {
  try {
    const cookieStore = await cookies();
    // delete cookies
    cookieStore.delete("ecom-dash-token", {
        httpOnly : true,
        expires : new Date(0),
    });
    cookieStore.delete("ecom-dash-user", {
        httpOnly : true,
        expires : new Date(0),
    });
    return { success : true, message : "Logout successfull" };
  } catch (err) {
    console.log(err);
    return { success : false, message : err?.message || "Can't logout, something went wrong" };
  }
}

