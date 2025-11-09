import type React from "react"
import { Roboto_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { V0Provider } from "@/lib/v0-context"
import { FlowchartProvider } from "@/lib/context/flowchart-context"
import localFont from "next/font/local"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"
import IntroWrapper from "@/components/intro/intro-wrapper"
import LayoutContent from "@/components/layout-content"
import { Toaster } from "@/components/ui/toaster"

const mockData = mockDataJson as MockData

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

const rebelGrotesk = localFont({
  src: "../public/fonts/Rebels-Fett.woff2",
  variable: "--font-rebels",
  display: "swap",
})

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false

export const metadata: Metadata = {
  title: {
    template: "%s – M.O.N.K.Y OS",
    default: "M.O.N.K.Y OS",
  },
  description: "The ultimate OS for rebels. Making the web for brave individuals.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/fonts/Rebels-Fett.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${rebelGrotesk.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <IntroWrapper>
              <V0Provider isV0={isV0}>
                <FlowchartProvider>
                  <SidebarProvider>
                    {/* Mobile Header - only visible on mobile */}
                    <MobileHeader mockData={mockData} />

                    {/* Desktop Layout */}
                    <LayoutContent mockData={mockData}>{children}</LayoutContent>

                    {/* Toaster for notifications */}
                    <Toaster />
                  </SidebarProvider>
                </FlowchartProvider>
              </V0Provider>
            </IntroWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
