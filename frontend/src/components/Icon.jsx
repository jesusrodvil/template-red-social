import {
  Bell,
  ChevronRight,
  Heart,
  LogOut,
  MessageCircle,
  Plus,
  Settings,
  Users,
  X,
} from 'lucide-react'

const icons = { Bell, ChevronRight, Heart, LogOut, MessageCircle, Plus, Settings, Users, X }

export default function Icon({ name, size = 20, ...props }) {
  const Component = icons[name]
  if (!Component) return null
  return <Component size={size} aria-hidden="true" {...props} />
}