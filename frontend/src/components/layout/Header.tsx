import { Search, Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything... (Ctrl+K)"
            className="w-full h-10 rounded-lg border bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <select className="h-9 rounded-md border bg-background px-3 text-sm">
          <option>TechCorp Solutions</option>
          <option>GrowthCo Marketing</option>
          <option>MarketPro Analytics</option>
        </select>
        <button className="relative p-2 rounded-lg hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  )
}
