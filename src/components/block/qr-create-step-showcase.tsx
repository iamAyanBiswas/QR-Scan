"use client";

import { useState, useEffect } from "react";
import { LayoutTemplate, FileText, Palette, Download, Link, Wifi, Calendar, CheckCircle2, Copy, FileImage, SlidersHorizontal, Image as ImageIcon, Type, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "category",
    title: "1. Choose a Category",
    description: "Start by selecting the type of QR code you want to create (URL, vCard, Event, WiFi, etc.).",
    icon: LayoutTemplate,
  },
  {
    id: "content",
    title: "2. Add Content",
    description: "Enter the details for your destination—like links, contact info, or event dates.",
    icon: FileText,
  },
  {
    id: "customize",
    title: "3. Customize Design",
    description: "Make it yours. Upload a logo, change colors, and pick a custom frame to match your brand.",
    icon: Palette,
  },
  {
    id: "share",
    title: "4. Save & Share",
    description: "Download the high-quality QR image or grab the short URL to start tracking scans.",
    icon: Download,
  },
];

export default function QRCreateStepShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-border/50 bg-background/50 shadow-2xl overflow-hidden glass-panel relative">
      {/* Background soft glow */ }
      <div className="absolute top-0 right-0 -z-10 w-125 h-125 bg-primary/10 rounded-full blur-[100px] opacity-50 mix-blend-screen pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:h-150">
        {/* Left Side: Steps List */}
        <div 
          className="col-span-1 lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/10 p-6 sm:p-10 flex flex-col justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="space-y-6 lg:space-y-8">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const Icon = step.icon;
              return (
                <div 
                  key={step.id} 
                  className={cn(
                    "flex gap-4 cursor-pointer group transition-all duration-300 relative",
                    isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                  )}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Indicator Line */}
                  <div className="absolute left-6 top-12 -bottom-6 lg:-bottom-8 w-px bg-border group-last:hidden" />
                  
                  <div className="relative z-10 shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                        : "bg-background border border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className={cn(
                      "text-lg font-bold mb-1 transition-colors",
                      isActive ? "text-foreground" : "text-foreground/70"
                    )}>{step.title}</h3>
                    <div className={cn(
                      "grid transition-all duration-500 ease-in-out",
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <p className="text-sm text-muted-foreground overflow-hidden">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visual Mockups */}
        <div className="col-span-1 lg:col-span-7 bg-black/5 dark:bg-black/20 p-6 sm:p-10 flex items-center justify-center relative overflow-hidden h-112.5 lg:h-auto">
          {/* Mockup Window */}
          <div className="relative w-full max-w-md lg:max-w-lg aspect-square lg:aspect-4/3 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden glass-panel flex flex-col ring-1 ring-white/10">
            
            {/* Window Top Bar */}
            <div className="h-10 border-b border-border bg-muted/30 flex items-center px-4 gap-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              <div className="flex-1" />
              <div className="w-24 h-2 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Window Content Area */}
            <div className="flex-1 relative p-6 flex flex-col items-center justify-center overflow-hidden bg-dot-pattern bg-size-[16px_16px] dark:bg-size-[24px_24px]">
              
              {/* Step 1 Visual: Category Grid */}
              <div className={cn(
                "absolute inset-4 transition-all duration-700 flex flex-col",
                activeStep === 0 ? "opacity-100 scale-100 z-10 translate-y-0" : "opacity-0 scale-95 -z-10 translate-y-8 pointer-events-none"
              )}>
                <div className="mb-4 text-center">
                  <div className="h-2 w-16 bg-muted-foreground/20 rounded-full mx-auto mb-2" />
                  <div className="h-4 w-32 bg-foreground/80 rounded-full mx-auto" />
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1 mt-2">
                  {[
                    { icon: Link, label: "Website URL", active: true },
                    { icon: FileText, label: "vCard", active: false },
                    { icon: Wifi, label: "WiFi", active: false },
                    { icon: Calendar, label: "Event", active: false },
                  ].map((cat, i) => (
                    <div key={i} className={cn(
                      "rounded-xl border flex flex-col items-center justify-center gap-3 p-4 transition-all",
                      cat.active 
                        ? "border-primary bg-primary/10 text-primary shadow-inner" 
                        : "border-border bg-background/50 text-muted-foreground"
                    )}>
                      <cat.icon className={cn("w-8 h-8", cat.active ? "text-primary" : "opacity-50")} />
                      <span className="text-sm font-medium">{cat.label}</span>
                      {cat.active && <CheckCircle2 className="w-5 h-5 absolute top-3 right-3 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2 Visual: Form Mockup */}
              <div className={cn(
                "absolute inset-6 transition-all duration-700 flex flex-col justify-center",
                activeStep === 1 ? "opacity-100 scale-100 z-10 translate-y-0" : "opacity-0 scale-95 -z-10 translate-y-8 pointer-events-none"
              )}>
                <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                  <div className="mb-4 border-b border-border/50 pb-3 flex items-center gap-2 text-foreground font-medium">
                    <Link className="w-4 h-4 text-primary" /> Destination URL
                  </div>
                  <div className="space-y-4 relative">
                    {/* Simulated typing cursor mask area */}
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-muted-foreground/40 rounded-full" />
                      <div className="h-10 w-full bg-muted/20 border border-border rounded-lg flex items-center px-3 gap-2">
                        <span className="text-muted-foreground text-sm font-mono shrink-0">https://</span>
                        <div className="h-4 w-36 bg-foreground/20 rounded-sm relative overflow-hidden">
                          {/* Animated "typing" bar */}
                          <div className={cn("absolute top-0 bottom-0 bg-primary transition-all duration-3000 ease-out", activeStep === 1 ? "w-full" : "w-0")} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-muted-foreground/40 rounded-full" />
                      <div className="h-10 w-full bg-muted/20 border border-border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-9 rounded-lg bg-muted/30 border border-border" />
                      <div className="h-9 rounded-lg bg-muted/30 border border-border" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 Visual: Customizer */}
              <div className={cn(
                "absolute inset-4 transition-all duration-700 flex items-center justify-center",
                activeStep === 2 ? "opacity-100 scale-100 z-10 translate-y-0" : "opacity-0 scale-95 -z-10 translate-y-8 pointer-events-none"
              )}>
                <div className="w-full max-h-full flex gap-4 h-70">
                  {/* Sidebar Tools Mini */}
                  <div className="w-14 shrink-0 flex flex-col gap-3 py-2 border-r border-border pr-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/30 ring-2 ring-primary/20"><Palette className="w-5 h-5" /></div>
                    <div className="w-10 h-10 rounded-lg bg-muted border border-border text-muted-foreground flex items-center justify-center"><ImageIcon className="w-5 h-5" /></div>
                    <div className="w-10 h-10 rounded-lg bg-muted border border-border text-muted-foreground flex items-center justify-center"><Type className="w-5 h-5" /></div>
                    <div className="w-10 h-10 rounded-lg bg-muted border border-border text-muted-foreground flex items-center justify-center"><SlidersHorizontal className="w-5 h-5" /></div>
                  </div>
                  {/* Builder Preview Area */}
                  <div className="flex-1 flex flex-col items-center justify-center bg-muted/5 rounded-xl border border-border/50 relative">
                     {/* Swatches Floating */}
                     <div className="absolute top-4 right-4 flex gap-1.5 bg-background border border-border p-1.5 rounded-md shadow-sm">
                       <div className="w-4 h-4 rounded bg-[#3b82f6] shadow-sm" />
                       <div className="w-4 h-4 rounded bg-[#a855f7] shadow-sm transform scale-125 ring-2 ring-primary/50" />
                       <div className="w-4 h-4 rounded bg-[#10b981] shadow-sm" />
                       <div className="w-4 h-4 rounded bg-[#f59e0b] shadow-sm" />
                     </div>
                     
                     {/* Simulated QR Pattern */}
                     <div className="w-36 h-36 bg-white rounded-xl p-3 shadow-md border border-border relative flex items-center justify-center">
                        <div className="absolute inset-3 grid grid-cols-6 grid-rows-6 gap-0.5">
                           {Array.from({length: 36}).map((_, i) => (
                             <div key={i} className={cn("bg-[#a855f7] rounded-sm transition-all duration-1000", (i * 7 % 3 === 0 || i % 5 === 0) ? "opacity-100 scale-100" : "opacity-0 scale-0", activeStep === 2 ? "delay-" + (i * 20) : "")} />
                           ))}
                        </div>
                        {/* Eye markers */}
                        <div className="absolute top-3 left-3 w-8 h-8 border-4 border-[#a855f7] rounded-md flex items-center justify-center"><div className="w-3 h-3 bg-[#a855f7] rounded-sm" /></div>
                        <div className="absolute top-3 right-3 w-8 h-8 border-4 border-[#a855f7] rounded-md flex items-center justify-center"><div className="w-3 h-3 bg-[#a855f7] rounded-sm" /></div>
                        <div className="absolute bottom-3 left-3 w-8 h-8 border-4 border-[#a855f7] rounded-md flex items-center justify-center"><div className="w-3 h-3 bg-[#a855f7] rounded-sm" /></div>
                        
                        {/* Center Logo Area */}
                        <div className="absolute w-8 h-8 bg-white border border-border rounded shadow-sm flex items-center justify-center z-10 animate-pulse">
                          <Sparkles className="w-4 h-4 text-[#a855f7]" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Step 4 Visual: Save & Share */}
              <div className={cn(
                "absolute inset-8 transition-all duration-700 flex flex-col items-center justify-center bg-background border border-border rounded-xl shadow-lg p-6",
                activeStep === 3 ? "opacity-100 scale-100 z-10 translate-y-0" : "opacity-0 scale-95 -z-10 translate-y-8 pointer-events-none"
              )}>
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl mb-1 text-foreground">QR Code Ready!</h4>
                <p className="text-sm text-muted-foreground text-center mb-6 max-w-55">
                  Your dynamic QR code is active and ready to be deployed.
                </p>

                <div className="w-full space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity">
                    <FileImage className="w-4 h-4" /> Download QR Code
                  </button>
                  <div className="w-full flex items-center bg-muted/30 border border-border rounded-lg overflow-hidden h-10">
                    <div className="px-3 text-xs text-foreground font-mono flex-1 truncate">
                      qrnx.link/c/ev_xk92
                    </div>
                    <button className="h-full px-4 bg-muted hover:bg-muted/80 text-foreground border-l border-border transition-colors flex items-center justify-center gap-1 text-xs font-medium">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}