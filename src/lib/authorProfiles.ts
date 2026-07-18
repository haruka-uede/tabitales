import { slugify } from "./slug";

export const AUTHOR_BLURBS: Record<string, string> = {
  [slugify("Haruki Murakami")]:
    "One of the most internationally recognized Japanese novelists. His Tokyo — jazz bars, quiet cafés, city walks — is a recurring backdrop across his fiction.",
  [slugify("Osamu Dazai")]:
    "Dazai's memoir Tsugaru retraces his rural hometown in northern Japan, from his family's preserved mansion in Kanagi to the remote coastal village of Kodomari.",
  [slugify("Keigo Higashino")]:
    "A contemporary mystery writer whose novels — several adapted into hit films and shows — are tied to real, specific settings across Japan.",
};
