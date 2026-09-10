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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserAction } from "@/actions/user/create";
import toast from "react-hot-toast";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userRole = "customer";
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", userRole);

    try {
      const result = await createUserAction(formData);
      if (result?.success) {
        setUsername("");
        setEmail("");
        setPassword("");']'
        toast.success(result.message);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithGoogleHandler = async () => {
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

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-2 text-sm">
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
              <CardDescription>Signup with your Google account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <Button variant="outline" type="button" onClick={signupWithGoogleHandler} disabled={isGoogleLoading}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Signup with Google
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                    </div>
                    <Input
                      id="username"
                      type="text"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isLoading || isGoogleLoading}>
                      {isLoading ? "Creating account..." : "Signup"}
                    </Button>
                    <FieldDescription className="text-center">
                      Already have an account? <a href="/auth/login">Login</a>
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
