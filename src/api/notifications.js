import api from "./client";

export async function getNotifications() {
  const { data } = await api.get("/notifications");
  return data; // { notifications: [...], unread: number }
}

export async function markAsRead(id) {
  await api.put(`/notifications/${id}/read`);
}

export async function markAllAsRead() {
  await api.put("/notifications/read-all");
}

export async function deleteNotification(id) {
  await api.delete(`/notifications/${id}`);
}

export async function clearAllNotifications() {
  await api.delete("/notifications");
}
