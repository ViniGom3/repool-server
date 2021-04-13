export function verifyRole(req, res, next) {
  const rolePermited = "OWNER"
  if (req.loggedUSerRole !== rolePermited)
    res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
  next()
}