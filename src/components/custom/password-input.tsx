'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // kept for backward compatibility if needed, though extending InputHTMLAttributes covers standard props
}



import React from 'react'

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        className={cn("pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"
