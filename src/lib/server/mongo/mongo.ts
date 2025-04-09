import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

const client = new MongoClient(env.MONGODB_URI);

export function startMongo() {
  console.log("Starting MongoDB");
  return client.connect();
}

export default client.db();
