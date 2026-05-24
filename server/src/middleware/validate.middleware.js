import { errorResponse }
from "../utils/apiResponse.js";

export const validate =
(schema) =>
(req, res, next) => {

  try {

    schema.parse(req.body);

    next();

  } catch (error) {

    return errorResponse(
      res,
      error.errors?.[0]?.message ||
        "Validation failed",
      400
    );

  }

};