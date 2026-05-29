import prisma from "../../config/db.js";
import { getIO } from "../../socket/socket.js";
import { createNotificationService } from "../notification/notification.service.js";

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
          profile: true,
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

  // trigger NEW_MESSAGE notification for recipient
  try {
    const recipientId = contract.clientId === senderId ? contract.freelancerId : contract.clientId;
    const senderName = message.sender?.profile?.fullName || message.sender?.email?.split('@')[0] || "Someone";
    
    await createNotificationService({
      userId: recipientId,
      title: "New Message Received",
      message: `${senderName}: ${content.substring(0, 60)}${content.length > 60 ? '...' : ''}`,
      type: "NEW_MESSAGE",
      contractId: contractId,
      messageThreadId: contractId,
    });
  } catch (err) {
    console.error(`[Message Notification Error] Failed to trigger notification: ${err.message}`);
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
