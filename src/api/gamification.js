import api from "./client";

export async function getBalance() {
  const { data } = await api.get("/gamification/points/balance");
  return data; // { balance, total }
}

export async function getTransactions() {
  const { data } = await api.get("/gamification/points/transactions");
  return data; // [{ type, amount, description, createdAt, ... }]
}

export async function scanQR(qrString) {
  const { data } = await api.post("/gamification/points/scan", { qrString });
  return data; // { pointsEarned, balance, containerId }
}

export async function getChallengesProgress() {
  const { data } = await api.get("/gamification/challenges/progress");
  return data; // [{ challengeId, challenge: { name, description, pointsReward, target }, progress, completed }]
}

export async function getMarketplaceItems() {
  const { data } = await api.get("/gamification/marketplace");
  return data;
}

export async function redeemItem(itemId, quantity = 1) {
  const { data } = await api.post("/gamification/marketplace/redeem", { itemId, quantity });
  return data;
}
