'use client'
import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"

import { APP_NAME } from "@/config/name"
import { GoogleOAuthButton } from "@/components/custom/google-oauth-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const continueWithGoogle = async () => {
    await authClient.signIn.social({ provider: 'google' })
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {APP_NAME}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Login with your Google account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <GoogleOAuthButton onClick={continueWithGoogle} />
                </div>
              </CardContent>
            </Card>
            <div className="text-center text-sm text-balance text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/auth-bg.png"
          alt="Authentication Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-lg font-medium">
            "Secure, fast, and reliable. The best way to manage your QR codes."
          </p>
        </div>
      </div>
    </div>
  )
}
