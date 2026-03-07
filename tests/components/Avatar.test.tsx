import { render, screen } from "@testing-library/react"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders the first letter of a simple name", () => {
    render(<Avatar name="alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("renders the first two uppercase letters for PascalCase names", () => {
    render(<Avatar name="JohnDoe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders only one letter for single-word names", () => {
    render(<Avatar name="Bob" />)
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})
