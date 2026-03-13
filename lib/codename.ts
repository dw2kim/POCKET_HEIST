export const adjectives = [
  "Shadow",
  "Silent",
  "Phantom",
  "Crimson",
  "Rogue",
  "Ghost",
  "Midnight",
  "Velvet",
  "Iron",
  "Neon",
]

export const roles = [
  "Fox",
  "Viper",
  "Hawk",
  "Wolf",
  "Cobra",
  "Lynx",
  "Raven",
  "Jackal",
  "Panther",
  "Falcon",
]

export const nouns = [
  "Heist",
  "Vault",
  "Cipher",
  "Gambit",
  "Blitz",
  "Scheme",
  "Hustle",
  "Caper",
  "Ploy",
  "Racket",
]

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateCodename(): string {
  return `${pick(adjectives)}${pick(roles)}${pick(nouns)}`
}
