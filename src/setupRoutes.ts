import { Express } from "express";
import { Users, Subscribers, Owners, Admin } from "./routes";
import { verifyJWT, verifyRole, verifyAdmin } from "./helpers";

export default (app: Express): void => {
  app.use("/user", Users);

  app.use(verifyJWT);
  app.use("/subscriber", Subscribers);

  app.use(verifyRole);
  app.use("/owner", Owners);

  app.use(verifyAdmin);
  app.use("/admin", Admin);
};
