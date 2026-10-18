const input= document.getElementById('input');
const resultado = document.getElementById('resultado');
const form = document.getElementById('form');
const status = document.getElementById('status');


form.addEventListener("submit", async (event)=> {
    event.preventDefault();
    const cidade=input.value.trim();

    if(!cidade) return;
    status.textContent="carregando...";
    resultado.hidden=true;
    try{
        const geoURL= new URL ("https://geocoding-api.open-meteo.com/v1/search");
        geoURL.search= new URLSearchParams({
            name: cidade,
            count: 1,
            language: "pt",
            format:"json"
        });
        const geoResponse= await fetch(geoURL);

        if (!geoResponse.ok){
            throw new Error("Pesquisa da cidade falhou");
        }
        const geoData=await geoResponse.json();
        const lugar= geoData.results?.[0];

        if(!lugar){
            throw new Error("Nome da cidade não encontrado. Digite outro nome");
        }



        const forecastURL= new URL ("https://api.open-meteo.com/v1/forecast");
        forecastURL.search = new URLSearchParams({
            latitude:lugar.latitude,
            longitude:lugar.longitude,
            current: "temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code",
            timezone:"auto"
        });
        const forecastResponse=await fetch(forecastURL);

        if (!forecastResponse.ok){
            throw new Error("Pesquisa do tempo falhou!")
        }
        const forecastData=await forecastResponse.json();

        const current=forecastData.current;
        document.getElementById("nomeCidade").textContent= `${lugar.name}, ${lugar.country}`;

        document.getElementById('temperatura').textContent = `${current.temperature_2m} °C`;
        document.getElementById('tempo').textContent =codigoTempo(current.weather_code);
        document.getElementById('umidade').textContent= `Umidade: ${current.relative_humidity_2m}%`;
        document.getElementById('vento').textContent= `Vento: ${current.wind_speed_10m} km/h`;
        document.getElementById('sensacaoTermica').textContent = `Sensação térmica: ${current.apparent_temperature} °C`;
        document.getElementById('hora').textContent =`Horário local: ${current.time}`;

        resultado.hidden=false;
        status.textContent="Carregado com sucesso!";
    } catch(error){
        status.textContent = error.message;
    }
});

function codigoTempo(codigo) {
    if (codigo === 0) return "Céu limpo";
    if (codigo === 1) return "Céu com poucas nuvens";
    if (codigo === 2) return "Parcialmente nublado";
    if (codigo === 3) return "Céu nublado";
    if (codigo === 45) return "Neblina";
    if (codigo === 48) return "Neblina com geada";

    if (codigo === 51) return "Chuvisco leve";
    if (codigo === 53) return "Chuvisco moderado";
    if (codigo === 55) return "Chuvisco intenso";
    if (codigo === 56) return "Chuvisco congelante leve";
    if (codigo === 57) return "Chuvisco congelante intenso";

    if (codigo === 61) return "Chuva leve";
    if (codigo === 63) return "Chuva moderada";
    if (codigo === 65) return "Chuva forte";
    if (codigo === 66) return "Chuva congelante leve";
    if (codigo === 67) return "Chuva congelante forte";

    if (codigo === 71) return "Neve leve";
    if (codigo === 73) return "Neve moderada";
    if (codigo === 75) return "Neve intensa";
    if (codigo === 77) return "Grãos de neve";

    if (codigo === 80) return "Pancadas de chuva leves";
    if (codigo === 81) return "Pancadas de chuva moderadas";
    if (codigo === 82) return "Pancadas de chuva violentas";

    if (codigo === 85) return "Pancadas de neve leves";
    if (codigo === 86) return "Pancadas de neve intensas";

    if (codigo === 95) return "Tempestade com trovoadas";
    if (codigo === 96) return "Tempestade com trovoadas e granizo leve";
    if (codigo === 97) return "Tempestade forte com trovoadas";
    if (codigo === 99) return "Tempestade com trovoadas e granizo intenso";

    return "Condição climática desconhecida";
}


