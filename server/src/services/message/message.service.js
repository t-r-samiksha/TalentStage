import prisma from "../../config/db.js";

import { getIO } from "../../socket/socket.js";

export const sendMessageService = async ({
  contractId,
  senderId,
  content,
  attachmentUrl,
  attachmentType,
}) => {
  // check contract
  const contract = await prisma.contract.findUnique({
    where: {
      id: contractId,
    },
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  // allow only participants
  const isParticipant =
    contract.clientId === senderId || contract.freelancerId === senderId;

  if (!isParticipant) {
    throw new Error("Unauthorized");
  }

  // allow chat only if active
  if (contract.status !== "ACTIVE") {
    throw new Error("Chat closed for this contract");
  }

  // create message
  const message = await prisma.message.create({
    data: {
      contractId,
      senderId,
      content,
      attachmentUrl,
      attachmentType,
    },

    include: {
      sender: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // realtime emit
  try {
    const io = getIO();

    io.to(contractId).emit("chat:receive", message);
  } catch (error) {
    console.log("Socket emit failed");
  }

  return message;
};

export const getMessagesService = async (contractId) => {
  const messages = await prisma.message.findMany({
    where: {
      contractId,
    },

    include: {
      sender: {
        select: {
          id: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
};
