
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export const popularCountryCodes = [
  { code: 'other', country: 'Other (input area code manually)', abbr: 'OTH', flag: '🌐' },
  { code: '+1', country: 'United States / Canada', abbr: 'US/CA', flag: '🇺🇸🇨🇦' },
  { code: '+44', country: 'United Kingdom', abbr: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', abbr: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', abbr: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', abbr: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'France', abbr: 'FR', flag: '🇫🇷' },
  { code: '+86', country: 'China', abbr: 'CN', flag: '🇨🇳' },
  { code: '+52', country: 'Mexico', abbr: 'MX', flag: '🇲🇽' },
  { code: '+81', country: 'Japan', abbr: 'JP', flag: '🇯🇵' },
  { code: '+7', country: 'Russia', abbr: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', abbr: 'BR', flag: '🇧🇷' },
  { code: '+39', country: 'Italy', abbr: 'IT', flag: '🇮🇹' },
  { code: '+972', country: 'Israel', abbr: 'IL', flag: '🇮🇱' },
];

interface CountryCodeSelectProps {
  countryCode: typeof popularCountryCodes[0];
  customCountryCode: string;
  onCountryCodeChange: (code: any) => void;
  onCustomCountryCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CountryCodeSelect({
  countryCode,
  customCountryCode,
  onCountryCodeChange,
  onCustomCountryCodeChange
}: CountryCodeSelectProps) {
  return (
    <>
      <Select onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-[120px] text-sm">
          <SelectValue placeholder={`${countryCode.flag} ${countryCode.abbr}`} />
        </SelectTrigger>
        <SelectContent>
          {popularCountryCodes.map((code) => (
            <SelectItem key={code.code} value={code.code}>
              {code.flag} {code.country} ({code.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {countryCode.code === 'other' ? (
        <Input
          type="text"
          placeholder="Enter Area Code"
          className="w-[100px] text-sm"
          value={customCountryCode}
          onChange={onCustomCountryCodeChange}
        />
      ) : null}
    </>
  );
}
