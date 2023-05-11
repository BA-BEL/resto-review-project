
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

    // //  fill dropdown menu
    // d3.json(mock_cuisine_url).then((data) => {

    //     // Print test log
    //     console.log(data);

    //     // Declare and assign DOM objects
    //     let cuisine_filler = d3.select("#Cuisine-dropdown");
    //     let option;

    //     // D3 iteration Iteration
    //     for (let i = 0; i < data.length; i++) {

    //         option = cuisine_filler.append("a");
    //         option_value = option.attr("href", `/cuisines/${data[i]["cuisine"]}`);
    //         option_class = option.attr("class", "w3-bar-item w3-button");
    //         option_text = option.text(data[i]["cuisine"]);

    //     }

    // });


    //  fill dropdown menu
    d3.json(mock_cuisine_url).then((data) => {

        // Print test log
        console.log(data);

        // Declare and assign DOM objects
        let cuisine_filler = d3.select("#Cuisine-dropdown");
        let option;

        // D3 iteration Iteration
        for (let i = 0; i < data.length; i++) {

            option = cuisine_filler.append("option");
            option_value = option.attr("value", `${data[i]["cuisine"]}`);
            option_class = option.attr("class", "w3-bar-item w3-button");
            option_class = option.attr("onClick", "onClick(this.value)");
            option_text = option.text(data[i]["cuisine"]);

        }

    });

}

// dropdown menu onClick action
function onClick(value) {


    // Clear restaurant list
    d3.select("#restofiller").html("")

    //  Replace cuisine type header
    d3.select("#cuisine-type").select("h3").text(`${value}:`)

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

            if (data[i]["cuisine"] == value) {
                resto = resto_filler.append("div");
                resto_id = resto.attr("class", "w3-panel w3-light-grey");


                // Restaurant Name etc.
                // below is restaurant_id, placeholder might need to be replaced
                resto.append("p").text(`Restaurant: ${data[i]["id"]}`);

                // Restaurant score
                resto.append("p").text(`Vader Compound: ${data[i]["vader_compound"]}`);
            }
            else {}
        }
    });

    ////  Test script for functionality

    // let d3tester = d3.select("#info");

    // d3tester.append("p").text(`${value}`)

    // d3.json(mock_url)


}

////////  Call functions

init();





//// Test D3 Functionality

// let d3tester = d3.select("#d3tester");

// d3tester.append("p").text("testing one");
// d3tester.append("p").text("testing two time travel");
// d3tester.append("p").text("testing three: the one after cache is cleared!")