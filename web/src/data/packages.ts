export const packages = [
  {
    id: "spark",
    name: "Spark",
    entry: 3000,
    returnAmount: 15000,
    elite: false,
  },
  {
    id: "rise",
    name: "Rise",
    entry: 5000,
    returnAmount: 20000,
    elite: false,
  },
  {
    id: "pulse",
    name: "Pulse",
    entry: 10000,
    returnAmount: 40000,
    elite: false,
  },
  {
    id: "elite",
    name: "Elite",
    entry: 25000,
    returnAmount: 100000,
    elite: true,
  },
  {
    id: "prestige",
    name: "Prestige",
    entry: 50000,
    returnAmount: 250000,
    elite: true,
  },
  {
    id: "apex",
    name: "Apex",
    entry: 100000,
    returnAmount: 600000,
    elite: true,
  },
] as const;

export type PackageId = (typeof packages)[number]["id"];

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function dailyClaim(returnAmount: number) {
  return Math.floor(returnAmount / 30);
}
