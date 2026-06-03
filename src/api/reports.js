import api from "./client";

export async function createReport(formData) {
  const { data } = await api.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { message, report, vision?: { detectedMaterial, validated } }
}

export async function getReports() {
  const { data } = await api.get("/reports");
  return data;
}
