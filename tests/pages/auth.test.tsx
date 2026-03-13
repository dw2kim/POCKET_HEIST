import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "@/app/(public)/login/page"
import SignupPage from "@/app/(public)/signup/page"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href} {...props}>{children}</a>,
}))

const mockCreateUser = vi.fn()
const mockUpdateProfile = vi.fn()
const mockSignIn = vi.fn()

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
}))

const mockSetDoc = vi.fn()
const mockDoc = vi.fn()

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
}))

vi.mock("@/lib/firebase/config", () => ({
  getClientAuth: () => ({}),
  getClientDb: () => ({}),
}))

vi.mock("@/lib/codename", () => ({
  generateCodename: () => "ShadowFoxHeist",
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("LoginPage", () => {
  it("renders email input, password input, and submit button", () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
  })

  it("has a link to the signup page", () => {
    render(<LoginPage />)
    const link = screen.getByRole("link", { name: /sign up/i })
    expect(link).toHaveAttribute("href", "/signup")
  })

  it("shows welcome message with codename on successful login", async () => {
    mockSignIn.mockResolvedValue({
      user: { displayName: "ShadowFoxHeist" },
    })

    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "secret123")
    await user.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/welcome back, shadowfoxheist/i)).toBeInTheDocument()
    })
  })

  it("shows friendly error on wrong credentials", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/invalid-credential" })

    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "wrong")
    await user.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it("calls signInWithEmailAndPassword with correct args", async () => {
    mockSignIn.mockResolvedValue({
      user: { displayName: "TestUser" },
    })

    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "secret123")
    await user.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({}, "test@example.com", "secret123")
    })
  })
})

describe("SignupPage", () => {
  it("renders email, password, confirm password, and submit button", () => {
    render(<SignupPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument()
  })

  it("has a link to the login page", () => {
    render(<SignupPage />)
    const link = screen.getByRole("link", { name: /log in/i })
    expect(link).toHaveAttribute("href", "/login")
  })

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.type(screen.getByLabelText(/confirm password/i), "different456")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  it("calls Firebase auth and Firestore on successful signup, then redirects", async () => {
    const mockUser = { uid: "abc123" }
    mockCreateUser.mockResolvedValue({ user: mockUser })
    mockUpdateProfile.mockResolvedValue(undefined)
    mockSetDoc.mockResolvedValue(undefined)
    mockDoc.mockReturnValue("users/abc123")

    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText(/email/i), "test@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.type(screen.getByLabelText(/confirm password/i), "password123")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({}, "test@example.com", "password123")
    })

    expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName: "ShadowFoxHeist" })
    expect(mockSetDoc).toHaveBeenCalledWith("users/abc123", { id: "abc123", codename: "ShadowFoxHeist" })
    expect(mockPush).toHaveBeenCalledWith("/heists")
  })

  it("displays a friendly error when Firebase auth fails", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/email-already-in-use" })

    const user = userEvent.setup()
    render(<SignupPage />)

    await user.type(screen.getByLabelText(/email/i), "taken@example.com")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.type(screen.getByLabelText(/confirm password/i), "password123")
    await user.click(screen.getByRole("button", { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/an account with this email already exists/i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe("Password toggle", () => {
  it("toggles password visibility", async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: /show password/i }))
    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: /hide password/i }))
    expect(passwordInput).toHaveAttribute("type", "password")
  })
})
