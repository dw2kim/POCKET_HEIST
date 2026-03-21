import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard"
import type { Heist } from "@/types/firestore"

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string, children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock("@/utils/formatTimeRemaining", () => ({
  formatTimeRemaining: vi.fn(),
}))

import { formatTimeRemaining } from "@/utils/formatTimeRemaining"
const mockFormatTimeRemaining = vi.mocked(formatTimeRemaining)

const mockHeist: Heist = {
  id: "heist-1",
  title: "The Diamond Job",
  description: "Steal the diamond",
  createdBy: "uid-1",
  createdByCodeName: "ShadowFox",
  assignedTo: "uid-2",
  assignedToCodeName: "GhostByte",
  createdAt: new Date("2026-01-01"),
  deadline: new Date("2026-02-01"),
  finalStatus: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  mockFormatTimeRemaining.mockReturnValue("4h 42m")
})

describe("HeistCard", () => {
  it("renders the card as a link to /heists/[id]", () => {
    render(<HeistCard heist={mockHeist} />)

    const link = screen.getByRole("link")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/heists/heist-1")
  })

  it("renders assignedToCodeName in the To: row", () => {
    render(<HeistCard heist={mockHeist} />)

    expect(screen.getByText("To:")).toBeInTheDocument()
    expect(screen.getByText("GhostByte")).toBeInTheDocument()
  })

  it("renders createdByCodeName in the By: row", () => {
    render(<HeistCard heist={mockHeist} />)

    expect(screen.getByText("By:")).toBeInTheDocument()
    expect(screen.getByText("ShadowFox")).toBeInTheDocument()
  })

  it("shows Overdue when deadline is in the past", () => {
    mockFormatTimeRemaining.mockReturnValue("Overdue")
    render(<HeistCard heist={mockHeist} />)

    expect(screen.getByText("Overdue")).toBeInTheDocument()
  })

  it("shows formatted time remaining when deadline is in the future", () => {
    mockFormatTimeRemaining.mockReturnValue("4h 42m")
    render(<HeistCard heist={mockHeist} />)

    expect(screen.getByText("4h 42m")).toBeInTheDocument()
  })

  it("shows Unknown Agent fallback when codenames are empty", () => {
    const heist = { ...mockHeist, assignedToCodeName: "", createdByCodeName: "" }
    render(<HeistCard heist={heist} />)

    expect(screen.getAllByText("Unknown Agent")).toHaveLength(2)
  })
})

describe("HeistCardSkeleton", () => {
  it("renders without crashing and shows no real text content", () => {
    const { container } = render(<HeistCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
