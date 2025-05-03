import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { NotificationsProvider } from "@/contexts/notifications-context"

export const metadata = {
  title: "BIAIA - Your Pregnancy Companion",
  description: "A pregnancy companion app to guide you through your journey",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
