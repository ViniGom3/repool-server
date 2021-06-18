import express from "express";
import setupMiddlewares from "./middleware";
import exceptionHandler from "express-exception-handler";
import setupRoutes from "./setupRoutes";

exceptionHandler.handle();

const app = express();
setupMiddlewares(app);
setupRoutes(app);
export default app;
