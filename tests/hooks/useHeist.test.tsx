import { renderHook, act } from "@testing-library/react"
import { vi, beforeEach, describe, it, expect } from "vitest"
import { useHeist } from "@/hooks/useHeist"

let snapshotCallback: (snapshot: { docs: { data: () => unknown }[] }) => void
const unsubscribeMock = vi.fn()

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ withConverter: vi.fn(() => "converted-col") })),
  query: vi.fn(() => "mock-query"),
  where: vi.fn(),
  onSnapshot: vi.fn((_q, cb) => {
    snapshotCallback = cb
    return unsubscribeMock
  }),
  Timestamp: { now: () => "mock-timestamp" },
}))

vi.mock("@/lib/firebase/config", () => ({
  getClientDb: () => ({}),
}))

const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}))

const mockHeist = { id: "h1", title: "The Diamond Job", createdBy: "uid-1", assignedTo: "uid-2", deadline: new Date(), finalStatus: null }

beforeEach(() => {
  vi.clearAllMocks()
  mockUseUser.mockReturnValue({ user: { uid: "uid-1" }, loading: false })
})

describe("useHeist", () => {
  it("returns loading: true before snapshot resolves", () => {
    const { result } = renderHook(() => useHeist("active"))

    expect(result.current.loading).toBe(true)
    expect(result.current.heists).toEqual([])
  })

  it("returns heists and loading: false after snapshot fires", () => {
    const { result } = renderHook(() => useHeist("active"))

    act(() => snapshotCallback({ docs: [{ data: () => mockHeist }] }))

    expect(result.current.loading).toBe(false)
    expect(result.current.heists).toEqual([mockHeist])
  })

  it("returns empty array when no docs match", () => {
    const { result } = renderHook(() => useHeist("expired"))

    act(() => snapshotCallback({ docs: [] }))

    expect(result.current.loading).toBe(false)
    expect(result.current.heists).toEqual([])
  })

  it("calls unsubscribe on unmount", () => {
    const { unmount } = renderHook(() => useHeist("assigned"))

    act(() => snapshotCallback({ docs: [] }))
    unmount()

    expect(unsubscribeMock).toHaveBeenCalledOnce()
  })
})
