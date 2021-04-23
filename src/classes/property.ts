import { propertyCategory } from "@prisma/client";

export type Property = {
  name: string,
  description: string,
  category: propertyCategory,
  vacancyPrice: number,
  cep: string,
  street: string,
  neighborhood: string,
  city: string,
  uf: string,
  country: string,
  number: string,
  complement: string
  hasPool: boolean,
  hasGarage: boolean,
  hasGourmet: boolean,
  hasInternet: boolean,
  isPetFriendly: boolean,
  isAdvertisement: boolean,
  vacancyNumber: number
}