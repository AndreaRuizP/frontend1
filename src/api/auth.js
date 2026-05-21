import api from "./client";

export async function login(email, password) {
  const { data } = await api.post("/users/login", { email, password });
  return data; // { token, user: { id, name, email, role } }
}

export async function register(name, email, password) {
  const { data } = await api.post("/users", { name, email, password, role: "citizen" });
  return data;
}
