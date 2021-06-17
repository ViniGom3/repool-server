import { PrismaClient } from "@prisma/client";
import { mockDeep, MockProxy } from "jest-mock-extended";

import { prisma } from "./src/database";

jest.mock("./src/database", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as MockProxy<PrismaClient>;