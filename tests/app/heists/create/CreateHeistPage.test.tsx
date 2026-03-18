import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import CreateHeistPage from "@/app/(dashboard)/heists/create/page"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockAddDoc = vi.fn()
const mockCollection = vi.fn()
const mockServerTimestamp = vi.fn(() => ({ _type: "serverTimestamp" }))

vi.mock("firebase/firestore", () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  serverTimestamp: () => mockServerTimestamp(),
  getDocs: vi.fn(),
}))

vi.mock("@/lib/firebase/config", () => ({
  getClientAuth: () => ({}),
  getClientDb: () => ({}),
}))

const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}))

const mockUseUsers = vi.fn()
vi.mock("@/hooks/useUsers", () => ({
  useUsers: () => mockUseUsers(),
}))

const defaultUser = { uid: "user1", displayName: "ShadowFoxHeist" }
const otherUsers = [
  { id: "user2", codename: "NeonViper" },
  { id: "user3", codename: "IronHawk" },
]

beforeEach(() => {
  vi.clearAllMocks()
  mockUseUser.mockReturnValue({ user: defaultUser, loading: false })
  mockUseUsers.mockReturnValue({ users: otherUsers, loading: false })
})

describe("CreateHeistPage", () => {
  it("renders title input, description textarea, assignee dropdown, and submit button", () => {
    render(<CreateHeistPage />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assign to/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create heist/i })).toBeInTheDocument()
  })

  it("populates the dropdown with other users", () => {
    render(<CreateHeistPage />)
    expect(screen.getByRole("option", { name: "NeonViper" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "IronHawk" })).toBeInTheDocument()
  })

  it("shows 'no other agents' message when users list is empty", () => {
    mockUseUsers.mockReturnValue({ users: [], loading: false })
    render(<CreateHeistPage />)
    expect(screen.getByText(/no other agents available/i)).toBeInTheDocument()
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument()
  })

  it("shows loading state for users and disables dropdown", () => {
    mockUseUsers.mockReturnValue({ users: [], loading: true })
    render(<CreateHeistPage />)
    const select = screen.getByRole("combobox")
    expect(select).toBeDisabled()
    expect(screen.getByText(/loading agents/i)).toBeInTheDocument()
  })

  it("submits heist with correct data and redirects to /heists", async () => {
    mockAddDoc.mockResolvedValue({ id: "newHeist1" })
    mockCollection.mockReturnValue("heists-ref")

    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(screen.getByLabelText(/title/i), "Steal the printer")
    await user.type(screen.getByLabelText(/description/i), "Find the printer and hide it")
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user2")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(
        "heists-ref",
        expect.objectContaining({
          title: "Steal the printer",
          description: "Find the printer and hide it",
          createdBy: "user1",
          createdByCodeName: "ShadowFoxHeist",
          assignedTo: "user2",
          assignedToCodeName: "NeonViper",
          finalStatus: null,
        }),
      )
    })

    expect(mockPush).toHaveBeenCalledWith("/heists")
  })

  it("shows an inline error message when addDoc fails", async () => {
    mockAddDoc.mockRejectedValue(new Error("Firestore error"))

    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(screen.getByLabelText(/title/i), "Test Heist")
    await user.type(screen.getByLabelText(/description/i), "Test description")
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user2")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to create heist/i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("disables the submit button while submitting", async () => {
    let resolve: () => void
    mockAddDoc.mockReturnValue(new Promise<void>((r) => { resolve = r }))

    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(screen.getByLabelText(/title/i), "Test")
    await user.type(screen.getByLabelText(/description/i), "Test desc")
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user2")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled()

    resolve!()
    await waitFor(() => expect(mockPush).toHaveBeenCalled())
  })

  it("falls back to 'Unknown Agent' when displayName is null", async () => {
    mockUseUser.mockReturnValue({ user: { uid: "user1", displayName: null }, loading: false })
    mockAddDoc.mockResolvedValue({ id: "newHeist1" })
    mockCollection.mockReturnValue("heists-ref")

    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(screen.getByLabelText(/title/i), "Test")
    await user.type(screen.getByLabelText(/description/i), "Test desc")
    await user.selectOptions(screen.getByLabelText(/assign to/i), "user2")
    await user.click(screen.getByRole("button", { name: /create heist/i }))

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ createdByCodeName: "Unknown Agent" }),
      )
    })
  })
})
