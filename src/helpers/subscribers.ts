import { Interest, Property } from "../classes";
import { prisma } from "../database";
import { FAILURE_CODE_ERROR, FAILURE_MESSAGE } from "./responses";

export const checkIfSameUser = function (id, idLoggedUser, res) {
  if (id !== idLoggedUser)
    res
      .status(FAILURE_CODE_ERROR.FORBIDDEN)
      .json({ error: FAILURE_MESSAGE.FORBIDDEN });
};

export const isSameUser = function (id, idLoggedUser): boolean {
  return id === idLoggedUser;
};

function isGreaterThan(biggerValue: number, smallerValue: number): boolean {
  return biggerValue > smallerValue;
}

export const bothConfirmation = async function (interest: Interest) {
  const { propertyId, userId, pConfirmation, uConfirmation } = interest;

  try {
    if (pConfirmation && uConfirmation) {
      const resultProperty: Property = await prisma.property.findUnique({
        where: {
          id: propertyId,
        },
      });

      const countActiveRentsOnProperty: number = await prisma.rent.count({
        where: {
          propertyId,
          isActive: true,
        },
      });

      if (
        isGreaterThan(resultProperty.vacancyNumber, countActiveRentsOnProperty)
      ) {
        const createRent = prisma.rent.create({
          data: {
            guest: {
              connect: {
                id: userId,
              },
            },
            property: {
              connect: {
                id: propertyId,
              },
            },
          },
        });

        const deleteInterest = prisma.interest.deleteMany({
          where: {
            userId,
          },
        });

        const transactional = await prisma.$transaction([
          createRent,
          deleteInterest,
        ]);
        return transactional;
      }
      throw new Error();
    }
  } catch (error) {
    throw new Error();
  }
};
