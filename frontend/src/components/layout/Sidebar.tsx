import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Building2, Search, Key, Link, Swords,
  FileText, Image, Share2, Megaphone, Target, BarChart3,
  Bot, Bell, Settings, ChevronLeft, ChevronRight, Rocket, Brain, BookOpen, LogOut, Bug
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seo-by-ai', icon: Brain, label: 'SEO By AI' },
  { to: '/clients', icon: Building2, label: 'Clients' },
  { to: '/seo-audit', icon: Search, label: 'SEO Audit' },
  { to: '/keywords', icon: Key, label: 'Keywords' },
  { to: '/backlinks', icon: Link, label: 'Backlinks' },
  { to: '/competitors', icon: Swords, label: 'Competitors' },
  { to: '/content-studio', icon: FileText, label: 'Content Studio' },
  { to: '/image-studio', icon: Image, label: 'Image Studio' },
  { to: '/social-media', icon: Share2, label: 'Social Media' },
  { to: '/ads', icon: Megaphone, label: 'Ads Manager' },
  { to: '/campaigns', icon: Target, label: 'Campaigns' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/documentation', icon: BookOpen, label: 'Documentation' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 border-r border-slate-800',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
          <Rocket className="w-5 h-5" />
        </div>
        {!collapsed && <span className="text-lg font-bold">MarketingOS</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-2 space-y-1">
        <NavLink
          to="/bug-report"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          )}
        >
          <Bug className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Bug Report</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 w-full transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
