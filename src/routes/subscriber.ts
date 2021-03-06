import { Router } from "express";
import { PrismaPromise, Property, User } from "@prisma/client";
import { exception } from "express-exception-handler";
import { prisma } from "../database";
import { upload } from "../middlewares/multer";
import {
  bothConfirmation,
  createJWT,
  handlePrice,
  handleValue,
  isSameUser,
  parseBoolean,
  FAILURE_CODE_ERROR,
  FAILURE_MESSAGE,
  SUCCESS_CODE_ERROR,
} from "../helpers";
import schemaValidator, {
  propertySchemaValidation,
  updateUserSchemaValidation,
  updateEvaluateSchemaValidation,
} from "../validations";

const router = Router();

router.get("/:id/user", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        avatar: true,
        sex: true,
        bio: true,
        tel: true,
        cel: true,
        property: true,
      },
    });
    res.json(user);
  } catch (error) {
    next(error)
  }
});

router.get("/full-user", async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;

    const result = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        property: true,
        interests: true,
        favorited: true,
        rent: true,
      },
    });
    const { password, ...user } = result;
    res.json(user);
  } catch (error) {
    next(error)
  }
});

router.patch("/user", async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;

    const { name, tel, cel, bio, sex } = req.body;

    const error = schemaValidator(updateUserSchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "update user",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        sex,
        tel,
        cel,
        bio,
      },
    });

    const { password, ...user } = result;
    res.json(user);
  } catch (error) {
    next(error)
  }
});

router.patch("/user/image", upload.single("avatar"), async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;
    // @ts-ignore
    const avatar = req.file.linkUrl;

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar,
      },
    });

    const { password, ...user } = result;
    res.json(user);
  } catch (error) {
    next(error)
  }
});

router.delete("/user", async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new exception(
        "delete user",
        FAILURE_CODE_ERROR.NOTFOUND,
        FAILURE_MESSAGE.NOTFOUND
      );
    }

    const deleteInterest = prisma.interest.deleteMany({
      where: {
        userId: id,
      },
    });

    const deleteRent = prisma.rent.deleteMany({
      where: {
        guestId: id,
      },
    });

    const deleteProperty = prisma.property.deleteMany({
      where: {
        ownerId: id,
      },
    });

    const deleteUser = prisma.user.delete({
      where: {
        id,
      },
    });

    const transactional = await prisma.$transaction([
      deleteInterest,
      deleteRent,
      deleteProperty,
      deleteUser,
    ]);
    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(transactional);
  } catch (error) {
    next(error)
  }
});

router.get("/favorites", async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        favorited: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error)
  }
});

// TODO: change api path to "/:property_id/favorites"
router.patch("/property/:property_id/favorites", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.property_id);

    const favorites = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        favorited: {
          where: {
            id,
          },
        },
      },
    });

    let result;

    if (favorites.favorited.length === 0) {
      result = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          favorited: {
            connect: {
              id,
            },
          },
        },
        include: {
          favorited: true,
        },
      });
    } else {
      result = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          favorited: {
            disconnect: {
              id,
            },
          },
        },
        include: {
          favorited: true,
        },
      });
    }

    const { password, ...user } = result;
    res.json(user);
  } catch (error) {
    next(error)
  }
});

// TODO: change api path to /evaluation
router.get("/evaluate", async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;

    const evaluate = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        rent: {
          select: {
            value: true,
            comment: true,
          },
        },
      },
    });

    res.json(evaluate);
  } catch (error) {
    next(error)
  }
});

// TODO: remove
router.get("/evaluates", async (req, res, next) => {
  try {
    const evaluates = await prisma.rent.findMany({
      select: {
        value: true,
        comment: true,
      },
    });

    res.json(evaluates);
  } catch (error) {
    next(error)
  }
});

router.get("/property/:id/rent", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const query = await prisma.rent.findMany({
      where: {
        propertyId: id,
        isActive: true,
      },
      include: {
        guest: true,
        property: true,
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

    const propertyWithAggregate = Object.assign(query, agreggate);
    res.json(propertyWithAggregate);
  } catch (error) {
    next(error)
  }
});

router.get("/rent", async (req, res, next) => {
  try {
    // @ts-ignore
    const guestId = req.loggedUserId;

    const rent = await prisma.rent.findMany({
      where: {
        guestId,
        isActive: true,
      },
      include: {
        property: true,
      },
    });

    res.json(rent);
  } catch (error) {
    next(error)
  }
});

// TODO: remove
router.get("/rent/property/:id/user", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // @ts-ignore
    const userId = req.loggedUserId;

    const result = await prisma.property.findUnique({
      where: {
        id,
      },
      select: {
        ownerId: true,
        rent: {
          select: {
            guest: true,
          },
        },
      },
    });

    if (!isSameUser(userId, result.ownerId)) {
      throw new exception(
        "get property and guest",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.post("/property/:property_id/interest", async (req, res, next) => {
  try {
    // @ts-ignore
    const id = req.loggedUserId;
    const propertyId = parseInt(req.params.property_id);

    const interest = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        interests: {
          where: {
            propertyId,
          },
        },
      },
    });

    if (interest.interests.length !== 0) {
      throw new exception(
        "add interest",
        FAILURE_CODE_ERROR.BADREQUEST,
        FAILURE_MESSAGE.BADREQUEST
      );
    }

    const result = await prisma.interest.create({
      data: {
        userId: id,
        propertyId,
      },
    });

    res.status(SUCCESS_CODE_ERROR.CREATED).json(result);
  } catch (error) {
    next(error)
  }
});

router.patch("/property/:property_id/interest", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const propertyId = parseInt(req.params.property_id);

    const interest = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        interests: {
          where: {
            propertyId,
          },
        },
      },
    });

    let result;
    if (interest.interests.length === 0) {
      result = await prisma.interest.create({
        data: {
          userId,
          propertyId,
        },
      });
    } else {
      result = await prisma.interest.deleteMany({
        where: {
          userId,
          propertyId,
        },
      });
    }

    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(interest);
  } catch (error) {
    next(error)
  }
});

router.patch("/:id/interest", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.id);
    const { uConfirmation } = req.body as unknown as { uConfirmation: boolean };

    const query = await prisma.interest.findUnique({
      where: {
        id,
      },
    });

    if (!query) {
      throw new exception(
        "update interest",
        FAILURE_CODE_ERROR.NOTFOUND,
        FAILURE_MESSAGE.NOTFOUND
      );
    }

    if (!isSameUser(userId, query.userId)) {
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
        uConfirmation,
      },
    });

    const resultConfirmation = await bothConfirmation(result);

    if (resultConfirmation) res.json(resultConfirmation);
    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.delete("/property/:property_id/interest", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const propertyId = parseInt(req.params.property_id);

    const interest = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        interests: {
          where: {
            propertyId,
          },
        },
      },
    });

    if (interest.interests.length === 0) {
      throw new exception(
        "delete interest",
        FAILURE_CODE_ERROR.NOTFOUND,
        "not exist interest for delete"
      );
    }

    const result = await prisma.interest.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });

    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(result);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id/interest", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const interest = await prisma.interest.findUnique({
      where: {
        id,
      },
    });

    // @ts-ignore
    if (!isSameUser(interest.userId, req.loggedUserId)) {
      throw new exception(
        "delete interest",
        FAILURE_CODE_ERROR.FORBIDDEN,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    if (interest) {
      throw new exception(
        "delete interest",
        FAILURE_CODE_ERROR.NOTFOUND,
        "not exist interest for delete"
      );
    }

    const result = await prisma.interest.delete({
      where: {
        id,
      },
    });

    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(result);
  } catch (error) {
    next(error)
  }
});

router.patch("/rent/evaluate", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const { value, comment } = req.body as unknown as {
      value: number;
      comment: string;
    };

    const error = schemaValidator(updateEvaluateSchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "update evaluate",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const result = await prisma.rent.updateMany({
      where: {
        guestId: userId,
        isActive: true,
      },
      data: {
        comment,
        value,
      },
    });

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.patch("/rent/:id/evaluate", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { value, comment } = req.body as unknown as {
      value: number;
      comment: string;
    };

    const error = schemaValidator(updateEvaluateSchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "update evaluate",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const result = await prisma.rent.update({
      where: {
        id,
      },
      data: {
        comment,
        value,
      },
    });

    res.json(result);
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
        "update evaluate",
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

    const propertyResult: PrismaPromise<Property> = prisma.property.create({
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

    const ownerResult: PrismaPromise<User> = prisma.user.update({
      where: {
        id,
      },
      data: {
        role: "OWNER",
      },
    });

    const transactional = await prisma.$transaction([
      propertyResult,
      ownerResult,
    ]);

    const OWNER_POSITION = 1;
    const jwt = await createJWT(
      transactional[OWNER_POSITION].id,
      transactional[OWNER_POSITION].role
    );

    const [property, owner] = transactional;
    const { password, ...ownerWithoutPassword } = owner;

    res.json([property, ownerWithoutPassword, jwt]);
  } catch (error) {
    next(error)
  }
});

router.delete("/:id/rent", async (req, res, next) => {
  try {
    // @ts-ignore
    const userId = req.loggedUserId;
    const id = parseInt(req.params.id);

    const query = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        rent: {
          where: {
            id,
          },
        },
      },
    });

    if (!query.rent[0].guestId) {
      throw new exception(
        "delete rent",
        FAILURE_CODE_ERROR.NOTFOUND,
        "not exist rent"
      );
    }

    if (!isSameUser(query.rent[0].guestId, userId)) {
      throw new exception(
        "update evaluate",
        FAILURE_CODE_ERROR.BADREQUEST,
        FAILURE_MESSAGE.FORBIDDEN
      );
    }

    const rentUpdate = await prisma.rent.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    res.status(SUCCESS_CODE_ERROR.NOTCONTENT).json(rentUpdate);
  } catch (error) {
    next(error)
  }
});

export default router;
