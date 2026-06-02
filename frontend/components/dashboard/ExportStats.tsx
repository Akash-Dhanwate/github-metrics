"use client"

import { Download, Printer } from "lucide-react"
import type { GithubProfile } from "@/lib/types"

interface ExportStatsProps {
  data: GithubProfile
}

export default function ExportStats({ data }: ExportStatsProps) {
  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${data.username}-github-stats.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const printSummary = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={downloadJson}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#238636] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2ea043]"
      >
        <Download className="h-4 w-4" />
        Download JSON
      </button>
      <button
        onClick={printSummary}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-semibold text-[#e6edf3] transition hover:border-[#8b949e] hover:bg-[#30363d]"
      >
        <Printer className="h-4 w-4" />
        Print summary
      </button>
    </div>
  )
}
