// Icons
import { FileSearch } from "lucide-react";
// CSS
import "./Clima.css";
// Import Hooks
import { useRef, useState } from "react";
// Import Axios
import axios from "axios";

export default function Clima() {
  // Criando ref para definir nome da cidade ao mudar input
  const cityRef = useRef();

  // criando states para atribuir data provida pela API
  const [dataDaily, setDataDaily] = useState({});
  const [dataWeekly, setDataWeekly] = useState({});

  async function searchCity() {
    const city = cityRef.current.value;

    const apiKey = "75afbefef45d5a06e216c0638c662f0f";

    const urlDailyCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;
    const urlWeeklyCity = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
      const [infoCityDaily, infoCityWeekly] = await Promise.all([
        axios.get(urlDailyCity),
        axios.get(urlWeeklyCity),
      ]);

      setDataDaily(infoCityDaily.data);
      setDataWeekly(infoCityWeekly.data);
    } catch (error) {
      console.log("Erro ao buscar dados da cidade:", error);
    }
  }

  let dataForecastPure = null;
  let finalDataForeCast = null;

  if (dataWeekly.list) {
    dataForecastPure = dataWeekly.list;
    finalDataForeCast = dataForecastPure.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );
    finalDataForeCast = finalDataForeCast.slice(0, 5);
    console.log(finalDataForeCast)
  }

  return (
    <div className="climaContainer">
      <div className="searchContainer">
        <input
          type="text"
          className="inputCity"
          placeholder="Digite sua cidade"
          ref={cityRef}
        />
        <button onClick={searchCity} className="searchButton">
          <FileSearch size={40} color="#fff" />
        </button>
      </div>

      {dataDaily.main ? (
        <>
          <div className="statusContainer">
            <h1 className="cityName">{dataDaily.name}</h1>
            <div className="temperatureContainer">
              <span className="temperature">
                {Math.round(dataDaily.main.temp)}°
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${dataDaily.weather[0].icon}.png`}
                alt="Ícone do tempo"
                width={60}
              />
            </div>
            <span className="status">{dataDaily.weather[0].description}</span>
            <span className="humidity">Umidade: {dataDaily.main.humidity}%</span>
            <span className="pressute">Pressão: {dataDaily.main.pressure}</span>
          </div>

          <div className="statusForecast">
            {finalDataForeCast ? (
              <ul className="listContainer">
                {finalDataForeCast.map((day) => {
                  const date = new Date(day.dt_txt);

                  const formattedDate = date.toLocaleDateString("pt-BR", {
                    weekday: "long"
                  }).replace('-feira', '');

                  return (
                    <li className="listForecast" key={day.dt_txt}>
                      <span>{formattedDate}</span>
                      
                      <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt="Ícone do tempo"
                        width={60}
                      />
                      
                      <span className="temperatureForecast">
                        {Math.round(day.main.temp)}°
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <h2>Carregando</h2>
            )}
          </div>
        </>
      ) : (
        <>
          <h2></h2>
        </>
      )}
    </div>
  );
}
