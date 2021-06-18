import { mongo } from "../database";

export async function logging(error: object) {
  const db = await mongo();
  const date = new Date().toString();
  const datedError = { ...error, date };

  await db.collection("errors").insertOne(datedError);
  console.log(datedError);
}
