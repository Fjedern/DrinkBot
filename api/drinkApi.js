import fetch from "node-fetch";

export async function getRandomDrink() {
  const response = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  const data = await response.json();
  return data;
}

export async function getDrinkByName(drinkName) {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`
  );
  const data = await response.json();
  return data;
}
