import { describe, it, expect } from "vitest"
import { formatTimeRemaining } from "@/utils/formatTimeRemaining"

const base = new Date("2026-01-01T12:00:00Z")

function future(ms: number) {
  return new Date(base.getTime() + ms)
}

function past(ms: number) {
  return new Date(base.getTime() - ms)
}

describe("formatTimeRemaining", () => {
  it("returns days and hours when >= 24h remaining", () => {
    const deadline = future(1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000) // 1d 4h
    expect(formatTimeRemaining(deadline, base)).toBe("1d 4h")
  })

  it("returns hours and minutes when 1–24h remaining", () => {
    const deadline = future(4 * 60 * 60 * 1000 + 42 * 60 * 1000) // 4h 42m
    expect(formatTimeRemaining(deadline, base)).toBe("4h 42m")
  })

  it("returns minutes only when < 1h remaining", () => {
    const deadline = future(42 * 60 * 1000) // 42m
    expect(formatTimeRemaining(deadline, base)).toBe("42m")
  })

  it("returns 0m when deadline is exactly now", () => {
    expect(formatTimeRemaining(base, base)).toBe("0m")
  })

  it("returns Overdue when deadline is in the past", () => {
    const deadline = past(60 * 1000)
    expect(formatTimeRemaining(deadline, base)).toBe("Overdue")
  })

  it("handles boundary of exactly 24h as 1d 0h", () => {
    const deadline = future(24 * 60 * 60 * 1000)
    expect(formatTimeRemaining(deadline, base)).toBe("1d 0h")
  })

  it("handles boundary of exactly 1h as 1h 0m", () => {
    const deadline = future(60 * 60 * 1000)
    expect(formatTimeRemaining(deadline, base)).toBe("1h 0m")
  })
})
