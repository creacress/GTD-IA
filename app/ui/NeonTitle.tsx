import { ReactNode } from "react"

interface NeonTitleProps {
  children: ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
}

export default function NeonTitle({ children, as = "h1", className = "" }: NeonTitleProps) {
  const Tag = as

  return (
    <Tag className={`text-neon drop-shadow-[0_0_10px_#00e0ff] ${className}`}>
      {children}
    </Tag>
  )
}
