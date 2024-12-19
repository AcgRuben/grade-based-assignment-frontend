import { mapRawCocktailData } from './utilities.js';

const resultsContainer = document.getElementById("results-container");
const contentDiv = document.getElementById("content");
const homeLink = document.getElementById("home-link");
const searchLink = document.getElementById("search-link");
const favoritesLink = document.getElementById("favorites-link");
const favoritesContent = document.getElementById("favorites-content");
let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Initierar vår favorites variabel eller skapar en tom array. 



function clearResult() { // Denna funktion ser till att vi nollställer containers på de ställen där content kan överlappa. 

    resultsContainer.innerHTML = "";
    favoritesContent.innerHTML = "";
    contentDiv.innerHTML = "";

}

// Tar bort från favoriter. 
function removeFromFavorites(index) {
    favorites.splice(index, 1);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    showFavoriteCocktails(); // Uppdaterar listan med att kalla funktionen.

}


// Hämta random cocktail
function getRandomCocktail() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const cocktail = mapRawCocktailData(data.drinks[0]);
            displayCocktail(cocktail);
        })
        .catch(function (error) {
            console.error(error);
        });

}

// Funktionen som kallas för att lägga till favoriter 
function addTofavorites(cocktail) {
    // Kolla om cocktailen redan är tillagd
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].id === cocktail.id) {
            alert(`${cocktail.name} is already in your favorites.`)
            return; // Stoppar funktionen ifall cocktailen redan är tillagd. 
        }

    }
    // Annars pushar vi cocktail till favorites arrayen. 
    favorites.push(cocktail);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${cocktail.name} has been added to favorites`);
}

// Start sida 
function displayCocktail(cocktail) {

    contentDiv.innerHTML = `
        <h2>${cocktail.name}</h2>
        <img src="${cocktail.thumbnail}" alt="${cocktail.name}">
        <button id="new-cocktail-btn">Get random cocktail</button>
        <button id="see-more-btn">See Full Recipe</button>
    `;

    const cocktailBtn = document.getElementById("new-cocktail-btn");
    cocktailBtn.addEventListener("click", getRandomCocktail);

    const seeMoreBtn = document.getElementById("see-more-btn");
    seeMoreBtn.addEventListener("click", function () {
        showCocktailDetails(cocktail.id);
    });


}

// Visa cocktail information
function showCocktailDetails(cocktailId) {
    clearResult();
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {


            const cocktail = mapRawCocktailData(data.drinks[0]);
            const isFav = isFavorite(cocktail.id);

            let ingredientsList = ''; // Skapar tom lista
            for (let i = 0; i < cocktail.ingredients.length; i++) {
                ingredientsList += `<li>${cocktail.ingredients[i].ingredient}: ${cocktail.ingredients[i].measure}</li>`; // Lägger till varje ingrediens och mått till listan som sedan visas i vår <ul> 
            }

            contentDiv.innerHTML = `
               
                <h2>${cocktail.name}${isFav ? '⭐' : ''}</h2>
                <img src="${cocktail.thumbnail}" alt="${cocktail.name}">
                <p><strong>Category:</strong> ${cocktail.category}</p>
                <p><strong>Tags:</strong> ${cocktail.tags.join(", ")}</p>
                <p><strong>Alcoholic:</strong> ${cocktail.alcoholic ? "Yes" : "No"}</p>
                <p><strong>Glass:</strong> ${cocktail.glass}</p>
                <p><strong>Instructions:</strong> ${cocktail.instructions}</p>
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredientsList}
                </ul>
                <button id="favorite-btn">Add to favorites</button>
                
                
            `;
            document.getElementById("favorite-btn").addEventListener("click", function () {
                addTofavorites(cocktail);
                showCocktailDetails(cocktailId);
            });


        })
        .catch(function (error) {
            console.error(error);
        });


}

// Sök cocktail

function searchCocktails() {
    const searchInput = document.getElementById("search-input").value;

    resultsContainer.innerHTML = '';

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                for (let i = 0; i < data.drinks.length; i++) {

                    const drink = data.drinks[i];

                    const drinkLink = document.createElement("a");
                    const isFav = isFavorite(drink.idDrink);
                    drinkLink.textContent = data.drinks[i].strDrink + (isFav ? " ⭐" : ""); // Samma sak som att göra en if else
                    drinkLink.href = "#";
                    drinkLink.style.display = "block";


                    drinkLink.addEventListener("click", function () {
                        showCocktailDetails(drink.idDrink);

                        clearResult();

                    });


                    resultsContainer.appendChild(drinkLink);
                }
            } else {
                resultsContainer.textContent = "No drinks found. Try another search!";
            }
        })
        .catch(error => {
            console.error(error);

        });
}


searchLink.addEventListener("click", function (event) {
    event.preventDefault();
    clearResult();



    contentDiv.innerHTML = `
        <h2>Search Cocktails</h2>
        <input required type="text" id="search-input" placeholder="Enter cocktail name">
        <button id="search-btn">Search</button>
    `;


    document.getElementById("search-btn").addEventListener("click", searchCocktails
    )
}); // Kalla searchcocktail på search knappen. 


homeLink.addEventListener("click", function (event) {
    clearResult();
    event.preventDefault();
    getRandomCocktail();

});




// Visa favorit cocktails
function showFavoriteCocktails() {
    clearResult();

    for (let i = 0; i < favorites.length; i++) { // För varje cocktail i favoriter skapar vi ett a element som vi appendar till vår container. Samt event listeners och knappar. 
        const drinkId = favorites[i].id
        const drinkListContainer = document.createElement("ul");

        favoritesContent.appendChild(drinkListContainer);
        drinkListContainer.innerHTML = `
   <a href=#>${favorites[i].name}⭐</a>
   <button class="remove-btn">Remove</button>
   `
        drinkListContainer.querySelector(".remove-btn").addEventListener("click", function () {
            removeFromFavorites(i);
        });

        drinkListContainer.querySelector("a").addEventListener("click", function () {
            showCocktailDetails(drinkId);
        });

    }


}

function isFavorite(cocktailId) {
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].id === cocktailId) { // Retunerar true om cocktailen är tillagd i favorites arrayn. 
            return true;
        }
    }
    return false;

}

favoritesLink.addEventListener("click", showFavoriteCocktails)

getRandomCocktail();