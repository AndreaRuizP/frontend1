import api from "./client";

// Analytics
export async function getKPIs() {
  const { data } = await api.get("/analytics/kpis");
  return data;
}
export async function getDailyStats(days = 7) {
  const { data } = await api.get(`/analytics/daily?days=${days}`);
  return data;
}

// Users
export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}
export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}

// Containers
export async function getContainers() {
  const { data } = await api.get("/containers");
  return data;
}
export async function createContainer(body) {
  const { data } = await api.post("/containers", body);
  return data;
}
export async function updateContainer(id, body) {
  const { data } = await api.put(`/containers/${id}`, body);
  return data;
}
export async function deleteContainer(id) {
  await api.delete(`/containers/${id}`);
}

// Challenges
export async function getChallengesAdmin() {
  const { data } = await api.get("/gamification/challenges/all");
  return data;
}
export async function createChallenge(body) {
  const { data } = await api.post("/gamification/challenges", body);
  return data;
}
export async function updateChallenge(id, body) {
  const { data } = await api.put(`/gamification/challenges/${id}`, body);
  return data;
}
export async function deleteChallenge(id) {
  await api.delete(`/gamification/challenges/${id}`);
}

// Marketplace products
export async function getMarketplaceAdmin() {
  const { data } = await api.get("/gamification/marketplace/all");
  return data;
}
export async function createMarketplaceItem(body) {
  const { data } = await api.post("/gamification/marketplace", body);
  return data;
}
export async function updateMarketplaceItem(id, body) {
  const { data } = await api.put(`/gamification/marketplace/${id}`, body);
  return data;
}
export async function deleteMarketplaceItem(id) {
  await api.delete(`/gamification/marketplace/${id}`);
}
