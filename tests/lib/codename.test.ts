import { generateCodename, adjectives, roles, nouns } from "@/lib/codename"

describe("generateCodename", () => {
  it("returns a string composed of three PascalCase words", () => {
    const codename = generateCodename()

    const words = codename.match(/[A-Z][a-z]+/g)
    expect(words).not.toBeNull()
    expect(words).toHaveLength(3)
  })

  it("uses words from the expected word sets", () => {
    for (let i = 0; i < 50; i++) {
      const codename = generateCodename()
      const words = codename.match(/[A-Z][a-z]+/g)!

      expect(adjectives).toContain(words[0])
      expect(roles).toContain(words[1])
      expect(nouns).toContain(words[2])
    }
  })

  it("produces varied results across multiple calls", () => {
    const results = new Set<string>()
    for (let i = 0; i < 20; i++) {
      results.add(generateCodename())
    }
    expect(results.size).toBeGreaterThan(1)
  })
})
