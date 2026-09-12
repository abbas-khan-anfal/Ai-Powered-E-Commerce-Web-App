'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const signInHandler = async () => {
    try
    {
      setIsGoogleLoading(true);
      const res = await signIn("google");
      console.log(res);
    }
    catch(error)
    {
      toast.error(error?.message || "Something went wrong");
      setIsGoogleLoading(false);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    // now login by credentials
    setIsLoading(true);
    const formData = { email, password };
    try
    {
      const result = await signIn("credentials", { ...formData, redirect: false });
    if(result?.error)
    {
      if(result.error === "CredentialsSignin")
      {
        toast.error("Invalid credentials");
      }
      else
      {
        toast.error("Couldn't login, Something went wrong, try agian later");
      }
    }
    else
    {
      toast.success("Logged in successful");
      // hard reload to path /
      window.location.href = "/";
    }
    }
    catch(error)
    {
      console.log(error?.message || "Something went wrong");
    }
    finally
    {
      setIsLoading(false);
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex flex-col items-center gap-0 self-center font-medium">
          <div className="flex items-center justify-center rounded-md size-10">
            {/* <GalleryVertical className="size-4" /> */}
            <Image src="/black-bag.png" width={500} height={500} classname=" object-cover" />
          </div>
          <span>Welcome To E-shop</span>
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitHandler}>
                <FieldGroup>
                  <Field>
                    <Button variant="outline" type="button" onClick={signInHandler} disabled={isGoogleLoading}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)}
                      value={password} />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isLoading || isGoogleLoading}>
                      {
                        isLoading ? "loging..." : "Login"
                      }
                  </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
