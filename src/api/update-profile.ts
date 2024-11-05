import { api } from "@/lib/axios";

interface UpdateProfile {
  name: string;
  description: string | null;
}

export async function updateProfile({ name, description }: UpdateProfile) {
  //   await new Promise((_, reject) => {
  //     setTimeout(reject, 3000);
  //   });

  await api.put("profile", { name, description });
}
