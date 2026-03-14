import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockReplace = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}))

import { useUser } from "@/hooks/useUser"
import RootLayout from "@/app/(public)/layout"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Public layout", () => {
  it("shows loading indicator while loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true })

    render(<RootLayout>content</RootLayout>)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("redirects to /heists when not loading and user is present", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "123" } as never,
      loading: false,
    })

    render(<RootLayout>content</RootLayout>)

    expect(mockReplace).toHaveBeenCalledWith("/heists")
  })

  it("renders children when not loading and user is null", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false })

    render(<RootLayout>public content</RootLayout>)

    expect(screen.getByText("public content")).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
