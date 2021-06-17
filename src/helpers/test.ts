import { isGreaterThan } from "./subscribers";

it("should isGreaterThan return true when the first argument is bigger than the second", () => {
  const biggerValue = 9;
  const smallerValue = 4;

  expect(isGreaterThan(biggerValue, smallerValue)).toBe(true);
});
