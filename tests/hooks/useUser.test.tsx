import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUser } from "@/hooks/useUser"

let authCallback: (user: unknown) => void

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, cb: (user: unknown) => void) => {
    authCallback = cb
    return vi.fn()
  },
}))

vi.mock("@/lib/firebase/config", () => ({
  getClientAuth: () => ({}),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useUser", () => {
  it("returns loading: true before the callback fires", () => {
    const { result } = renderHook(() => useUser())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
  })

  it("returns user and loading: false after callback fires with a user", () => {
    const { result } = renderHook(() => useUser())

    act(() => authCallback({ uid: "123", displayName: "ShadowFox" }))

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual({ uid: "123", displayName: "ShadowFox" })
  })

  it("returns null user and loading: false after callback fires with null", () => {
    const { result } = renderHook(() => useUser())

    act(() => authCallback(null))

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
