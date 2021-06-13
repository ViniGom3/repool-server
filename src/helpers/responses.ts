export enum SUCCESS_CODE_ERROR {
  OK = 200,
  CREATED = 201,
  NOTCONTENT = 204,
}

export enum FAILURE_CODE_ERROR {
  BADREQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOTFOUND = 404,
  SERVERERROR = 500,
}

export enum FAILURE_MESSAGE {
  BADREQUEST = "Há algo de errado com sua solicitação",
  UNAUTHORIZED = "Você precisa estar logado",
  FORBIDDEN = "Você não está autorizado a fazer essa operação",
  NOTFOUND = "O recurso que você esperava não foi encontrado",
  SERVERERROR = "Opa, tivemos uma falha",
}
