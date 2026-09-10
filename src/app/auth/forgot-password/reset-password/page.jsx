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
import resetPasswordAction from "@/actions/user/forgot-password/resetPasswordAction";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {

  const router = useRouter();
  const { email, setEmail, setOtp, password, setPassword, confirmPassword, setConfirmPassword } = useAuthStore();
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

    if(password.trim() == "" || confirmPassword.trim() == "")
    {
      toast.error("Please fill out all the fields");
      return;
    }

    if(password.toString() !== confirmPassword.toString())
    {
      toast.error("Password and confirm-password is not matched");
      return;
    }
    if(password.length < 7)
    {
      toast.error("Password must be at least 7 characters long");
      return;
    }

    setIsLoading(true);
    const result = await resetPasswordAction(email, password);
    if(result.success)
    {
      toast.success(result.message || "Password updated successfully");
      setIsLoading(false);
      setTimeout(() => {
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
        router.push('/auth/login');
      }, 2000);
    }
    else
    {
      toast.error(result.message || "Failed to update password");
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
              <CardTitle className="text-xl">Reset Your Password</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitHandler}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={e => setPassword(e.target.value)} value={password}
                    />
                    <FieldDescription>A strong password must be 8 characters or longer.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating" : "Update Password"}
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
