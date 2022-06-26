// Selector ------------------------>
const backBtn = document.getElementById('backBtn');
const countriesContainer = document.getElementById('countries-container');





// events --------------------------->
document.addEventListener('DOMContentLoaded', renderSelected);

backBtn.addEventListener('click', () => {
    window.location.href = "index.html";
});

countriesContainer.addEventListener('click', renderBorder);




// functions ------------------------>




// takes an argument in the form of a promise to render country information.
function renderThis(response){

    // goes through each element in the promise
    response.forEach(data => {

        // formats large numbers.
        const numberWithCommas = x => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };


        // checks to confirm all elements inside promise has capital.
        const checkForCapital = cap => {
            if(!data.capital){
                return data.name.common;
            } else {
                return data.capital[0];
            }    
        };


        // stores references to specific data
        const countryName = data.name.common;
        const countryPopulation = numberWithCommas(data.population);
        const countryRegion = data.region;
        const countryCapital = checkForCapital(data.capital);
        const countryFlag = data.flags.svg;
        const countrySub = data.subregion;
        let countryCurrency = '';
        let countryLan = '';
        let countryBorders = '';


        // loops through objects to get 1 specific value from an array of objects.
        for(let k in data.currencies){
            countryCurrency = k;
        };

        for(let lan in data.languages){
            countryLan = lan;
        };


        // checks to see if country has borders
        if(data.borders){

            // uses the .map method to loop through each element in the data.borders array
            // and return to countryBorders variable as a new array of elements that are each a button
            // and is assigned the name of each elements country.
            // YES! ARRAYS CAN CONTAIN "DIVS WITH HTML!"
            countryBorders =  data.borders.map(countryBorder => {
                return ` <button class="${countryBorder}">${countryBorder}</button>`;
            });

        } else {
            countryBorders = 'Unknown';
        }
    
        
        // creates a new div for each element returned in promise.
        const newDiv = document.createElement('div');
        newDiv.classList.add('mb-20');
        
        // adds html/css to div being referenced by newDiv var.
        newDiv.innerHTML = `

            <div class="country-flag-container flex justify-center pointer-events-none md:h-3/4">
                <img src="${countryFlag}" alt="#" class="lg:w-3/4">
            </div>

            <div class="country-name flex justify-center mt-4 mb-5 font-bold pointer-events-none md:text-2xl">
                <h1>${countryName}</h1>
            </div>

            <div class="flex justify-center">
                <ul class="md:text-2xl">

                    <li class="flex justify-start pointer-events-none">
                        <h2 class="mr-1 font-semibold">Population: </h2>
                        <p>${countryPopulation}</p>
                    </li>
                    <li class="flex justify-start  pointer-events-none">
                        <h2 class="mr-1 font-semibold">Region: </h2>
                        <p>${countryRegion}</p>
                    </li>
                    <li class="flex justify-start  pointer-events-none">
                        <h2 class="mr-1 font-semibold">Sub Region: </h2>
                        <p>${countrySub}</p>
                    </li>
                    <li class="flex justify-start  pointer-events-none">
                        <h2 class="mr-1 font-semibold">Capital: </h2>
                        <p>${countryCapital}</p>
                    </li>
                    <br>
                    <li class="flex justify-start  pointer-events-none">
                        <h2 class="mr-1 font-semibold">Currency: </h2>
                        <p>${countryCurrency}</p>
                    </li>
                    <li class="flex justify-start  pointer-events-none">
                        <h2 class="mr-1 font-semibold">Language: </h2>
                        <p>${countryLan}</p>
                    </li>
                    <li class="flex justify-start">
                        <h2 class="mr-1 font-semibold">Border Countries: </h2>
                        <div>${countryBorders} (Click if not known)</div>
                    </li>
                </ul>
            </div>
        `;

        // adds a child to countries-container
        countriesContainer.appendChild(newDiv);
    });
};






// gets saved country from localStorage and passes it into this function
// then it passes it further into the renderThis function.
async function renderSelected(){

    try{
        const selectedCountry = localStorage.getItem('country');
        console.log(selectedCountry)
        const selectedCountriesUrl = `https://restcountries.com/v3.1/name/${selectedCountry}?fullText=true`;
        const promise = await fetch(selectedCountriesUrl);
        const response = await promise.json();

        renderThis(response);

    } catch(error){
        alert('Couldnt get information! Please refresh window.');
    };
};





// function that allows us to select new country to render from the border countries section.
async function renderBorder(e){
    const target = e.target

    // checks if clicked element has a classList.value and also makes sure its not mb-20
    if(target.classList.value !== '' && target.classList.value !== 'mb-20'){

        // once conditions are clear then we store the targets value in the form of code 
        // that is read by the API
        try{
            // storing API code for PARAM
            const selectedBorder = target.classList.value;

            const selectedBordersUrl = `https://restcountries.com/v3.1/alpha/${selectedBorder}`;
            const promise = await fetch(selectedBordersUrl);
            const response = await promise.json();
    

            // clears country currently in place
            countriesContainer.innerHTML = '';

            // renders new country
            renderThis(response);

        } catch(error){
            alert('Please refresh!');
        };
    };
    
};