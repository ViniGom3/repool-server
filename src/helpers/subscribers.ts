export const checkIfSameUser = function (id, idLoggedUser, res) {
  if (id !== idLoggedUser) res.status(403).json({ "error": "Você não está autorizado a fazer essa operação" })
}