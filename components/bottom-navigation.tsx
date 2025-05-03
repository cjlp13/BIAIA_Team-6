import Link from "next/link"
import { Home, Calendar, MessageCircle, Book, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeItem: "home" | "weekly" | "chat" | "journal" | "settings"
}

export function BottomNavigation({ activeItem }: BottomNavigationProps) {
  return (
    <nav className="sticky bottom-0 bg-background border-t border-border py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-around">
          <Link
            href="/"
            className={`flex flex-col items-center ${activeItem === "home" ? "text-pink-600" : "text-muted-foreground hover:text-pink-600"}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/weekly"
            className={`flex flex-col items-center ${activeItem === "weekly" ? "text-pink-600" : "text-muted-foreground hover:text-pink-600"}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1">Weekly</span>
          </Link>
          <Link
            href="/chat"
            className={`flex flex-col items-center ${activeItem === "chat" ? "text-pink-600" : "text-muted-foreground hover:text-pink-600"}`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          <Link
            href="/journal"
            className={`flex flex-col items-center ${activeItem === "journal" ? "text-pink-600" : "text-muted-foreground hover:text-pink-600"}`}
          >
            <Book className="w-6 h-6" />
            <span className="text-xs mt-1">Journal</span>
          </Link>
          <Link
            href="/settings"
            className={`flex flex-col items-center ${activeItem === "settings" ? "text-pink-600" : "text-muted-foreground hover:text-pink-600"}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
