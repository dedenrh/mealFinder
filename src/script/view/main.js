import DataSource from "../data/data-source.js";

const main = () => {
  const searchElement = document.querySelector("#searchElement");
  const buttonSearchElement = document.querySelector("#searchButtonElement");
  const mealsElement = document.querySelector("#meals");
  const resultHeading = document.querySelector("#result-heading");
  const single_mealEl = document.querySelector("#single-meal");
  const random = document.querySelector("#random");

  const onButtonSearchClicked = async () => {
    try {
      const result = await DataSource.searchMeal(searchElement.value);
      renderResult(result);
    } catch (message) {
      fallbackResult(message);
    }
  };

  const renderResult = (results) => {
    resultHeading.innerHTML = "";
    resultHeading.innerHTML += `<h2 class="placeholder">Search results for '${searchElement.value}':</h2>`;

    mealsElement.innerHTML = "";
    results.forEach((meal) => {
      const { strMeal, strMealThumb, idMeal } = meal;
      const mealElement = document.createElement("div");
      mealElement.setAttribute("class", "meal");

      mealElement.innerHTML = `
               <img src="${strMealThumb}" alt="${strMeal}">
               <div class="meal-info" data-mealID="${idMeal}">
                   <h3>${strMeal}</h3>
               </div>`;

      mealsElement.appendChild(mealElement);
      searchElement.value = "";
    });
  };

  const fallbackResult = (message) => {
    resultHeading.innerHTML = "";
    resultHeading.innerHTML += `<h2 class="placeholder">${message}</h2>`;
  };

  buttonSearchElement.addEventListener("click", onButtonSearchClicked);

  // Get info meal by ID START
  function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}
    `)
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];

        addMealToDOM(meal);
      });
  }

  // fetch random Meal From API
  function getRandomMeal() {
    // Clear meals and heading
    mealsElement.innerHTML = "";
    resultHeading.innerHTML = "";

    // fetch
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];
        addMealToDOM(meal);
      });
  }

  function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
  }

  random.addEventListener("click", getRandomMeal);

  // Resep dan detail
  mealsElement.addEventListener("click", (e) => {
    const mealInfo = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains("meal-info");
      } else {
        return false;
      }
    });

    if (mealInfo) {
      const mealID = mealInfo.getAttribute("data-mealid");
      getMealById(mealID);
    }
  });
  // Get info meal by ID END
};

export default main;
