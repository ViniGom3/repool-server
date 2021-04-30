export function verifyAdmin(req, res, next) {
  const rolePermited = "ADMIN"
  console.log(req.loggedUserRole)
  if (req.loggedUserRole !== rolePermited)
    res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
  next()
}