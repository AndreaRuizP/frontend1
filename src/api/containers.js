import api from "./client";

export async function getContainers() {
  const { data } = await api.get("/containers");
  return data;
}

export async function getNearbyContainers(latitude, longitude, radiusKm = 10) {
  const { data } = await api.get("/containers/nearby", {
    params: { latitude, longitude, radiusKm },
  });
  return data;
}
