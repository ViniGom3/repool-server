import { Router } from "express";
import { exception } from "express-exception-handler";
import { Property } from "../classes";
import { prisma } from "../database";
import {
  bothConfirmation,
  handleImage,
  handlePrice,
  handleValue,
  isSameUser,
  parseBoolean,
  FAILURE_CODE_ERROR,
  FAILURE_MESSAGE,
  SUCCESS_CODE_ERROR,
} from "../helpers";
import { upload } from "../middlewares/multer";
import schemaValidator, {
  propertySchemaValidation,
  updatePropertySchemaValidation,
} from "../validations";

const router = Router();

router.get("/interests", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result = await prisma.property.findMany({
      where: {
        ownerId,
      },
      select: {
        interests: {
          select: {
            Property: true,
            User: {
              select: {
                name: true,
                email: true,
                avatar: true,
                sex: true,
                bio: true,
                tel: true,
                cel: true,
              },
            },
          },
        },
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/interest", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result = await prisma.interest.findMany({
      where: {
        OR: [
          {
            uConfirmation: true,
          },
          {
            pConfirmation: true,
          },
        ],
        Property: {
          ownerId,
        },
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/rents", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result = await prisma.rent.findMany({
      where: {
        property: {
          ownerId,
        },
      },
      include: {
        guest: true,
        property: true,
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id/rent", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;
    const id = parseInt(req.params.id);

    const query = await prisma.rent.findUnique({
      where: {
        id,
      },
      select: {
        property: {
          select: {
            ownerId,
          },
        },
      },
    });

    if (!isSameUser(query.property.ownerId, ownerId)) {
      throw new exception(
        "delete rent",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    const result = await prisma.rent.delete({
      where: {
        id,
      },
    });

    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/properties", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const result: Property[] = await prisma.property.findMany({
      where: {
        ownerId,
      },
      include: {
        owner: true,
        rent: true,
        interests: true,
        favorited: true,
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/property/:id/interests", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.property.findUnique({
      where: {
        id,
      },
      select: {
        interests: {
          select: {
            id: true,
            uConfirmation: true,
            pConfirmation: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                sex: true,
                bio: true,
                tel: true,
                cel: true,
              },
            },
          },
        },
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/property/:id/rents/active", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.property.findUnique({
      where: {
        id,
      },
      select: {
        rent: {
          select: {
            id: true,
            comment: true,
            isActive: true,
            guest: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                sex: true,
                bio: true,
                tel: true,
                cel: true,
              },
            },
          },
        },
      },
    });

    const activeRents = result.rent.filter((element) => element.isActive);

    res.json(activeRents);
  } catch (error) {
    next(error)
  }
});

router.get("/:id/property", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        rent: true,
        interests: true,
        favorited: true,
      },
    });

    const agreggate = await prisma.rent.aggregate({
      where: {
        propertyId: id,
      },
      avg: {
        value: true,
      },
    });

    await prisma.property.update({
      where: {
        id,
      },
      data: {
        viewed: {
          increment: 1,
        },
      },
    });

    const propertyWithAggregate = Object.assign(result, agreggate);
    res.json(propertyWithAggregate);
  } catch (error) {
    next(error)
  }
});

router.post("/property", upload.array("img"), async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;
    // @ts-ignore
    const img: string[] = req.files.map((value) => value.linkUrl);

    const {
      name,
      description,
      category,
      cep,
      street,
      neighborhood,
      city,
      uf,
      country,
      number,
      complement,
    } = req.body as unknown as Property;

    const {
      vacancyPrice,
      hasPool,
      hasGarage,
      hasGourmet,
      hasInternet,
      isPetFriendly,
      isAdvertisement,
      vacancyNumber,
    } = req.body as {
      vacancyPrice: string;
      hasPool: string;
      hasGarage: string;
      hasGourmet: string;
      hasInternet: string;
      isPetFriendly: string;
      isAdvertisement: string;
      vacancyNumber: string;
    };

    const error = schemaValidator(propertySchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "add property",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const pool = parseBoolean(hasPool);
    const garage = parseBoolean(hasGarage);
    const gourmet = parseBoolean(hasGourmet);
    const internet = parseBoolean(hasInternet);
    const petFriendly = parseBoolean(isPetFriendly);
    const advertisement = parseBoolean(isAdvertisement);
    const price = handlePrice(vacancyPrice);
    const vacancyNum = handleValue(vacancyNumber);

    const result = await prisma.property.create({
      data: {
        name,
        description,
        category,
        vacancyPrice: price,
        cep,
        street,
        neighborhood,
        city,
        uf,
        country,
        number,
        complement,
        hasPool: pool,
        hasGarage: garage,
        hasGourmet: gourmet,
        hasInternet: internet,
        isPetFriendly: petFriendly,
        isAdvertisement: advertisement,
        vacancyNumber: vacancyNum,
        img,
        owner: {
          connect: {
            id,
          },
        },
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.patch("/:id/property", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.id);

    const {
      name,
      description,
      category,
      vacancyPrice,
      cep,
      street,
      neighborhood,
      city,
      uf,
      country,
      number,
      complement,
      hasPool,
      hasGarage,
      hasGourmet,
      hasInternet,
      isPetFriendly,
      isAdvertisement,
      vacancyNumber,
    } = req.body as unknown as Property;

    const error = schemaValidator(updatePropertySchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "update property",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const propertyResult = await prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            rent: true,
          },
        },
      },
    });

    if (!isSameUser(propertyResult.ownerId, userId)) {
      throw new exception(
        "update property",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    if (propertyResult._count.rent > vacancyNumber) {
      throw new exception(
        "update property",
        FAILURE_CODE_ERROR.BADREQUEST,
        "is not possible a vacancy number less than active rents"
      );
    }

    const result = await prisma.property.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        category,
        vacancyPrice,
        cep,
        street,
        neighborhood,
        city,
        uf,
        country,
        number,
        complement,
        hasPool,
        hasGarage,
        hasGourmet,
        hasInternet,
        isPetFriendly,
        isAdvertisement,
        vacancyNumber,
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.patch("/:id/property/img", upload.array("img"), async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    // @ts-ignore
    const image: string[] = req.files.map((value) => value.linkUrl);
    const id = parseInt(req.params.id);
    const { images } = req.body as unknown as { images: string[] };
    const imagesMixed = handleImage(images, image);

    const propertyResult: Property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!isSameUser(propertyResult.ownerId, userId)) {
      throw new exception(
        "update property img",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    const propertyUpdated: Property = await prisma.property.update({
      where: {
        id,
      },
      data: {
        img: imagesMixed,
      },
    });

    res.json(propertyUpdated);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id/property", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.id);

    const propertyResult = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!isSameUser(propertyResult.ownerId, userId)) {
      throw new exception(
        "delete property",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    const deleteProperty = prisma.property.delete({
      where: {
        id,
      },
    });

    const deleteRent = prisma.rent.deleteMany({
      where: {
        propertyId: id,
      },
    });

    const deleteInterest = prisma.interest.deleteMany({
      where: {
        propertyId: id,
      },
    });

    const transactional = await prisma.$transaction([
      deleteProperty,
      deleteRent,
      deleteInterest,
    ]);
    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(transactional);
  } catch (error) {
    next(error)
  }
});

router.patch("/:id/interest", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;
    const id = parseInt(req.params.id);
    const { pConfirmation } = req.body as unknown as { pConfirmation: boolean };

    const query = await prisma.interest.findUnique({
      where: {
        id,
      },
      select: {
        Property: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!query) {
      throw new exception(
        "update interest",
        FAILURE_CODE_ERROR.NOTFOUND,
        FAILURE_MESSAGE.NOTFOUND
      );
    }

    if (!isSameUser(ownerId, query.Property.ownerId)) {
      throw new exception(
        "update interest",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    const result = await prisma.interest.update({
      where: {
        id,
      },
      data: {
        pConfirmation,
      },
    });

    const resultConfirmation = await bothConfirmation(result);

    if (resultConfirmation) {
      res.json(resultConfirmation);
    }

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/properties/mean", async (req, res, next) => {
  try {
    // @ts-ignore
    const ownerId = req.loggedUserId;

    const mean = await prisma.rent.aggregate({
      where: {
        property: {
          ownerId,
        },
      },
      avg: {
        value: true,
      },
    });

    res.json({ mean });
  } catch (error) {
    next(error)
  }
});

export default router;
