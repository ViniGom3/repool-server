import { mongo } from "../database";

export async function logging(error: object) {
  const db = await mongo();
  await db.collection("errors").insertOne(error);
  console.log(error);
}
