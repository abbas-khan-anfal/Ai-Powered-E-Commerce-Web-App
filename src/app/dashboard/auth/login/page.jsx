"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthstore from "@/store/useAdminAuthStore";
import { loginUserAction } from "@/actions/user/login";
import { ArrowLeftIcon } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { setIsDashboardLoading } = useAuthstore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUserAction({ email, password });
      if (response.success) {
        toast.success(response.message);
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md">
      <div className="flex items-center mb-5">
            <Button
              variant="outline"
              size="icon"
              aria-label="Go Back"
              className="mr-2"
              type="button"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon />
            </Button>
            <FieldLabel className="text-2xl font-bold">
              Login to Dashboard
            </FieldLabel>
          </div>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet className="text-4xl">
            <FieldDescription>
              Login to continue to the dashboard
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            {/* <FieldDescription className="text-center">
              Don't have an account?{" "}
              <a href="/dashboard/auth/become-a-seller">
                Create a seller account
              </a>
            </FieldDescription> */}
          </Field>
        </FieldGroup>
      </form>
      </div>
    </div>
  );
}
