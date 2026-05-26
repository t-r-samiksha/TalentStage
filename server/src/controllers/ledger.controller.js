import {
  getWalletService,
} from "../services/ledger/ledger.service.js";

import {

  successResponse,

  errorResponse,

} from "../utils/apiResponse.js";


export const getWalletController =
async (req, res) => {

  try {

    const wallet =
      await getWalletService(
        req.user.userId
      );

    return successResponse(
      res,
      wallet,
      "Wallet fetched successfully"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};