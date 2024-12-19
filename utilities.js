/**
 * Då json-objektet som representerar en cocktail är lite
 * halvtokigt utformat av de som utvecklat API:et, så har ni
 * här en hjälpfunktion som konverterar den halvtoiga datan
 * till ett mer lättarbetat objekt istället. Bortrensat är
 * alla ingredienser och measures som är null samt ett antal
 * attribut som ni inte kommer att han någon användning för.
 */
export function mapRawCocktailData(rawCocktail) {
  return {
    id: rawCocktail.idDrink,
    name: rawCocktail.strDrink,
    tags: rawCocktail.strTags ? rawCocktail.strTags.split(",") : [],
    category: rawCocktail.strCategory,
    alcoholic: rawCocktail.strAlcoholic === "Alcoholic",
    glass: rawCocktail.strGlass,
    instructions: rawCocktail.strInstructions,
    thumbnail: rawCocktail.strDrinkThumb,
    ingredients: Array.from({ length: 15 })
      .map((_, i) => ({
        ingredient: rawCocktail[`strIngredient${i + 1}`],
        measure: rawCocktail[`strMeasure${i + 1}`],
      }))
      .filter((item) => item.ingredient),
  };
}
