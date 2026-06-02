import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GitHub Metrics",
  description: "GitHub-style analytics for developer profiles, repositories, and contributions",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
        {children}
      </body>
    </html>
  )
}
