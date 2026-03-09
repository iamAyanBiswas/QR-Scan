import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight, Cloud, Zap, Infinity as InfinityIcon, CheckCircle2, Leaf, Edit3, LineChart, CopyPlus, Printer, Edit } from "lucide-react";
import { HeroGraph } from "@/components/custom/hero-graph";
import { PhoneScanner } from "@/components/custom/phone-scanner";
import QRCreateStepShowcase from "@/components/block/qr-create-step-showcase";

export default function Home() {
  return (
    <div className="bg-background text-foreground selection:bg-primary/20 overflow-x-hidden min-h-screen">


      {/* Hero Section */}
      <section className="relative isolate pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background grid-bg mask-[linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl">
          <div className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section main div*/}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-8">
            {/* Hero Content */}
            <div className="w-full max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left lg:w-[45%]">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Edit destinations. <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">Keep the code.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-lg">
                The enterprise standard for dynamic QR management. Track every scan, retarget users, and update campaigns instantly without reprinting collateral.
              </p>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Link className="rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-all" href="/signup">
                  Start for free
                </Link>
                <Link className="text-sm font-semibold leading-6 text-foreground flex items-center gap-1 group" href="#">
                  Contact Sales <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            {/* Hero Visual */}
            <div className="relative w-full max-w-125 lg:w-[50%] lg:max-w-none">
              {/* Glass Container Mockup */}
              <div className="relative z-10 rounded-2xl border border-border bg-background/50 shadow-lg p-6 overflow-hidden glass-panel">
                {/* Top Bar Mockup */}
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="h-2 w-20 rounded-full bg-muted"></div>
                </div>
                {/* Inner UI Layout */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Sidebar Mockup */}
                  <div className="col-span-3 hidden sm:flex flex-col gap-3 border-r border-border pr-4">
                    <div className="h-8 w-full rounded bg-muted/50"></div>
                    <div className="h-8 w-full rounded bg-primary/10 border-l-2 border-primary"></div>
                    <div className="h-8 w-full rounded bg-muted/50"></div>
                  </div>
                  {/* Main Chart Area */}
                  <div className="col-span-12 sm:col-span-9 flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="text-xs text-muted-foreground font-mono">CAMPAIGN: SUMMER_PROMO</div>
                        <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                          12,450
                          <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">+12%</span>
                        </div>
                      </div>
                      <div className="h-8 w-24 rounded bg-muted/50"></div>
                    </div>
                    {/* Chart Visualization */}
                    <div className="h-32 w-full bg-linear-to-b from-primary/5 to-transparent rounded-lg border border-primary/10 relative overflow-hidden group">

                      {/* Simulated Graph Line */}
                      <HeroGraph />

                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="h-16 rounded bg-muted/30 border border-border/50"></div>
                      <div className="h-16 rounded bg-muted/30 border border-border/50"></div>
                    </div>
                  </div>
                </div>
                {/* Floating Notification Toast */}
                <div className="absolute bottom-4 right-4 bg-foreground text-background text-xs py-2 px-3 rounded shadow-lg flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Destination updated
                </div>
              </div>

              {/* Floating Phone Element */}
              <PhoneScanner className="absolute -bottom-20 -left-16 sm:-bottom-16 sm:-left-20 md:-bottom-16 md:-left-20 lg:-bottom-24 lg:-left-20 z-20 origin-bottom-left transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-white/10 bg-black overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-white/75 uppercase tracking-wider mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex overflow-hidden group mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]">
            <div className="flex w-max animate-infinite-scroll group-hover:paused">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex shrink-0 items-center justify-around gap-8 md:gap-16 px-4 md:px-8 opacity-70 grayscale group-hover:grayscale-0 transition-[opacity,filter] duration-500">
                  <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-white transition-colors cursor-pointer">
                    <Cloud className="w-6 h-6" />
                    <span>Vertex</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-bold font-serif text-white hover:text-green-400 transition-colors cursor-pointer">
                    <Leaf className="w-6 h-6" />
                    <span>Optima</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white hover:text-amber-400 transition-colors cursor-pointer">
                    <Zap className="w-6 h-6" />
                    <span>Nexa</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-bold uppercase text-white hover:text-indigo-400 transition-colors cursor-pointer">
                    <InfinityIcon className="w-6 h-6" />
                    <span>Aethel</span>
                  </div>
                  <div className="flex items-center gap-2 text-xl font-bold italic text-white hover:text-blue-400 transition-colors cursor-pointer">
                    <LineChart className="w-6 h-6" />
                    <span>Quantis</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Visualization Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Create your QR code in 4 simple steps</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From choosing a destination to tracking scans, we've made the process intuitive and fast.
            </p>
          </div>
          
          <QRCreateStepShowcase />
          
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Ready to take control of your offline traffic?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
            Join thousands of marketers using QR Scan to bridge the physical and digital worlds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link className="rounded-lg bg-background px-6 py-3.5 text-sm font-semibold text-primary shadow-sm hover:bg-background/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-background transition-all" href="/signup">
              Get started for free
            </Link>
            <Link className="text-sm font-semibold leading-6 text-primary-foreground group flex items-center gap-1" href="#">
              Contact Sales <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <QrCode className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-foreground">QR Scan</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 QR Scan Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="#">Privacy</Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="#">Terms</Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="#">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
