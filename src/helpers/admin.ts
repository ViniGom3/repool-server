import { FAILURE_CODE_ERROR, FAILURE_MESSAGE } from "./responses";

export function verifyAdmin(req, res, next) {
  const rolePermited = "ADMIN";
  if (req.loggedUserRole !== rolePermited)
    res
      .status(FAILURE_CODE_ERROR.FORBIDDEN)
      .json({ error: FAILURE_MESSAGE.FORBIDDEN });

  next();
}

export function handleDateAgo(today: Date, daysAgo: number = 30): Date {
  const thirtyDaysAgoInSeconds = new Date().setDate(today.getDate() - daysAgo);
  const thirtyDaysAgo = new Date(thirtyDaysAgoInSeconds);
  return thirtyDaysAgo;
}
