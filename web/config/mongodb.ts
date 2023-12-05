import { MongoClient, ServerApiVersion, Db } from 'mongodb'

// eslint-disable-next-line turbo/no-undeclared-env-vars
let uri: string = process.env.MONGODB_URI || ""

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

if (!uri) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	)
}



export async function connectToDatabase(): Promise<{ client: MongoClient, db: Db }> {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb }
	}

	const client: MongoClient = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true,
		},
	});

	await client.connect()

	const db: Db = client.db('prod')

	await db.command({ ping: 1 })

	cachedClient = client
	cachedDb = db

	return { client, db }
}