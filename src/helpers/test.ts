import { checkRole, handleImage } from "./owner";
import { isGreaterThan, isSameUser } from "./subscribers";

describe("isGreaterThan", () => {
  it("should return true when the first argument is bigger than the second", () => {
    const biggerValue = 9;
    const smallerValue = 4;

    expect(isGreaterThan(biggerValue, smallerValue)).toBe(true);
  });

  it("should return false when the first argument is smaller than the second", () => {
    const smallerValue = 4;
    const biggerValue = 9;

    expect(isGreaterThan(smallerValue, biggerValue)).toBe(false);
  });

  it("should return false when the first argument is equal to the second", () => {
    const smallerValue = 5;
    const biggerValue = 5;

    expect(isGreaterThan(smallerValue, biggerValue)).toBe(false);
  });
});

describe("isSameUser", () => {
  it("should return true when same id is passed as first and second arguments", () => {
    const firstId = 10;
    const secondId = 10;

    expect(isSameUser(firstId, secondId)).toBe(true);
  });

  it("should return false when same id is passed as first and second arguments but with diferent types", () => {
    const firstId = 10;
    const secondId = "10";

    expect(isSameUser(firstId, secondId)).toBe(false);
  });

  it("should return false when diferent ids are passed as arguments", () => {
    const firstId = 10;
    const secondId = 5;

    expect(isSameUser(firstId, secondId)).toBe(false);
  });
});

describe("CheckRole", () => {
  it("should return true when role passed as second argument is contained in first argument", () => {
    const PermitedRoles = ["ROLE1", "ROLE2"];

    const roleToCheck = "ROLE1";

    expect(checkRole(PermitedRoles, roleToCheck)).toBe(true);
  });

  it("should return false when role passed as second argument is not contained in first argument", () => {
    const PermitedRoles = ["ROLE1", "ROLE2"];

    const roleToCheck = "ROLE0";

    expect(checkRole(PermitedRoles, roleToCheck)).toBe(false);
  });
});

describe("HandleImage", () => {
  it("should return an array containing old and new image url", () => {
    const oldImages = ["imageA", "imageB", "imageC"];
    const newImages = ["imageF", "imageG", "imageH"];

    const oldAndNewImages = [
      "imageA",
      "imageB",
      "imageC",
      "imageF",
      "imageG",
      "imageH",
    ];

    expect(handleImage(oldImages, newImages)).toEqual(oldAndNewImages);
  });

  it("should NOT return an array containing only old image url", () => {
    const oldImages = ["imageA", "imageB", "imageC"];
    const newImages = ["imageF", "imageG", "imageH"];

    const onlyOldImages = ["imageA", "imageB", "imageC"];

    expect(handleImage(oldImages, newImages)).not.toEqual(onlyOldImages);
  });
});
