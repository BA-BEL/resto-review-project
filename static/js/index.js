////////  Endpoint declarations

//  Json restaurant and cuisine endpoints
const url = "http://127.0.0.1:8000/stats_response";
const cuisine_url = "http://127.0.0.1:8000/stats_response/cuisines"

function init() {

    d3.json(cuisine_url).then((data) => {
        // Declare and assign DOM objects
        let cuisine_filler = d3.select("#Cuisine-dropdown");
        // Add 'Select a Cuisine' default option
        cuisine_filler.append("option")
            .attr("value", "")
            .attr("class", "w3-bar-item w3-button")
            .attr("selected", "selected")
            .attr("disabled", "disabled")
            .text("Select a Cuisine");
        // Add 'ALL' option
        cuisine_filler.append("option")
            .attr("value", "ALL")
            .attr("class", "w3-bar-item w3-button")
            .attr("onClick", "onClick(this.value)")
            .text("ALL");
        // D3 iteration Iteration
        for (let i = 0; i < data.length; i++) {
            let option = cuisine_filler.append("option");
            option.attr("value", `${data[i]["cuisine"]}`);
            option.attr("class", "w3-bar-item w3-button");
            option.attr("onClick", "onClick(this.value)");
            option.text(data[i]["cuisine"]);
        }
    });
}

// dropdown menu onClick action
function onClick(value) {

    // Clear restaurant list
    d3.select("#restofiller").html("")

    //  Replace cuisine type header
    d3.select("#cuisine-type").select("h3").text(`Loading...`);

    if (value == "ALL") {
        console.log("Attempting all please work please please")

        d3.json(url).then((data) => {


            // // Print test log
            // console.log(data);

            //  Declare and assign DOM 
            let resto_filler = d3.select("#restofiller");

            //  Declare DOM objects
            let resto;


            //  D3 iteration through json to print out results
            for (let i = 0; i < data.length; i++) {

                resto = resto_filler.append("div");
                resto_id = resto.attr("class", "w3-panel w3-light-grey rounded");


                // Restaurant Name 
                resto.append("h4").text(`${data[i]["name"]}`);
                // Restaurant Cuisine
                resto.append("em").text(`${data[i]["cuisine"]}`)
                // Restaurant Address
                resto.append("p").text(`${data[i]["address"]}`)



                // Restaurant score
                resto.append("p").text(`Total reviews: ${data[i]["total"]}`);

                // Plot ML scores
                resto.append("div").attr("id", `Chart-${data[i]["restaurant_ids"]}`)
                plotter(data[i])

            }
            //  Replace cuisine type header
            d3.select("#cuisine-type").select("h3").text(`${value}:`)

        });

    }
    else {

        //  Fill out site with restaurant data
        d3.json(url).then((data) => {


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
                    resto_id = resto.attr("class", "w3-panel w3-light-grey rounded");


                    // Restaurant Name 
                    resto.append("h4").text(`${data[i]["name"]}`);
                    // Restaurant Address
                    resto.append("p").text(`${data[i]["address"]}`)



                    // Restaurant score
                    resto.append("p").text(`Total reviews: ${data[i]["total"]}`);

                    // Plot ML scores
                    resto.append("div").attr("id", `Chart-${data[i]["restaurant_ids"]}`)
                    plotter(data[i])

                }
                else { }
                //  Replace cuisine type header
                d3.select("#cuisine-type").select("h3").text(`${value}:`)
            }
        });
    }


}

function plotter(data) {

    //  option objects for apex plot
    var options;
    let pos;
    let neu;
    let neg;

    pos = data["positive_count"];
    neu = data["neutral_count"];
    neg = data["negative_count"];

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
                    return ""
                }
            }
        },
        fill: {
            opacity: 1,
            colors: ["#61D684", "#D4D661", "#D66161"]
            // colors: ["#61FC90", "#F9FC61", "#DF2E08"]


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

    var chart = new ApexCharts(document.querySelector(`#Chart-${data["restaurant_ids"]}`), options);
    chart.render();

}

init()