import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const MapComponent = () => {
  const position = [48.8566, 2.3522]; // Coordonnées de Paris, France

  const [selectedPollutant4, setSelectedPollutant4] = useState('');

  const geodairAPI = {
    baseUrl: "http://localhost:3001/api/data",
    fetchData: async function (selectedDate, fileName) {
        let url = `${this.baseUrl}/${selectedDate}/${fileName}`;

        try {
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Réponse HTTP erronée : ${response.status} - ${response.statusText}`
                );
            }

            const file = await response.text();
            const jsonData = csvToJson(file);
            setData(jsonData);
            const uniquePollutants = [...new Set(jsonData.map(item => item.Polluant))];
            setPollutants(uniquePollutants);
            const uniqueSites = [...new Set(jsonData.map(item => item['nom site']))];
            setSites(uniqueSites);
        } catch (error) {
            console.error("Error:", error);
        }
    },


    fetchData2: async function (selectedSecondDate, fileName2) {
        let url = `${this.baseUrl}/${selectedSecondDate}/${fileName2}`;

        try {
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Réponse HTTP erronée : ${response.status} - ${response.statusText}`
                );
            }

            const file = await response.text();
            const jsonData = csvToJson(file);
            setData2(jsonData);
        } catch (error) {
            console.error("Error:", error);
        }
    }
};


function fetchDataAndConvertToJson() {
  return fetch(coord)
    .then(response => response.text())
    .then(data => {
      return csvToJson(data);
    });
}
  const MyMap = () => {
    const [mergedData, setMergedData] = useState([]);
  
    useEffect(() => {
      fetchDataAndConvertToJson()
        .then(jsonData => {
          const transformedData = transformData(data);
          const mergedData = transformedData.map(dataObj => {
            const matchjsondata = jsonData.find(
              jsonObj =>
                jsonObj["code station"] === dataObj["code station"] 
                
            );
            
            if (matchjsondata) {
              let latitude = parseFloat(matchjsondata.Latitude.replace(",", "."));
              let longitude = parseFloat(matchjsondata.Longitude.replace(",", "."));
              console.log(latitude, longitude);
              return { ...dataObj, latitude: latitude, longitude: longitude };
            } else {
               
              return dataObj;
            }
          });
          setMergedData(mergedData);
        });
    }, []);
  
    return (
      <>
      
      <div className="bg-yellow-100 col-span-2 rounded-lg shadow-md">
                            <select 
                                value={selectedPollutant4}
                                onChange={(e) => setSelectedPollutant4(e.target.value)}
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Sélectionnez un polluant</option>
                                {pollutants.map(pollutant => (
                                    <option key={pollutant} value={pollutant}>{pollutant}</option>
                                ))}
                            </select>
                            <select
                                value={selectedOrganisme2}
                                onChange={(e) => setSelectedOrganisme2(e.target.value)}
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                >
                                <option value="">Sélectionnez un organisme</option>
                                    {Organisme.map(Organisme => (
                                        <option key={Organisme} value={Organisme}>{Organisme}</option>
                                    ))}
                            </select>
                                <MyMap />
                            </div>
        <MapContainer center={position} zoom={6} style={{ height: '730px', width: '100%' }}>
          <TileLayer
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=q5ys1RZA0YUSXpDxGDcU"
            url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {mergedData.map((item, index) => {
            const { latitude, longitude } = item;
            console.log(index);
          
            // Vérifier si les coordonnées sont définies et valides
            if (latitude !== undefined && longitude !== undefined) {
                
              return (
                <Marker key={index} position={[latitude, longitude]}>
                <Popup>
                  {/* Contenu du popup pour chaque marqueur */}
                  <div>
                    <h3>{item["code station"]}</h3>
                    <p>Latitude: {latitude}</p>
                    <p>Longitude: {longitude}</p>
                    {/* Autres informations à afficher */}
                  </div>
                </Popup>
              </Marker>
              );
            }
            // Si les coordonnées sont invalides, ne pas créer le marqueur
         
          })}
        </MapContainer>

      </>
    );
  };



  // return (
  //   <MapContainer center={position} zoom={6} style={{ height: '730px', width: '100%' }}>
  //     <TileLayer
  //       url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  //       // url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  //       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; <a href="https://carto.com/attributions">CARTO</a>'
  //     />
  //     <Marker position={position}>
  //       <Popup>
  //         Paris, France. <br /> Bienvenue!
  //       </Popup>
  //     </Marker>
  //   </MapContainer>
  // );
};

export default MapComponent;


