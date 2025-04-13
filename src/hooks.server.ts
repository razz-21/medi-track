import { startMongo } from '$lib/server/mongo/mongo';

startMongo()
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch((e) => console.error(e));
