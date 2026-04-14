interface CountryFlagProps {
  countryCode: string
  className?: string
}

const countryNames: Record<string, string> = {
  // European source countries
  BE: "Belgium",
  DK: "Denmark",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  IE: "Ireland",
  IT: "Italy",
  NO: "Norway",
  ES: "Spain",
  SE: "Sweden",
  // African and Middle Eastern destination countries
  DJ: "Djibouti",
  ET: "Ethiopia",
  IN: "India",
  KE: "Kenya",
  LY: "Libya",
  NG: "Nigeria",
  SA: "Saudi Arabia",
  SO: "Somalia",
  SL: "Somaliland",
  ZA: "South Africa",
  SS: "South Sudan",
  TZ: "Tanzania",
  TR: "Turkey",
  UG: "Uganda",
}

const countryFlags: Record<string, string> = {
  // European source countries
  BE: "🇧🇪",
  DK: "🇩🇰",
  FI: "🇫🇮",
  FR: "🇫🇷",
  DE: "🇩🇪",
  GR: "🇬🇷",
  IE: "🇮🇪",
  IT: "🇮🇹",
  NO: "🇳🇴",
  ES: "🇪🇸",
  SE: "🇸🇪",
  // African and Middle Eastern destination countries
  DJ: "🇩🇯",
  ET: "🇪🇹",
  IN: "🇮🇳",
  KE: "🇰🇪",
  LY: "🇱🇾",
  NG: "🇳🇬",
  SA: "🇸🇦",
  SO: "🇸🇴",
  SL: "🏴",
  ZA: "🇿🇦",
  SS: "🇸🇸",
  TZ: "🇹🇿",
  TR: "🇹🇷",
  UG: "🇺🇬",
}

export function CountryFlag({ countryCode, className = "text-2xl" }: CountryFlagProps) {
  return <span className={className}>{countryFlags[countryCode] || countryCode}</span>
}

export function getCountryName(code: string): string {
  return countryNames[code] || code
}
