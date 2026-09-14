
async function getWeather() {

    try {

      
        let city = document
            .getElementById("cityInput")
            .value
            .trim();


        if (city === "") {

            alert("Enter city name");

            return;
        }


        let locationResponse = await fetch(

            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`

        );


       

        let locationData =
            await locationResponse.json();


       

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            alert("City not found");

            return;
        }


       

        let latitude =
            locationData.results[0].latitude;


        

        let longitude =
            locationData.results[0].longitude;


      

        let cityName =
            locationData.results[0].name;



        let weatherResponse = await fetch(

            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`

        );


        // Convert response to JSON

        let data =
            await weatherResponse.json();




        let temperature =
            data.current.temperature_2m;


        let wind =
            data.current.wind_speed_10m;


        let weatherCode =
            data.current.weather_code;



        let condition =
            getWeatherCondition(weatherCode);



        document
            .getElementById("cityName")
            .innerText = cityName;


        document
            .getElementById("temperature")
            .innerText = temperature;


        document
            .getElementById("wind")
            .innerText = wind + " km/h";


        document
            .getElementById("temp")
            .innerText = temperature;


        document
            .getElementById("condition")
            .innerText = condition;


    }

    catch (error) {

        console.log(error);

        alert("Something went wrong. Please try again.");

    }

}



function getWeatherCondition(code) {


    if (code === 0) {

        return "☀️ Clear Sky";

    }


    else if (code === 1) {

        return "🌤️ Mainly Clear";

    }


    else if (code === 2) {

        return "⛅ Partly Cloudy";

    }


    else if (code === 3) {

        return "☁️ Overcast";

    }


    else if (
        code === 45 ||
        code === 48
    ) {

        return "🌫️ Foggy";

    }


    else if (
        code >= 51 &&
        code <= 57
    ) {

        return "🌦️ Drizzle";

    }


    else if (
        code >= 61 &&
        code <= 67
    ) {

        return "🌧️ Rain";

    }


    else if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄️ Snow";

    }


    else if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌧️ Rain Showers";

    }


    else if (
        code >= 85 &&
        code <= 86
    ) {

        return "🌨️ Snow Showers";

    }


    else if (
        code >= 95 &&
        code <= 99
    ) {

        return "⛈️ Thunderstorm";

    }


    else {

        return "🌡️ Unknown Weather";

    }

}


document
    .getElementById("cityInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            getWeather();

        }

    });

