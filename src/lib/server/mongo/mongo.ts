import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

if (!env.MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(env.MONGODB_URI);

export async function startMongo() {
	console.log('Starting MongoDB');
	try {
		await client.connect();
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		await client.close();
		throw error;
	}
}

// Ensure connection is established before exporting
try {
	await startMongo();
} catch (error) {
	console.error('Failed to initialize MongoDB connection:', error);
	process.exit(1);
}

export default client.db();
