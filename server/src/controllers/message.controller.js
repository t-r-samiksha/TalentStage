import {
  sendMessageService,
  getMessagesService,
} from "../services/message/message.service.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

export const sendMessageController =
async (req, res) => {

  try {

    const senderId =
      req.user.userId;

    const file = req.file;

    const message =
      await sendMessageService({

        contractId:
          req.body.contractId,

        senderId,

        content:
          req.body.content,

        attachmentUrl:
          file
            ? file.path
            : null,

        attachmentType:
          file
            ? file.mimetype
            : null,

      });

    return successResponse(
      res,
      message,
      "Message sent"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};

export const getMessagesController =
async (req, res) => {

  try {

    const messages =
      await getMessagesService(
        req.params.contractId
      );

    return successResponse(
      res,
      messages,
      "Messages fetched"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      400
    );

  }

};