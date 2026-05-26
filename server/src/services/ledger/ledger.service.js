import prisma from "../../config/db.js";

// CREATE LEDGER ACCOUNT
export const createLedgerAccountService = async (userId) => {
  const existingAccount = await prisma.ledgerAccount.findUnique({
    where: {
      userId,
    },
  });

  if (existingAccount) {
    return existingAccount;
  }

  const account = await prisma.ledgerAccount.create({
    data: {
      userId,
    },
  });

  return account;
};

// ESCROW DEPOSIT
export const escrowDepositService = async ({ contractId, userId, amount }) => {
  // create transaction
  const transaction = await prisma.transaction.create({
    data: {
      contractId,

      amount,

      type: "ESCROW_DEPOSIT",
    },
  });

  // update ledger balance
  const account = await prisma.ledgerAccount.update({
    where: {
      userId,
    },

    data: {
      balance: {
        increment: amount,
      },
    },
  });

  // ledger entry
  await prisma.ledgerEntry.create({
    data: {
      ledgerAccountId: account.id,

      transactionId: transaction.id,

      amount,
    },
  });

  return transaction;
};

// RELEASE MILESTONE PAYMENT
export const releaseMilestonePaymentService =
async ({
  contractId,
  freelancerId,
  amount,
}) => {

  // platform commission
  const commission =
    Math.floor(amount * 0.1);

  const freelancerAmount =
    amount - commission;

  const result =
    await prisma.$transaction(

      async (tx) => {

        // create transaction
        const transaction =
          await tx.transaction.create({

            data: {

              contractId,

              amount:
                freelancerAmount,

              type:
                "MILESTONE_RELEASE",
            },
          });

        // update freelancer balance
        const account =
          await tx.ledgerAccount.update({

            where: {
              userId:
                freelancerId,
            },

            data: {

              balance: {
                increment:
                  freelancerAmount,
              },
            },
          });

        // ledger entry
        await tx.ledgerEntry.create({

          data: {

            ledgerAccountId:
              account.id,

            transactionId:
              transaction.id,

            amount:
              freelancerAmount,
          },
        });

        return {

          transaction,

          commission,

          freelancerAmount,
        };

      }
    );

  return result;
};

export const getWalletService = async (userId) => {
  const account = await prisma.ledgerAccount.findUnique({
    where: {
      userId,
    },

    include: {
      entries: {
        include: {
          transaction: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!account) {
    return await prisma.ledgerAccount.create({
      data: {
        userId,
      },

      include: {
        entries: {
          include: {
            transaction: true,
          },
        },
      },
    });
  }

  return account;
};
