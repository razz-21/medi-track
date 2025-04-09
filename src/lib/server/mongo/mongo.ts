import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

if (!env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(env.MONGODB_URI);

export function startMongo() {
  console.log("Starting MongoDB");
  return client.connect();
}

export default client.db();
