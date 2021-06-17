import { FAILURE_CODE_ERROR, FAILURE_MESSAGE } from "./responses";

export function verifyRole(req, res, next) {
  const rolePermited = ["OWNER", "ADMIN"];

  if (!checkRole(rolePermited, req.loggedUserRole))
    res
      .status(FAILURE_CODE_ERROR.FORBIDDEN)
      .json({ error: FAILURE_MESSAGE.FORBIDDEN });
  next();
}

export function checkRole(
  rolePermited: string[],
  roleToCheck: string
): boolean {
  return rolePermited.some((rolePermited) => rolePermited === roleToCheck);
}

export function handleImage(
  oldImages: string[],
  newImages: string[]
): string[] {
  const arrayFilled = [...new Set([...oldImages, ...newImages])];
  return arrayFilled.filter((x) => x);
}
