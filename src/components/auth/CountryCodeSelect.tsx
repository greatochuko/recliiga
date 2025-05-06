export const popularCountryCodes = [
  {
    code: "other",
    country: "Other (input area code manually)",
    abbr: "OTH",
    flag: "🌐",
  },
  {
    code: "+1",
    country: "United States / Canada",
    abbr: "US/CA",
    flag: "🇺🇸🇨🇦",
  },
  { code: "+44", country: "United Kingdom", abbr: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", abbr: "IN", flag: "🇮🇳" },
  { code: "+61", country: "Australia", abbr: "AU", flag: "🇦🇺" },
  { code: "+49", country: "Germany", abbr: "DE", flag: "🇩🇪" },
  { code: "+33", country: "France", abbr: "FR", flag: "🇫🇷" },
  { code: "+86", country: "China", abbr: "CN", flag: "🇨🇳" },
  { code: "+52", country: "Mexico", abbr: "MX", flag: "🇲🇽" },
  { code: "+81", country: "Japan", abbr: "JP", flag: "🇯🇵" },
  { code: "+7", country: "Russia", abbr: "RU", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", abbr: "BR", flag: "🇧🇷" },
  { code: "+39", country: "Italy", abbr: "IT", flag: "🇮🇹" },
  { code: "+972", country: "Israel", abbr: "IL", flag: "🇮🇱" },
];

interface CountryCodeSelectProps {
  countryCode: (typeof popularCountryCodes)[0];
  customCountryCode: string;
  onCountryCodeChange: (code: string) => void;
  onCustomCountryCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CountryCodeSelect({
  countryCode,
  customCountryCode,
  onCountryCodeChange,
  onCustomCountryCodeChange,
}: CountryCodeSelectProps) {
  return (
    <>
      <select
        className="w-[120px] rounded-md border border-gray-300 p-2 text-sm ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
        value={countryCode.code}
        onChange={(e) => onCountryCodeChange(e.target.value)}
      >
        {popularCountryCodes.map((code) => (
          <option
            key={code.code}
            value={code.code}
            style={{
              backgroundImage: `url(https://flagcdn.com/w320/${code.abbr.toLowerCase()}.png)`,
              backgroundSize: "20px 12px",
              backgroundRepeat: "no-repeat",
              paddingLeft: "25px",
            }}
          >
            {code.flag} {code.country} ({code.code})
          </option>
        ))}
      </select>
      {countryCode.code === "other" && (
        <input
          type="text"
          className="w-[60px] rounded-md border border-gray-300 p-2 text-sm ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
          placeholder="Enter Area Code"
          value={customCountryCode}
          onChange={onCustomCountryCodeChange}
        />
      )}
    </>
  );
}
