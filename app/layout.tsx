import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WeatherProvider } from "@/context/WeatherContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Smart Mirror Assistant",
  description: "AI-powered smart mirror with face recognition",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WeatherProvider>
            {children}
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}