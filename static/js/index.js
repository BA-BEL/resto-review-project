
////////  Endpoint declarations

//  Mock data and cuisine endpoints
const mock_url = "http://127.0.0.1:8000/api/v1.0/jsonrefresher/agg";
const mock_cuisine_url = "http://127.0.0.1:8000/api/v1.0/jsonrefresher/cuisines"


/////// Functions

//  Initializer
function init() {

    //  Fill out site with restaurant data
    d3.json(mock_url).then((data) => {


        // // Print test log
        // console.log(data);

        //  Declare and assign DOM 
        let resto_filler = d3.select("#restofiller");

        //  Declare DOM objects
        let resto;

        //  D3 iteration through json to print out results
        for (let i = 0; i < data.length; i++) {

            resto = resto_filler.append("div");
            resto_id = resto.attr("class", "w3-panel w3-light-grey");


            // Restaurant Name etc.
            // below is restaurant_id, placeholder might need to be replaced
            resto.append("p").text(`Restaurant: ${data[i]["id"]}`);

            // Restaurant score
            resto.append("p").text(`Vader Compound: ${data[i]["vader_compound"]}`);
        }


    });

    //  fill dropdown menu
    d3.json(mock_cuisine_url).then((data) => {

        // Print test log
        console.log(data);

        // Declare and assign DOM objects
        let cuisine_filler = d3.select("#Cuisine-dropdown");
        let option;

        // D3 iteration Iteration
        for (let i = 0; i < data.length; i++) {

            option = cuisine_filler.append("a");
            option_value = option.attr("href", `/cuisines/${data[i]["cuisine"]}`);
            option_class = option.attr("class", "w3-bar-item w3-button");
            option_text = option.text(data[i]["cuisine"]);

        }

    });

}


////////  Call functions

init();





//// Test D3 Functionality

// let d3tester = d3.select("#d3tester");

// d3tester.append("p").text("testing one");
// d3tester.append("p").text("testing two time travel");
// d3tester.append("p").text("testing three: the one after cache is cleared!")