import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;

let connectionPoolPromise: any = null;

export const mongo = () => {
  if (connectionPoolPromise) return connectionPoolPromise;

  connectionPoolPromise = new Promise((resolve, reject) => {
    const connection = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (connection.isConnected()) {
      return resolve(connection);
    } else {
      connection
        .connect()
        .then(() => {
          return resolve(connection.db("repool"));
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    }
  });

  return connectionPoolPromise;
};
