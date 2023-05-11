
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

            // Plot ML scores
            resto.append("div").attr("id", `Chart-${data[i]["id"]}`)
            plotter(data[i])

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
                resto.append("div").attr("id", `Chart-${data[i]["id"]}`)


                plotter(data[i]);
            }
            else { }
        }
    });

    ////  Test script for functionality

    // let d3tester = d3.select("#info");

    // d3tester.append("p").text(`${value}`)

    // d3.json(mock_url)


}

function plotter(data) {

    //  option objects for apex plot
    var options;
    let pos;
    let neu;
    let neg;

    pos = data["vader_pos"];
    neu = data["vader_neu"];
    neg = data["vader_neg"];

    options = {
        series: [{
            name: 'Positive',
            data: [pos]
        },
        {
            name: 'Neutral',
            data: [neu]
        },
        {
            name: 'Negative',
            data: [neg]
        }],
        chart: {
            type: 'bar',
            height: 100,
            stacked: true,
            stackType: '100%'
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        title: {
            // text: '100% Stacked Bar'
        },
        xaxis: {
            labels: {
                show: false
            }

        },
        yaxis: {
            labels: {
                show: false
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    // return Math.round(val*100,2) + "%"
                    return "idk what to put here; depends on what final data looks like"
                }
            }
        },
        fill: {
            opacity: 1

        },
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        toolbar: {
            show: false
        }
    };

    var chart = new ApexCharts(document.querySelector(`#Chart-${data["id"]}`), options);
    chart.render();

}

////////  Call functions

init();


/////// ChatGPT solution for scrolling issue

// JavaScript code to scroll to the bottom of the scrollable container
// var scrollContainer = document.getElementById('scrollContainer');
// scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;


//// Test D3 Functionality

// let d3tester = d3.select("#d3tester");

// d3tester.append("p").text("testing one");
// d3tester.append("p").text("testing two time travel");
// d3tester.append("p").text("testing three: the one after cache is cleared!")


//// Apex Charts Test Functionality

// var options = {
//     series: [{
//         name: 'Marine Sprite',
//         data: [44, 55, 41, 37, 22, 43, 21]
//     }, {
//         name: 'Striking Calf',
//         data: [53, 32, 33, 52, 13, 43, 32]
//     }, {
//         name: 'Tank Picture',
//         data: [12, 17, 11, 9, 15, 11, 20]
//     }, {
//         name: 'Bucket Slope',
//         data: [9, 7, 5, 8, 6, 9, 4]
//     }, {
//         name: 'Reborn Kid',
//         data: [25, 12, 19, 32, 25, 24, 10]
//     }],
//     chart: {
//         type: 'bar',
//         height: 350,
//         stacked: true,
//         stackType: '100%'
//     },
//     plotOptions: {
//         bar: {
//             horizontal: true,
//         },
//     },
//     stroke: {
//         width: 1,
//         colors: ['#fff']
//     },
//     title: {
//         text: '100% Stacked Bar'
//     },
//     xaxis: {
//         categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
//     },
//     tooltip: {
//         y: {
//             formatter: function (val) {
//                 return val + "K"
//             }
//         }
//     },
//     fill: {
//         opacity: 1

//     },
//     legend: {
//         position: 'top',
//         horizontalAlign: 'left',
//         offsetX: 40
//     }
// };

// var chart = new ApexCharts(document.querySelector("#chart"), options);
// chart.render();
