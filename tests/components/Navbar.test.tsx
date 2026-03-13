import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

// component imports
import Navbar from "@/components/Navbar"

let authCallback: (user: unknown) => void

const mockSignOut = vi.fn()

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: (_auth: unknown, cb: (user: unknown) => void) => {
    authCallback = cb
    cb(null)
    return vi.fn()
  },
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

vi.mock("@/lib/firebase/config", () => ({
  getClientAuth: () => ({}),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Navbar", () => {
  it("renders the main heading", () => {
    render(<Navbar />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)

    const createLink = screen.getByRole("link", { name: /create heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("does not show logout button when no user is signed in", () => {
    render(<Navbar />)

    expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument()
  })

  it("shows logout button when user is signed in", () => {
    render(<Navbar />)

    act(() => authCallback({ displayName: "ShadowFox" }))

    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument()
  })

  it("shows the user's codename when signed in", () => {
    render(<Navbar />)

    act(() => authCallback({ displayName: "ShadowFox" }))

    expect(screen.getByText("ShadowFox")).toBeInTheDocument()
  })

  it("calls signOut when logout button is clicked", async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    act(() => authCallback({ displayName: "ShadowFox" }))

    await user.click(screen.getByRole("button", { name: /log out/i }))

    expect(mockSignOut).toHaveBeenCalledWith({})
  })
})
