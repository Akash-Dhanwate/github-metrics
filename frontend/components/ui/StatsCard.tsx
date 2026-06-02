import type { LucideIcon } from "lucide-react"

interface StatsCardProp {
  title: string
  value: string | number
  detail?: string
  icon?: LucideIcon
}

export default function StatsCard({ title, value, detail, icon: Icon }: StatsCardProp) {
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4 transition hover:border-[#8b949e]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-[#8b949e]">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-[#3fb950]" />}
      </div>
      <p className="mt-2 break-words text-2xl font-semibold text-[#e6edf3]">{value ?? "N/A"}</p>
      {detail && <p className="mt-1 text-xs text-[#8b949e]">{detail}</p>}
    </div>
  )
}
