module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/singleton.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/postgres-data/"],
};
