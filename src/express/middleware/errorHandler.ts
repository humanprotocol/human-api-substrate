export interface APIError {
  status: number;
  err: any;
}

export function handleError(e: any) {
  console.log(e);

  if (e.name === "ValidationError") {
    return {
      status: 400,
      err: {
        parameterName: e.path,
        error: "Invalid parameter.",
      },
    };
  }

  if (e.name === "NonTrustedAccount") {
    return {
      status: 401,
      err: {
        error: "Unauthorized",
      },
    };
  }

  if (e.message === "Option: unwrapping a None value") {
    return {
      status: 404,
      err: {
        error: "Object does not exist.",
      },
    };
  }

  return {
    status: 500,
    err: {
      error: e.message,
    },
  };
}
