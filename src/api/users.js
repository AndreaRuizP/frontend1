import api from "./client";

export async function getUser(id) {
  const { data } = await api.get(`/users/${id}`);
  return data; // { id, name, email, role, avatarUrl, createdAt, ... }
}

export async function updateUser(id, body) {
  const { data } = await api.put(`/users/${id}`, body);
  return data; // { message, user }
}

export async function uploadAvatar(id, file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post(`/users/${id}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { message, avatarUrl }
}
