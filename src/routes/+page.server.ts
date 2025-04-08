import type { PageServerLoad } from "./$types";
import test from "$lib/server/mongo/collections/test";

export const load: PageServerLoad = async () => {
  const data = await test.find({}).toArray();
  return { data };
};