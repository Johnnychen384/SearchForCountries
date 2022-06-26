// Selectors ------------------------------------------------------>
const submitBtn = document.getElementById('submitBtn');
const searchBar = document.getElementById('searchbar');
const filterBtn = document.getElementById('filterBtn');
const dropDown = document.getElementById('dropDownMenu');
const countriesContainer = document.getElementById('countries-container');


// events --------------------------------------------------------->

// renders all countries when window loads.
document.addEventListener('DOMContentLoaded', renderAllCountries);

submitBtn.addEventListener('click', renderSearched);
filterBtn.addEventListener('click', filter);
dropDown.addEventListener('click', renderByRegion);

// stores the selected country name into storage and pull it out for fetch param
// after redirecting to another page.
countriesContainer.addEventListener('click', e => {
    storeCountry(e);
    location.href = "index2.html";
});


// functions ------------------------------------------------------>




// function to actually render each country
function render(response){

    // goes through each element in the promise
    response.forEach(data => {
            
        // formats large numbers.
        const numberWithCommas = x => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };


        // checks to confirm all elements inside promise has capital.
        const checkForCapital = cap => {
            if(!data.capital){
                return data.name.common
            } else {
                return data.capital[0]
            }
                
        };


        // stores references to specific data
        const countryName = data.name.common;
        const countryPopulation = numberWithCommas(data.population);
        const countryRegion = data.region;
        const countryCapital = checkForCapital(data.capital);
        const countryFlag = data.flags.svg;
        

        
        // creates a new div for each element returned in promise.
        const newDiv = document.createElement('div');
        newDiv.classList.add('mb-20');
        newDiv.classList.add('lg:basis-1/6');
        // adds html/css to div being referenced by newDiv var.
        newDiv.innerHTML = `

            <div class="country-flag-container flex justify-center pointer-events-none">
                <img src="${countryFlag}" alt="#">
            </div>

            <div class="country-name flex justify-center mt-4 mb-5 font-bold pointer-events-none md:text-2xl">
                <h1 class="${countryName}">${countryName}</h1>
            </div>

            <div class="flex justify-center pointer-events-none">
                <ul class="md:text-2xl">
                    <li class="flex justify-start">
                        <h2 class="mr-1 font-semibold">Population: </h2>
                        <p>${countryPopulation}</p>
                    </li>
                    <li class="flex justify-start">
                        <h2 class="mr-1 font-semibold">Region: </h2>
                        <p>${countryRegion}</p>
                    </li>
                    <li class="flex justify-start">
                        <h2 class="mr-1 font-semibold">Capital: </h2>
                        <p>${countryCapital}</p>
                    </li>
                </ul>
            </div>

            <hr class="mt-2">
        `;

        // adds a child to countries-container
        countriesContainer.appendChild(newDiv);
    })
};





// this async function gets data from an api and returns it in a promise.
async function renderAllCountries() {
    // try/catch used to catch errors.
    try{
        // returns a promise containing all countries and their information.
        const allCountriesUrl = 'https://restcountries.com/v3.1/all';
        const promise = await fetch(allCountriesUrl);
        const response = await promise.json();

        // passes the promise as an argument into the render function.
        render(response);
       

    // any problems will be caught in the try block and passed to the catch block as an argument.
    } catch(error){
        alert('Couldnt get information! Please refresh window.');
    };
};





// saves the value of what is searched and then used as the new endpoint for fetch
// promise received will be passed into render function.
async function renderSearched(){
    let countrySearched = searchBar.value;

    try{

       if(searchBar.value === ""){
           alert('Please type something');
        } else {

            const searchedCountriesUrl = `https://restcountries.com/v3.1/name/${countrySearched}`;
            const promise = await fetch(searchedCountriesUrl);
            const response = await promise.json();

            countriesContainer.innerHTML = '';

            render(response);

        };

    } catch(error){
        alert('Try again!');
    };
};





// checks what is clicked and adds or removes hidden class.
function filter(e){
    const clicked = e.target;

    if(clicked.parentElement.lastElementChild.classList[8] === 'hidden'){
        clicked.parentElement.lastElementChild.classList.remove('hidden');
    } else {
        clicked.parentElement.lastElementChild.classList.add('hidden');
    };

};




// checks what the name of the clicked item is in the dropdown menu
// taking the name and using it as a param to add onto endpoint for fetch.
async function renderByRegion(e){
    
    const target = e.target;
    const regionSelected = target.innerHTML;
    
    // try/catch used to catch errors.
    try{
        // returns a promise containing all countries and their information.
        const filterCountriesUrl = `https://restcountries.com/v3.1/region/${regionSelected}`;
        const promise = await fetch(filterCountriesUrl);
        const response = await promise.json();
        
        // must clear innerhtml for the new countries filtered to show.
        countriesContainer.innerHTML = '';

        // passes the promise as an argument into the render function.
        render(response);
       

    // any problems will be caught in the try block and passed to the catch block as an argument.
    } catch(error){
        alert('Couldnt get information! Please refresh window.');
    };


    // after a delay will add 'hidden' class to make dropdown menu disappear.
    setTimeout(() => {
        target.parentElement.parentElement.classList.add('hidden')
    }, 210);
   
};



function storeCountry(e) {
    const selectedCountry = e.target.firstElementChild.nextElementSibling.firstElementChild.classList.value;
    localStorage.setItem("country", selectedCountry);
};