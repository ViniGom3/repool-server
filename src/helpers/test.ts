import { isGreaterThan, isSameUser } from "./subscribers";

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

describe("isSameUser", () => {
  it("should isSameUser return true when same id is passed as first and second arguments", () => {
    const firstId = 10;
    const secondId = 10;

    expect(isSameUser(firstId, secondId)).toBe(true);
  });

  it("should isSameUser return false when same id is passed as first and second arguments but with diferent types", () => {
    const firstId = 10;
    const secondId = "10";

    expect(isSameUser(firstId, secondId)).toBe(false);
  });
});
