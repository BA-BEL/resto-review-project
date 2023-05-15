
////////  Endpoint declarations

//  Mock data and cuisine endpoints
const stats_url = "http://127.0.0.1:8000/stats_response";
const page = "http://127.0.0.1:8000/stats"

/////// Functions

var redIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    });
    var orangeIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    });
    var yellowIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    });
    var greenIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    });

//  Initializer
function init() {

    //  Fill out site with restaurant data
    d3.json(stats_url).then(function (response) {
        console.log(response)
      

        // Create the Cusine Dropdown variable
        var cuisines = response.map(function(response) {
            return response.cuisine})

        // Create a new array to store the unique cuisines.
        var uniqueCuisines = [];

        // Loop through the JSON response and add each unique cuisine to the new array.
        for (var i = 0; i < cuisines.length; i++) {
        if (!uniqueCuisines.includes(cuisines[i])) {
            uniqueCuisines.push(cuisines[i]);
        }
        }
        // Sort Array Alphabetically and log to console
        uniqueCuisines.sort();
        uniqueCuisines.unshift('All');
        console.log(uniqueCuisines)

        // Declare dropdowns
        let cuisineDropdown = d3.select("#selCuisine");
        let filterDropdown = d3.select("#selFilter");
        
        // Append Cuisines to Dropwdown box
        uniqueCuisines.forEach((name) =>
        cuisineDropdown.append("option").text(name).property("value", name)
        );

        //Hardcode Filter Options
        var filter = ['All','Top 10','Worst 10']

        filter.forEach((name) =>
        filterDropdown.append("option").text(name).property("value", name)
        );

        cuisineDropdown.on("change", optionChanged);
        filterDropdown.on("change", optionChanged);

         // function to handle changes in the hospital dropdown
        function optionChanged() {
        const chosen_cuisine = cuisineDropdown.property("value");
        const chosen_filter = filterDropdown.property("value");
        
        // Update the selected values of the dropdown menus
        cuisineDropdown.property("value", chosen_cuisine);
        filterDropdown.property("value", chosen_filter);


        console.log(chosen_cuisine)
        console.log(chosen_filter)
        
        
        // Get the restaurants that match the selected cuisine type.
        if (chosen_cuisine === 'All') {
        var selectedRestaurants = response;
        if (chosen_filter === 'Top 10') {
            selectedRestaurants.sort(function(a, b) {
            return b.positive_percentage - a.positive_percentage;
            });
            var top10Restaurants = selectedRestaurants.slice(0, 10);
        } else if (chosen_filter === 'Worst 10') {
            selectedRestaurants.sort(function(a, b) {
            return b.negative_percentage- a.negative_percentage;
            });
            var top10Restaurants = selectedRestaurants.slice(0, 10);
        } else {        
        // Get the first 10 restaurants.
        var top10Restaurants = selectedRestaurants;
        }} else {
        
        
        var selectedRestaurants = response.filter(function(response) {
            return response.cuisine === chosen_cuisine;
        });

                // Sort the restaurants by their positive score or negative score, depending on the selected option.
        if (chosen_filter === 'Top 10') {
            selectedRestaurants.sort(function(a, b) {
            return b.positive_percentage - a.positive_percentage;
            });
            var top10Restaurants = selectedRestaurants.slice(0, 10);
        } else if (chosen_filter === 'Worst 10') {
            selectedRestaurants.sort(function(a, b) {
            return b.negative_percentage- a.negative_percentage;
            });
            var top10Restaurants = selectedRestaurants.slice(0, 10);
        } else {        
        // Get the first 10 restaurants.
        var top10Restaurants = selectedRestaurants;
        }}
        
        // Return the top 10 restaurants.
        console.log(top10Restaurants)

        function clearMarkers() {
            map.eachLayer(function(layer) {
              if (layer instanceof L.Marker) {
                map.removeLayer(layer);
              }
            });
          }

        clearMarkers();

        for (let i = 0; i < top10Restaurants.length; i++) {

            if (top10Restaurants[i].price_level[0]=== '1'){
                icon = greenIcon;
            } else if (top10Restaurants[i].price_level[0]=== '2'){
                icon = yellowIcon;
            } else if (top10Restaurants[i].price_level[0]=== '3'){
                icon = orangeIcon;
            } else {
                icon = redIcon;
            }


            let newMarker;
            newMarker = L.marker([parseFloat(top10Restaurants[i].latitude[0]), parseFloat(top10Restaurants[i].longitude)]);
            newMarker.setIcon(icon);
            newMarker.on("mouseover", function() {
              var pos = map.latLngToLayerPoint(newMarker.getLatLng());
              pos.y -= 10;
              var fx = new L.PosAnimation();
              fx.once('end',function() {
                pos.y += 10;
                fx.run(newMarker._icon, pos, 0.5);
              });
              fx.run(newMarker._icon, pos, 0.5);
            });
            newMarker.on('mouseover',function(ev) {
              newMarker.openPopup();
            });
            newMarker.on('mouseout', function(ev) {
              newMarker.closePopup();
            });
            
            newMarker.addTo(map); // add the marker to the map
            newMarker.bindPopup("<strong>" + top10Restaurants[i]['name'] + "</strong>" + "<br>" + "<em>" + top10Restaurants[i]['address'] + "</em>" + "<br> Positive: " + "<b>" + top10Restaurants[i]['positive_percentage']+"%" + "</b>" + "<br> Neutral: " + "<b>" + top10Restaurants[i]['neutral_percentage']+"%" + "</b>" + "<br> Negative: " + "<b>" + top10Restaurants[i]['negative_percentage']+"%" + "</b>");
          }

            // Calculate the average percentages
            const totalRestaurants = top10Restaurants.length;
            let totalPositive = 0;
            let totalNeutral = 0;
            let totalNegative = 0;

            top10Restaurants.forEach((top10Restaurants) => {
            totalPositive += top10Restaurants.positive_percentage;
            totalNeutral += top10Restaurants.neutral_percentage;
            totalNegative += top10Restaurants.negative_percentage;
            });

            const pos = totalPositive / totalRestaurants;
            const neu = totalNeutral / totalRestaurants;
            const neg = totalNegative / totalRestaurants;


          //Canvas.js
          var chart = new CanvasJS.Chart("stacked", {
            animationEnabled: true,
            theme: "light2", //"light1", "dark1", "dark2"
            title:{
                text: "Breakdown of Sentiment Scores"             
            },
            axisY:{
                interval: 10,
                suffix: "%"
            },
            toolTip:{
                shared: true
            },
            data:[{
                color: "red",
                type: "stackedBar100",
                toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
                showInLegend: true, 
                name: "Negative",
                dataPoints: [{ y: neg, label: "Reviews" }]},

                {color: "yellow",
                type: "stackedBar100",
                toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
                showInLegend: true, 
                name: "Neutral",
                dataPoints: [{ y: neu, label: "Reviews" }]},


                {color: "green",
                type: "stackedBar100",
                toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
                showInLegend: true, 
                name: "Positive",
                dataPoints: [{ y: pos, label: "Reviews" }]}
            
            ]
            });

            chart.render();
            
            console.log('check')






        }   

        optionChanged();

                        
            });

}
////////  Call functions

init();




//// Test D3 Functionality

// let d3tester = d3.select("#d3tester");

// d3tester.append("p").text("testing one");
// d3tester.append("p").text("testing two time travel");
// d3tester.append("p").text("testing three: the one after cache is cleared!")