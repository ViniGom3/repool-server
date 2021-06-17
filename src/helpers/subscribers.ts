import { Interest, Property } from "../classes";
import { prisma } from "../database";

export const isSameUser = function (id, idLoggedUser): boolean {
  return id === idLoggedUser;
};

export function isGreaterThan(
  biggerValue: number,
  smallerValue: number
): boolean {
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
      throw new Error("Não há vaga para que possa ser ocupada");
    }
  } catch (error) {
    throw error;
  }
};
