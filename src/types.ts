
export interface Platform {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  bonus: string;
  image: string;
  tags: string[];
  airdropPotential?: string;
  users: string;
  timeLeft?: string;
}
