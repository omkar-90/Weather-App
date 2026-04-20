document.addEventListener("DOMContentLoaded",()=>{
    const cityInput=document.getElementById("city-input");
    const getWeatherBtn=document.getElementById("get-weather-btn");
    const weatherInfo=document.getElementById("weather-info");
    const temperatureInfo=document.getElementById("temperature");
    const cityName=document.getElementById("city-name");
    const descriptionInfo=document.getElementById("description");
    const errorMessage=document.getElementById("error-message");

    const API_KEY="c3ff40b65bbd96733513bb6dea23d92b"

        getWeatherBtn.addEventListener("click",async ()=>{
            const city=cityInput.value.trim();
            if(!city)return;

            try {
              const data = await getWeatherData(city);
              displayWeatherData(data); 
            } catch (error) {
                showError();
            }

        })

    async function getWeatherData(city) {
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

       
        const result= await fetch(url);
        console.log(result);
        
        if(!result.ok){
            throw new Error("City Not fount");
            
        }

        const data= await result.json();
        return data;
    }

    function displayWeatherData(data) {
        console.log(data);
        const{name ,main ,weather}=data;
        cityName.textContent=name;
        temperatureInfo.textContent=`Temperature : ${main.temp} `;
        descriptionInfo.textContent=`Discription : ${weather[0].description}`;
        
        weatherInfo.classList.remove("hidden");
    }

    function showError() {
        weatherInfo.classList.add("hidden");
        errorMessage.classList.remove("hidden");
    }
})