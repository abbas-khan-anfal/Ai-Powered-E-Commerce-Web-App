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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import toast from "react-hot-toast";
import verifyOtpAction from "@/actions/user/forgot-password/verifyOtpAction";
import { useEffect, useState } from "react";

export default function LoginPage() {

  const router = useRouter();
  const { otp, setOtp, email } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if(email.toString().trim() == "")
    {
      toast.error("Something went wrong, try again");
      setTimeout(() => {
        router.push('/auth/forgot-password');
      }, 1000);
    }

    if(otp.toString().trim() == "")
    {
      toast.error("OTP is required");
      return;
    }

    if(otp.toString().length > 6 || otp.toString().length < 6)
    {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    const result = await verifyOtpAction(email, otp);
    if(result.success)
    {
      toast.success(result.message || "OTP verified successfully");
      setTimeout(() => {
        router.push('/auth/forgot-password/reset-password');
      }, 2000);
      setIsLoading(false);
    }
    else
    {
      toast.error(result.message || "Failed to verify OTP");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(email.toString().trim() == "")
    {
      router.push('/auth/forgot-password');
    }
  }, []);

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
              <CardTitle className="text-xl">Verify Your OTP</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitHandler}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email"></FieldLabel>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="ex: 123456"
                      onChange={e => setOtp(e.target.value)} value={otp} required disabled={isLoading}
                    />
                  </Field>
                  <FieldDescription>Enter the OTP sent to your email address.</FieldDescription>
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                    </Button>
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
