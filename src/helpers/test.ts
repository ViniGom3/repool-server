import { isGreaterThan } from "./subscribers";

describe("isGreaterThan", () => {
  it("should isGreaterThan return true when the first argument is bigger than the second", () => {
    const biggerValue = 9;
    const smallerValue = 4;

    expect(isGreaterThan(biggerValue, smallerValue)).toBe(true);
  });

  it("should isGreaterThan return false when the first argument is smaller than the second", () => {
    const smallerValue = 4;
    const biggerValue = 9;

    expect(isGreaterThan(smallerValue, biggerValue)).toBe(false);
  });

  it("should isGreaterThan return false when the first argument is equal to the second", () => {
    const smallerValue = 5;
    const biggerValue = 5;

    expect(isGreaterThan(smallerValue, biggerValue)).toBe(false);
  });
});
