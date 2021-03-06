import { Router } from "express";
import { exception } from "express-exception-handler";

import {
  findEmail,
  findByEmail,
  createJWT,
  parseBoolean,
  handlePrice,
  hashing,
  verify,
  FAILURE_CODE_ERROR,
  FAILURE_MESSAGE,
  isGreaterThan,
} from "../helpers";
import { prisma } from "../database";
import { Pagination } from "../classes";
import schemaValidator, {
  signInSchemaValidation,
  signUpSchemaValidation,
} from "../validations";

const router = Router();

router.get("/users", async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        password: false,
        name: true,
        email: true,
        role: true,
        tel: true,
        cel: true,
        bio: true,
        createdAt: true,
        sex: true,
      },
    });

    res.json(allUsers);
  } catch (error) {
    next(error)
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, tel, cel, sex, bio } = req.body;

    const error = schemaValidator(signUpSchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "signup",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const user = await findEmail(email);

    if (user) {
      throw new exception(
        "signup",
        FAILURE_CODE_ERROR.BADREQUEST,
        "e-mail already exist"
      );
    } else {
      const hash = await hashing(password);

      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hash,
          sex,
          bio,
          tel,
          cel,
        },
      });

      const { password: pass, ...newUser } = createdUser;
      const jwt = await createJWT(newUser.id, newUser.role);
      const userAndJwt = [newUser, jwt];
      res.json(userAndJwt);
    }
  } catch (error) {
    next(error)
  }
});

//  TODO: REMOVE THIS API
router.get("/email", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await findEmail(email);

    res.json(!!user);
  } catch (error) {
    next(error)
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const error = schemaValidator(signInSchemaValidation, req.body);

    if (!!error) {
      throw new exception(
        "signin",
        FAILURE_CODE_ERROR.BADREQUEST,
        error.message
      );
    }

    const result = await findByEmail(email);

    if (!result) {
      throw new exception(
        "signin",
        FAILURE_CODE_ERROR.NOTFOUND,
        FAILURE_MESSAGE.NOTFOUND
      );
    } else {
      const { password: hash, id, role } = result;

      const isValid = await verify(hash, password);

      const { password: passToRemove, ...user } = result;

      if (!isValid) {
        throw new exception(
          "signin",
          FAILURE_CODE_ERROR.BADREQUEST,
          FAILURE_MESSAGE.BADREQUEST
        );
      } else {
        const jwt = await createJWT(id, role);
        res.json([user, jwt]);
      }
    }
  } catch (error) {
    next(error)
  }
});

router.get("/ad", async (req, res, next) => {
  try {
    const { search } = req.query as unknown as { search: string };
    const {
      hasPool,
      hasGarage,
      hasGourmet,
      hasInternet,
      isPetFriendly,
      maximumPrice,
      minimumPrice,
    } = req.query as unknown as {
      hasPool: string;
      hasGarage: string;
      hasGourmet: string;
      hasInternet: string;
      isPetFriendly: string;
      maximumPrice: string;
      minimumPrice: string;
    };

    const { skip: skipper = "0", take: takker = "20" } =
      req.query as unknown as Pagination;
    const skip = parseInt(skipper);
    const take = parseInt(takker);

    const pool = parseBoolean(hasPool);
    const garage = parseBoolean(hasGarage);
    const gourmet = parseBoolean(hasGourmet);
    const internet = parseBoolean(hasInternet);
    const petFriendly = parseBoolean(isPetFriendly);
    const maxPrice = handlePrice(maximumPrice);
    const minPrice = handlePrice(minimumPrice);

    if (isGreaterThan(minPrice, maxPrice)) {
      throw new exception(
        "ad",
        FAILURE_CODE_ERROR.BADREQUEST,
        "minimum price cannot be greater than maximum price"
      );
    }

    let result;
    if (!!search) {
      result = await prisma.property.findMany({
        skip,
        take,
        where: {
          isAdvertisement: true,
          hasGarage: garage,
          hasPool: pool,
          hasGourmet: gourmet,
          hasInternet: internet,
          isPetFriendly: petFriendly,
          vacancyPrice: {
            lte: maxPrice,
            gte: minPrice,
          },
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              neighborhood: {
                contains: search,
              },
            },
            {
              city: {
                contains: search,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      });
    } else {
      result = await prisma.property.findMany({
        skip,
        take,
        where: {
          isAdvertisement: true,
          hasGarage: garage,
          hasPool: pool,
          hasGourmet: gourmet,
          hasInternet: internet,
          isPetFriendly: petFriendly,
          vacancyPrice: {
            lte: maxPrice,
            gte: minPrice,
          },
        },
      });
    }

    res.json(result);
  } catch (error) {
    next(error)
  }
});

router.get("/:id/property", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.property.update({
      where: {
        id,
      },
      data: {
        viewed: {
          increment: 1,
        },
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

    const propertyWithAggregate = Object.assign(result, agreggate);
    res.json(propertyWithAggregate);
  } catch (error) {
    next(error)
  }
});

router.get("/ad/count", async (req, res, next) => {
  try {
    const all = await prisma.property.count({
      where: { isAdvertisement: true },
    });

    res.json(all);
  } catch (error) {
    next(error)
  }
});

router.get("/:id/evaluate", async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const favorites = await prisma.rent.aggregate({
      where: {
        propertyId: id,
      },
      avg: {
        value: true,
      },
    });
    res.json(favorites);
  } catch (error) {
    next(error)
  }
});

export default router;
