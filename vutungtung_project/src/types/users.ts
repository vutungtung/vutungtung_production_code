export type User = {
  id: string; // mockapi auto-generates id
  username: string;
  email: string;
  phone?: string;
  status?: "Active" | "Inactive";
  createdAt?: string;
  name: string;
  role: string;
};
