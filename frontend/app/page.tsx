import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-4xl font-bold">
        GitHub Metrics Dashboard
      </h1>

      <Button>
        Login with GitHub
      </Button>
    </div>
  )
}