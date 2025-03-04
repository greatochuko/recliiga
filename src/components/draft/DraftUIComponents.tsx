
import { Star } from 'lucide-react';

export const JerseyIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8.5V20.5H4V8.5L8 4.5H16L20 8.5Z" stroke={color === '#FFFFFF' ? '#000000' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 4.5H16V8.5H8V4.5Z" stroke={color === '#FFFFFF' ? '#000000' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PlayerRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center text-[#FF7A00] font-bold">
    <span className="mr-1">{rating.toFixed(2)}</span>
    <Star className="w-4 h-4 fill-[#FF7A00]" />
  </div>
);

export const colorOptions: { name: string; value: string }[] = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
];
