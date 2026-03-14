import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockReplace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}))

vi.mock("@/components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}))

import { useUser } from "@/hooks/useUser"
import HeistsLayout from "@/app/(dashboard)/layout"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Dashboard layout", () => {
  it("shows loading indicator while loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true })

    render(<HeistsLayout>content</HeistsLayout>)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("redirects to /login when not loading and user is null", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false })

    render(<HeistsLayout>content</HeistsLayout>)

    expect(mockReplace).toHaveBeenCalledWith("/login")
  })

  it("renders children when not loading and user is present", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "123" } as never,
      loading: false,
    })

    render(<HeistsLayout>dashboard content</HeistsLayout>)

    expect(screen.getByText("dashboard content")).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
