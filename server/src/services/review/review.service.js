import prisma from "../../config/db.js";
import { createNotificationService } from "../notification/notification.service.js";

// COMPLETE CONTRACT
export const completeContractService = async ({ contractId, clientId }) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      project: true,
      milestones: true
    }
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.clientId !== clientId) {
    throw new Error("Unauthorized action. You are not the client for this contract.");
  }

  if (contract.status === "COMPLETED") {
    return contract; // Already completed
  }

  // Verify all milestones are APPROVED
  const hasPending = contract.milestones.some(m => m.status !== "APPROVED");
  if (hasPending) {
    throw new Error("Cannot complete contract. All escrow milestones must be approved and released first.");
  }

  // Update contract status
  const updatedContract = await prisma.contract.update({
    where: { id: contractId },
    data: {
      status: "COMPLETED"
    }
  });

  // Notify freelancer
  await createNotificationService({
    userId: contract.freelancerId,
    title: "Contract Completed",
    message: `Your contract for "${contract.project.title}" has been marked as Completed by the client.`,
    type: "CONTRACT_COMPLETED",
    contractId: contract.id
  });

  return updatedContract;
};

// CREATE REVIEW
export const createReviewService = async ({ contractId, clientId, rating, comment }) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      project: true
    }
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.clientId !== clientId) {
    throw new Error("Unauthorized action. You are not the client for this contract.");
  }

  if (contract.status !== "COMPLETED") {
    throw new Error("Reviews can only be submitted after the contract has been successfully completed.");
  }

  // Prevent duplicate reviews
  const existingReview = await prisma.review.findUnique({
    where: { contractId }
  });

  if (existingReview) {
    throw new Error("A review has already been submitted for this contract");
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      contractId,
      clientId,
      freelancerId: contract.freelancerId,
      rating: parseInt(rating, 10),
      comment: comment || ""
    }
  });

  // Recalculate freelancer average rating
  const allReviews = await prisma.review.findMany({
    where: { freelancerId: contract.freelancerId }
  });

  const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = allReviews.length > 0 ? parseFloat((totalRating / allReviews.length).toFixed(2)) : 0;

  // Update freelancer rating in FreelancerProfile
  await prisma.freelancerProfile.update({
    where: { userId: contract.freelancerId },
    data: {
      rating: avgRating
    }
  });

  // Get client details to personalize message
  const clientUser = await prisma.user.findUnique({
    where: { id: clientId },
    include: { profile: true }
  });
  const clientName = clientUser?.profile?.fullName || "A client";

  // Notify freelancer
  await createNotificationService({
    userId: contract.freelancerId,
    title: "New Review Received",
    message: `You received a new ${rating}-star review from client ${clientName} for "${contract.project.title}".`,
    type: "REVIEW_RECEIVED",
    reviewId: review.id,
    freelancerId: contract.freelancerId
  });

  return review;
};
