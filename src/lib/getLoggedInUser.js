import { cookies } from "next/headers";
import { verifyToken } from "./token";

const getLoggedInUser = async () => {
  try {
    const store = await cookies();

    const token = store.get("ecom-dash-token")?.value;
    const userCookie = store.get("ecom-dash-user")?.value;

    if (!token || !userCookie) return null;
    // check if token is expire ot not
    const isAuth = token ? await verifyToken(token) : false;
    if (!isAuth) return null;

    return JSON.parse(userCookie); 
  } catch {
    return null;
  }
};

export default getLoggedInUser;
