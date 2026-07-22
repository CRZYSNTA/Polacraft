export interface StorePromotionSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  collectorRewardThreshold: number;
  premiumRewardThreshold: number;
  loyaltyPointsRatio: number;
  heroTitle: string;
  heroSubtitle: string;
  rewardsEnabled: boolean;
  limitedEditionsEnabled: boolean;
}

export const DEFAULT_STORE_SETTINGS: StorePromotionSettings = {
  shippingFee: 60.0,
  freeShippingThreshold: 499.0,
  collectorRewardThreshold: 899.0,
  premiumRewardThreshold: 1499.0,
  loyaltyPointsRatio: 100.0,
  heroTitle: "Bring Cinema Home.",
  heroSubtitle: "Premium Malayalam Cinema Posters Crafted For Collectors.",
  rewardsEnabled: true,
  limitedEditionsEnabled: true
};

export interface RewardTierStatus {
  unlockedFreeShipping: boolean;
  unlockedCollectorReward: boolean;
  unlockedPremiumReward: boolean;
  unlockedRewardCount: number; // 0, 1, or 2
  currentThreshold: number;
  nextThreshold: number | null;
  remainingAmount: number;
  progressPercentage: number;
  statusMessage: string;
  rewardOptions: Array<{ id: string; label: string; description: string }>;
}

export const REWARD_OPTIONS_LIST = [
  { id: "1xA3", label: "1 × A3 Statement Poster", description: "Choice of any classic or modern A3 poster" },
  { id: "2xA4", label: "2 × A4 Standard Posters", description: "Two A4 prints of your choice" },
  { id: "4xA5", label: "4 × A5 Mini Prints", description: "Four A5 prints for desk / shelf grids" },
  { id: "1xA4_2xA5", label: "1 × A4 + 2 × A5 Combo", description: "One A4 statement and two A5 accent prints" }
];

export function calculateShippingFee(
  subtotal: number,
  settings: StorePromotionSettings = DEFAULT_STORE_SETTINGS
): number {
  if (subtotal <= 0) return 0;
  return subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
}

export function evaluatePromotionEngine(
  subtotal: number,
  settings: StorePromotionSettings = DEFAULT_STORE_SETTINGS
): RewardTierStatus {
  const { freeShippingThreshold, collectorRewardThreshold, premiumRewardThreshold, rewardsEnabled } = settings;

  const unlockedFreeShipping = subtotal >= freeShippingThreshold;
  const unlockedCollectorReward = rewardsEnabled && subtotal >= collectorRewardThreshold;
  const unlockedPremiumReward = rewardsEnabled && subtotal >= premiumRewardThreshold;

  let unlockedRewardCount = 0;
  if (unlockedPremiumReward) unlockedRewardCount = 2;
  else if (unlockedCollectorReward) unlockedRewardCount = 1;

  let currentThreshold = 0;
  let nextThreshold: number | null = freeShippingThreshold;
  let remainingAmount = Math.max(0, freeShippingThreshold - subtotal);
  let progressPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 33.3));

  let statusMessage = `🎁 You're only ₹${Math.ceil(remainingAmount)} away from FREE Shipping.`;

  if (subtotal >= premiumRewardThreshold) {
    currentThreshold = premiumRewardThreshold;
    nextThreshold = null;
    remainingAmount = 0;
    progressPercentage = 100;
    statusMessage = "🏆 Premium Collector Status Unlocked! Select your TWO Free Rewards!";
  } else if (subtotal >= collectorRewardThreshold) {
    currentThreshold = collectorRewardThreshold;
    nextThreshold = premiumRewardThreshold;
    remainingAmount = Math.max(0, premiumRewardThreshold - subtotal);
    progressPercentage = 66.6 + Math.min(33.4, ((subtotal - collectorRewardThreshold) / (premiumRewardThreshold - collectorRewardThreshold)) * 33.4);
    statusMessage = `🎉 Collector Reward Unlocked! Spend ₹${Math.ceil(remainingAmount)} more to unlock 2x Premium Rewards!`;
  } else if (subtotal >= freeShippingThreshold) {
    currentThreshold = freeShippingThreshold;
    nextThreshold = collectorRewardThreshold;
    remainingAmount = Math.max(0, collectorRewardThreshold - subtotal);
    progressPercentage = 33.3 + Math.min(33.3, ((subtotal - freeShippingThreshold) / (collectorRewardThreshold - freeShippingThreshold)) * 33.3);
    statusMessage = `🚚 FREE Shipping Unlocked! Spend ₹${Math.ceil(remainingAmount)} more to unlock a Collector Reward!`;
  }

  return {
    unlockedFreeShipping,
    unlockedCollectorReward,
    unlockedPremiumReward,
    unlockedRewardCount,
    currentThreshold,
    nextThreshold,
    remainingAmount: Math.ceil(remainingAmount),
    progressPercentage: Math.round(progressPercentage),
    statusMessage,
    rewardOptions: REWARD_OPTIONS_LIST
  };
}

export function calculateEarnedLoyaltyPoints(
  totalPaid: number,
  ratio: number = 100.0
): number {
  if (totalPaid <= 0 || ratio <= 0) return 0;
  return Math.floor(totalPaid / ratio);
}
