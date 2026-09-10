'use client';
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import forgotPasswordAction from "@/actions/user/forgot-password/forgotPasswordAction";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {

  const router = useRouter();
  const { email, setEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(email.toString().trim() == "")
    {
      toast.error("Email is required");
      return;
    }
    
    setIsLoading(true);
    const result = await forgotPasswordAction(email);
    if(result.success)
    {
      toast.success(result.message || "A 6-digit OTP sent to your email.");
      setTimeout(() => {
        router.push('/auth/forgot-password/verify-otp');
      }, 2000);
      setIsLoading(false);
    }
    else
    {
      toast.error(result.message || "Failed to send OTP");
      setIsLoading(false);
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
          <span>E-shop</span>
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Forgot Password</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitHandler}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={e => setEmail(e.target.value)} value={email} required disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Sending OTP..." : "Send OTP"}</Button>
                  </Field>
                </FieldGroup>
              </form>
              {/* back button */}
              <div className="text-center mt-5">
                <Link href="/auth/login"><Button variant="secondary"><ChevronLeft/> Back to Login</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
