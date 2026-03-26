export const PLANS = {
  pro: { name: "Pro", priceId: process.env.STRIPE_PRO_PRICE_ID!, price: 29 },
  team: { name: "Team", priceId: process.env.STRIPE_TEAM_PRICE_ID!, price: 99 },
};
