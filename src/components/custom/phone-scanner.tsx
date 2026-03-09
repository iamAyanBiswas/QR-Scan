"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PhoneScannerProps {
  className?: string;
}

export function PhoneScanner({ className }: PhoneScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Reduced to 10 for subtler effect
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className={cn("relative z-20 group perspective-[1000px] flex items-center justify-center p-8", className)}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes scanline {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        .animate-scanline {
          animation: scanline 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Main Phone Body */}
      <div
        className="relative w-36 sm:w-40 lg:w-44 aspect-[9/19.5] preserve-3d transition-transform will-change-transform transform-gpu backface-hidden"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovering ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
        }}
      >
        {/* Lighter Titanium Frame / Outer Edge */}
        <div
          className="absolute inset-0 bg-linear-to-br from-[#f8f8f8] via-[#e4e4e7] to-[#d4d4d8] p-px shadow-xl preserve-3d"
          style={{ borderRadius: "15% / 6.9%" }}
        >

          {/* Simplified Shadow for performance */}
          <div
            className="absolute inset-0 bg-black/50 blur-lg -z-20 transition-transform duration-300"
            style={{
              borderRadius: "15% / 6.9%",
              transform: `translateZ(-20px) translateX(${rotation.y * -0.5}px) translateY(${rotation.x * 0.5}px)`,
              opacity: isHovering ? 0.6 : 0.3
            }}
          />

          {/* Hardware Buttons — % based so they scale with phone height */}
          {/* Silent switch */}
          <div className="absolute -left-0.75 rounded-l-md bg-linear-to-r from-[#e4e4e7] to-[#d4d4d8] shadow-[-1px_0_1px_rgba(0,0,0,0.1)_inset]"
            style={{ top: "13%", height: "4%", width: "3px" }} />
          {/* Volume Up */}
          <div className="absolute -left-0.75 rounded-l-md bg-linear-to-r from-[#e4e4e7] to-[#d4d4d8] shadow-[-1px_0_1px_rgba(0,0,0,0.1)_inset]"
            style={{ top: "20%", height: "8%", width: "3px" }} />
          {/* Volume Down */}
          <div className="absolute -left-0.75 rounded-l-md bg-linear-to-r from-[#e4e4e7] to-[#d4d4d8] shadow-[-1px_0_1px_rgba(0,0,0,0.1)_inset]"
            style={{ top: "31%", height: "8%", width: "3px" }} />
          {/* Power button */}
          <div className="absolute -right-0.75 rounded-r-md bg-linear-to-l from-[#e4e4e7] to-[#d4d4d8] shadow-[1px_0_1px_rgba(0,0,0,0.1)_inset]"
            style={{ top: "25%", height: "10%", width: "3px" }} />

          {/* Inner Bezel (Black Border) */}
          <div className="relative h-full w-full bg-black p-[2.5%] preserve-3d shadow-[inset_0_0_0_1px_#27272a,inset_0_0_2px_1px_#000]"
            style={{ borderRadius: "14.2% / 6.5%" }}
          >

            {/* Screen Content Wrapper - Light Theme UI */}
            <div className="relative h-full w-full overflow-hidden bg-zinc-50 border border-zinc-200 flex flex-col items-center justify-center"
              style={{ borderRadius: "13.5% / 6.2%" }}
            >

              {/* Dynamic Island — centered, narrower to match real iPhone 17 Pro Max */}
              <div
                className="absolute z-40 bg-black shadow-md flex items-center justify-end"
                style={{ top: "1.8%", left: "50%", transform: "translateX(-50%)", height: "3.8%", width: "42%", borderRadius: "9999px", paddingRight: "3%" }}
              >
                {/* Front camera in island */}
                <div
                  className="rounded-full bg-[#0a0a2a] relative overflow-hidden"
                  style={{ height: "62%", aspectRatio: "1" }}
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/30"
                    style={{ height: "45%", width: "45%" }} />
                </div>
              </div>

              {/* Status Bar — flanks the Dynamic Island at the SAME vertical level */}
              {/* Time on the left, icons on the right, vertically centered with the island */}
              <div
                className="absolute z-50 font-semibold text-zinc-900 flex items-center"
                style={{
                  top: "1.8%",
                  left: "5%",
                  height: "3.8%",
                  fontSize: "clamp(0.38rem, 1.8%, 0.55rem)",
                  letterSpacing: "-0.01em"
                }}
              >9:41</div>
              <div
                className="absolute z-50 flex items-center"
                style={{ top: "1.8%", right: "4%", height: "3.8%", gap: "5%" }}
              >
                {/* Signal bars */}
                <div className="flex items-end" style={{ gap: "1.5px", height: "clamp(6px, 1.6%, 9px)" }}>
                  <div className="bg-zinc-900 rounded-[0.5px]" style={{ width: "2px", height: "40%" }} />
                  <div className="bg-zinc-900 rounded-[0.5px]" style={{ width: "2px", height: "60%" }} />
                  <div className="bg-zinc-900 rounded-[0.5px]" style={{ width: "2px", height: "80%" }} />
                  <div className="bg-zinc-900 rounded-[0.5px]" style={{ width: "2px", height: "100%" }} />
                </div>
                {/* Wi-Fi icon */}
                <div className="text-zinc-900" style={{ width: "clamp(7px, 2.5%, 10px)", height: "clamp(6px, 1.8%, 9px)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                {/* Battery icon */}
                <div className="rounded-[1.5px] border border-zinc-900 relative flex items-center"
                  style={{ width: "clamp(12px, 4.5%, 17px)", height: "clamp(5px, 1.3%, 7px)", padding: "1px", boxSizing: "border-box" }}
                >
                  <div className="h-full bg-zinc-900 rounded-[0.5px]" style={{ width: "80%" }} />
                  <div className="absolute bg-zinc-900 rounded-r-[1px]"
                    style={{ right: "-2px", top: "25%", bottom: "25%", width: "1.5px" }} />
                </div>
              </div>

              {/* Base Camera Background (Simulated light app background) */}
              <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100/50 rounded-full blur-2xl"></div>
              </div>

              {/* Reduced 3D Floating QR Scanning Area */}
              <div
                className="relative z-30 flex flex-col items-center justify-center w-full h-full preserve-3d"
                style={{ transform: "translateZ(10px)" }}
              >
                {/* Glass panel for QR code background */}
                <div className="relative m-3 p-1 backdrop-blur-md transition-colors duration-500">

                  {/* Corner Brackets for Scanner */}
                  <div className="absolute -left-1 -top-1 border-l-[3px] border-t-[3px] border-primary rounded-tl-xl"
                    style={{ height: "clamp(14px, 12%, 22px)", width: "clamp(14px, 12%, 22px)" }} />
                  <div className="absolute -right-1 -top-1 border-r-[3px] border-t-[3px] border-primary rounded-tr-xl"
                    style={{ height: "clamp(14px, 12%, 22px)", width: "clamp(14px, 12%, 22px)" }} />
                  <div className="absolute -left-1 -bottom-1 border-b-[3px] border-l-[3px] border-primary rounded-bl-xl"
                    style={{ height: "clamp(14px, 12%, 22px)", width: "clamp(14px, 12%, 22px)" }} />
                  <div className="absolute -right-1 -bottom-1 border-b-[3px] border-r-[3px] border-primary rounded-br-xl"
                    style={{ height: "clamp(14px, 12%, 22px)", width: "clamp(14px, 12%, 22px)" }} />

                  <div className="relative bg-white rounded-2xl shadow-sm">
                    {/* The user added an image instead of QrCode icon here */}
                    <img src={"/qr-meta-1.png"} alt="default" className="h-full w-full object-contain" />
                  </div>

                  {/* Laser Scanning Line - Simplified shadow */}
                  <div className="absolute left-0 w-full h-0.5 bg-red-500 animate-scanline shadow-[0_0_8px_rgba(239,68,68,0.8)] z-40">
                  </div>
                </div>

                {/* Overlay hint text */}
                <div className="absolute left-0 w-full text-center z-40" style={{ bottom: "12%", paddingLeft: "6%", paddingRight: "6%" }}>
                  <p className="text-zinc-600 font-medium tracking-wide" style={{ fontSize: "clamp(0.5rem, 2.2%, 0.72rem)" }}>Align QR code within frame</p>
                </div>
              </div>

              {/* Screen Glare reflection - simplified, using a simple opacity instead of mix-blend */}
              <div
                className="absolute inset-0 z-50 pointer-events-none opacity-20"
                style={{
                  background: `linear-gradient(${135 + rotation.x + rotation.y}deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)`,
                  transition: isHovering ? "none" : "background 0.5s ease"
                }}
              />

              {/* Home indicator - dark for light mode */}
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 z-40 shadow-sm"
                style={{ bottom: "1.5%", height: "0.6%", minHeight: "4px", width: "33%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

