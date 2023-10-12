// const { MongoClient } = require('mongodb');

// const fetchCollectionData = async () => {
//     const uri = "mongodb://karan_tqa:TyPMCd242kKaA2pw@fb-rate-dev-shard-00-00.5hl9j.mongodb.net:27017,fb-rate-dev-shard-00-01.5hl9j.mongodb.net:27017,fb-rate-dev-shard-00-02.5hl9j.mongodb.net:27017/admin?ssl=true&replicaSet=atlas-1n6wq7-shard-0&readPreference=secondaryPreferred&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1";

//     const client = new MongoClient(uri);

//     try {
//       await client.connect();

//       const database = client.db('automation'); // Replace with your database name
//       const collection = database.collection('reports'); // Replace with your collection name

//       // Fetch the data from the collection
//       const data = await collection.find().toArray();
//       return data;
//     } catch (error) {
//       console.error('Error occurred while connecting to MongoDB', error);
//       return [];
//     } finally {
//       await client.close();
//     }
//   };

//   module.exports = { fetchCollectionData };
