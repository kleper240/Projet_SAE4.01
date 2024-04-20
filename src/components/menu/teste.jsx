import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss/tailwind.css';


// import coord from './coord.csv';



import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 


import {BarChart,Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { ScatterChart, Scatter } from 'recharts';
import { PieChart, Pie, Cell} from 'recharts';




import { getMaxValue, calculateAverageFromTransformedData, transformData, formatDate, csvToJson, countNbLigne, countDistinctPollutants, countDistinctSites, countDistinctOrganismes, getValue, transformDataByOrganisme, getColor, fetchAndConvertCsvToJson } from './helpers';


const Dashboardrecup = () => {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSecondDate, setSelectedSecondDate] = useState(new Date());
    const [selectedPollutant, setSelectedPollutant] = useState('');
    const [selectedSecondPollutant, setSelectedSecondPollutant] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [selectedSecondSite, setSelectedSecondSite] = useState('');
    const [pollutants, setPollutants] = useState([]);
    const [sites, setSites] = useState([]);
    const [dateSelected, setDateSelected] = useState(false);
    const [isComparing, setIsComparing] = useState(false);
    const [Organisme, setOrganisme] = useState([]);

    //diagramme de dispersion
    const [selectedSite2, setSelectedSite2] = useState('');
    const [selectedPollutant2, setSelectedPollutant2] = useState('');
    const [selectedSecondPollutant2, setSelectedSecondPollutant2] = useState('');
    

    //diagramme de pie chart
    const [selectedSite3, setSelectedSite3] = useState('');

    //diagramme de dispersion 2
    const [selectedPollutant3, setSelectedPollutant3] = useState('');
    const [selectedSecondPollutant3, setSelectedSecondPollutant3] = useState('');
    const [selectedOrganisme, setSelectedOrganisme] = useState('');

    //map 
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
                const uniqueOrganisme = [...new Set(jsonData.map(item => item.Organisme))];
                setOrganisme(uniqueOrganisme);
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

    useEffect(() => {
        const fetchData = async () => {
            let selectedDateFormatted = formatDate(selectedDate);
            const fileName = `FR_E2_${selectedDateFormatted}.csv`;
            await geodairAPI.fetchData(selectedDateFormatted, fileName);
            setDateSelected(true);
        };
    
        fetchData();
    }, [selectedDate]);

    







    

    const handleFetchData = () => {
        const selectedDateFormatted = formatDate(selectedDate);
        const fileName = `FR_E2_${selectedDateFormatted}.csv`;
        const year = selectedDate.getFullYear();
        geodairAPI.fetchData(year, fileName);
   
        const transformedData = transformData(data);
        const averages = calculateAverageFromTransformedData(transformedData);

        if (isComparing) {
            const selectedSecondDateFormatted = formatDate(selectedSecondDate);
            const fileName2 = `FR_E2_${selectedSecondDateFormatted}.csv`;
            const year2 = selectedSecondDate.getFullYear();
            geodairAPI.fetchData2(year2, fileName2);

        }
    };


    
    const handlePollutantChange = (pollutant) => {
        setSelectedPollutant(pollutant);
        const filteredSites = data
            .filter(item => item.Polluant === pollutant)
            .map(item => item['nom site']);
        setSites([...new Set(filteredSites)]);

        if (isComparing) {
            const filteredSites2 = data2
                .filter(item => item.Polluant === pollutant)
                .map(item => item['nom site']);
            setSites([...new Set(filteredSites2.concat(filteredSites))]);
            }
    };

    

    const handleSecondPollutantChange = (pollutant) => {
        setSelectedSecondPollutant(pollutant);
    };

    const toggleComparing = () => {
        setIsComparing(!isComparing);
    };




    const renderSecondSection = () => {
        if (isComparing) {
            return (
                
                <div className="flex flex-col md:flex-row items-start md:items-center">
                    
                    <div className="w-full md:w-1/3 md:mr-2 mb-4 md:mb-0">
                        <DatePicker
                            selected={selectedSecondDate}
                            onChange={(date) => {
                                setSelectedSecondDate(date);
                                handleFetchData();
                            }}
                            
                            dateFormat="dd/MM/yyyy"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="w-full md:w-1/3 md:mx-2 mb-4 md:mb-0">
                        <select
                            value={selectedSecondPollutant}
                            onChange={(e) => handleSecondPollutantChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Sélectionnez un polluant</option>
                            {pollutants.map(pollutant => (
                                <option key={pollutant} value={pollutant}>{pollutant}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/3 mt-4 md:mt-0">
                        <select
                            value={selectedSecondSite}
                            onChange={(e) => setSelectedSecondSite(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Sélectionnez un site</option>
                            {sites.map(site => (
                                <option key={site} value={site}>{site}</option>
                            ))}
                        </select>
                    </div>
                </div>
            );
        }
        return null;
    };
    
    

    const MyScatterChart = () => {
        // Récupérer les données transformées
        const transformedData = transformData(data);
        // console.log(transformedData);
        // console.log(getValue(data));
        
        // Filtrer les données pour inclure uniquement le site sélectionné
        const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite2);
    
        // Mapper les données pour ScatterChart
        const scatterChartData = selectedSitesData.map((item, index) => ({
            'nom site': item['nom site'],
            [selectedSecondPollutant2]: parseFloat(item[selectedSecondPollutant2]), // Convertir en nombre
            [selectedPollutant2]: parseFloat(item[selectedPollutant2]), // Convertir en nombre
            fill: COLORS[index % COLORS.length] // Utiliser une couleur différente pour chaque site
        }));
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey={selectedSecondPollutant2} name={selectedSecondPollutant2} unit=" unit" />
                    <YAxis type="number" dataKey={selectedPollutant2} name={selectedPollutant2} unit="unit" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {scatterChartData.map((siteData, index) => (
                        <Scatter key={index} name={siteData['nom site']} data={[siteData]} fill={siteData.fill} />
                    ))}
                    <Legend />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };
    
    // Couleurs pour chaque site
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
    
    


    const MyScatterChart2 = () => {
        // Récupérer les données transformées en fonction de l'organisme sélectionné
        const transformedData = transformDataByOrganisme(data, selectedOrganisme);
    
        // Générer une couleur aléatoire
        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{ 
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey={selectedSecondPollutant3} name={selectedSecondPollutant3} unit=" unit" />
                    <YAxis type="number" dataKey={selectedPollutant3} name={selectedPollutant3} unit=" unit" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    {transformedData.map((siteData, index) => (
                        <Scatter key={index} name={siteData['nom site']} data={[siteData]} fill={getRandomColor()} label={siteData['nom site']} />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        );
    };
    

    const MyPieChart = () => {
  const transformedData = transformData(data);
  const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite3);

  // Obtenir la liste des polluants triés par ordre décroissant des valeurs totales
  const polluantsTotaux = {};
  selectedSitesData.forEach(item => {
    Object.entries(item).forEach(([pollutant, value]) => {
      if (pollutant !== 'nom site') {
        polluantsTotaux[pollutant] = (polluantsTotaux[pollutant] || 0) + value;
      }
    });
  });
  const polluantsTries = Object.entries(polluantsTotaux).sort((a, b) => b[1] - a[1]).map(([pollutant]) => pollutant);

  const pieChartData = polluantsTries.map(polluant => {
    const total = selectedSitesData.reduce((acc, item) => acc + parseFloat(item[polluant]), 0);
    return { name: polluant, value: total };
});

  return (
    <ResponsiveContainer width="110%" height="120%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}:${parseFloat(value).toFixed(1)}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <Tooltip />
            <Legend />
    </ResponsiveContainer>
  );
};



const MyBarChart = () => {
    const transformedData = transformData(data);
    const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite3);
  
    // Obtenir la liste des polluants triés par ordre décroissant des valeurs totales
    const polluantsTotaux = {};
    selectedSitesData.forEach(item => {
      Object.entries(item).forEach(([pollutant, value]) => {
        if (pollutant !== 'nom site') {
          polluantsTotaux[pollutant] = (polluantsTotaux[pollutant] || 0) + value;
        }
      });
    });
    const polluantsTries = Object.entries(polluantsTotaux).sort((a, b) => b[1] - a[1]).map(([pollutant, value]) => ({ name: pollutant, value: parseFloat(value.toFixed(2)) }));
  
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={polluantsTries}>
          <XAxis dataKey="name" />
          
          <Tooltip />
          <Bar dataKey="value">
            {polluantsTries.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.value,entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };


  const MyRingChart = () => {
    const totalPollutant = data.length + data2.length;
    const pollutant1Count = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite).length;
    const pollutant2Count = data2.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite).length;

    const info = [
        { name: selectedPollutant, value: (pollutant1Count / totalPollutant) * 100 },
        { name: selectedSecondPollutant, value: (pollutant2Count / totalPollutant) * 100 },
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={info}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />)
                    }
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};



const MyLineChart = () => {
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data2.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
        const max = Math.max(getMaxValue(filteredData), getMaxValue(filteredData2)); // Get the maximum value from both sets of data
        return (

            
         

            <ResponsiveContainer width="100%" height="100%">


                <LineChart
                    data={filteredData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Date de début" />
                    <YAxis domain={[0, max]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="valeur" stroke="#8884d8" />
                    {isComparing && <Line type="monotone" dataKey="valeur" stroke="#82ca9d" data={filteredData2} />} {/* Add another line for the second set of data */}
                </LineChart>
            </ResponsiveContainer>
        );
    };
const onChange = date => {
        setSelectedDate(date);
        handleFetchData(); // Assurez-vous de définir cette fonction pour mettre à jour les données lorsque la date est modifiée
    };





    // function fetchDataAndConvertToJson() {
    //     return fetch(coord)
    //       .then(response => response.text())
    //       .then(data => {
    //         return csvToJson(data);
    //       });
    //   }
      
    //   const MyMap = () => {
    //     const [mergedData, setMergedData] = useState([]);
      
    //     useEffect(() => {
    //       fetchDataAndConvertToJson()
    //         .then(jsonData => {
    //           const transformedData = transformData(data);
    //           const mergedData = transformedData.map(dataObj => {
    //             const matchjsondata = jsonData.find(
    //               jsonObj =>
    //                 jsonObj["code station"] === dataObj["code station"] 
                    
    //             );
                
    //             if (matchjsondata) {
    //               let latitude = parseFloat(matchjsondata.Latitude.replace(",", "."));
    //               let longitude = parseFloat(matchjsondata.Longitude.replace(",", "."));
    //               console.log(latitude, longitude);
    //               return { ...dataObj, latitude: latitude, longitude: longitude };
    //             } else {
                   
    //               return dataObj;
    //             }
    //           });
    //           setMergedData(mergedData);
    //         });
    //     }, []);
      
    //     return (
    //       <div style={{ height: "100%", width: "100%" }}>
    //         <MapContainer center={[48.92972, 2.294722]} zoom={13} style={{ height: "100%", width: "100%" }}>
    //           <TileLayer
    //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=q5ys1RZA0YUSXpDxGDcU"
    //             attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //           />
    //           {mergedData.map((item, index) => {
    //             const { latitude, longitude } = item;
    //             console.log(index);
              
    //             // Vérifier si les coordonnées sont définies et valides
    //             if (latitude !== undefined && longitude !== undefined) {
                    
    //               return (
    //                 <Marker key={index} position={[latitude, longitude]}>
    //                 <Popup>
    //                   {/* Contenu du popup pour chaque marqueur */}
    //                   <div>
    //                     <h3>{item["code station"]}</h3>
    //                     <p>Latitude: {latitude}</p>
    //                     <p>Longitude: {longitude}</p>
    //                     {/* Autres informations à afficher */}
    //                   </div>
    //                 </Popup>
    //               </Marker>
    //               );
    //             }
    //             // Si les coordonnées sont invalides, ne pas créer le marqueur
             
    //           })}
    //         </MapContainer>
    //       </div>
    //     );
    //   };
      







































//     function fetchDataAndConvertToJson() {
//         return fetch(coord)
//           .then(response => response.text())
//           .then(data => {
//             return csvToJson(data);
//           });
//       }

//       fetchDataAndConvertToJson().then(jsonData => {
//         const transformedData = transformData(data);
//         const mergedData = transformedData.map(dataObj => {
//             const matchjsondata = jsonData.find(jsonObj => jsonObj["code station"] === dataObj["code station"]);
//             if(matchjsondata){
//                 // Convertir les valeurs de latitude et longitude en nombres à virgule flottante
//                 let latitude = parseFloat(matchjsondata.Latitude.replace(",", "."));
//                 let longitude = parseFloat(matchjsondata.Longitude.replace(",", "."));
//                 return {
//                     ...dataObj,
//                     latitude: latitude,
//                     longitude: longitude
//                 };
//             }
//             else{
//                 return null;
//             }
//         })
//         console.log(mergedData);
//     });

// // //fait une jointure entre le tableau data_lat_long et data en fonction de code site comme clé
// // const dataWithLatLong = data.map(item => {
// //     const { latitude, longitude } = data_lat_long.find(({ code_site }) => code_site === item['code site']);
// //     console.log(latitude, longitude);
// //     return { ...item, latitude, longitude };
// // });

//     //ajouter un select pour choisir un polluant


//   //selectedPollutant4

//     delete L.Icon.Default.prototype._getIconUrl;
    
//     const MyMap = () => (
//       <div style={{ height: "100%", width: "100%" }}>
//         <MapContainer center={[48.92972, 2.294722]} zoom={13} style={{ height: "100%", width: "100%" }}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=q5ys1RZA0YUSXpDxGDcU"
//             attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <Marker position={[51.505, -0.09]}>
//             <Popup>
//               A pretty CSS3 popup. <br /> Easily customizable.
//             </Popup>
//           </Marker>
//         </MapContainer>
//       </div>
//     );
    


    return (
        <main>

        {/* les incdicateur  */}
        <div className="pt-1 pb-0 px-4 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-full mx-auto h-auto">
            <div className="bg-teal-500 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2 text-white">Nombre de polluants:</h2>
                <p className="text-2xl font-bold text-white">{countDistinctPollutants(data)}</p>
            </div>
            <div className="bg-blue-500 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2 text-white">Nombre de mesures:</h2>
                <p className="text-2xl font-bold text-white">{countNbLigne(data)}</p>
            </div>
            <div className="bg-pink-500 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2 text-white">Nombre de sites:</h2>
                <p className="text-2xl font-bold text-white">{countDistinctSites(data)}</p>
            </div>
            <div className="bg-yellow-500 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-2 text-white">Nombre d'organismes:</h2>
                <p className="text-2xl font-bold text-white">{countDistinctOrganismes(data)}</p>
            </div>

            <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
                    <div className="w-full md:w-1/3 md:mr-2 mb-4 md:mb-0">
                        <DatePicker
                            selected={selectedDate}
                            onChange={onChange}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>
                
        </div>

        <div className="pt-8 pb-0 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-full mx-auto h-auto">

                {/*  */}
                {/* DIAGRAME 1 */}

                
                <div className="bg-blue-100 col-span-2 rounded-lg shadow-md p-6">
                    {/* <h3 className="text-lg font-semibold mb-4">Graphique de ligne</h3> */}
                        <div className="h-48">
                            {dateSelected && (
                                <>
                                <button
                                        onClick={toggleComparing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                        {isComparing ? 'Annuler la comparaison' : 'Comparer'}
                                </button>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <select
                                        value={selectedPollutant}
                                        onChange={(e) => handlePollutantChange(e.target.value)}
                                        className="border rounded-md p-2"
                                        >
                                        <option value="">Sélectionnez un polluant</option>
                                        {pollutants.map(pollutant => (
                                            <option key={pollutant} value={pollutant}>{pollutant}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedSite}
                                        onChange={(e) => setSelectedSite(e.target.value)}
                                        className="border rounded-md p-2"
                                        >
                                        <option value="">Sélectionnez un site</option>
                                        {sites.map(site => (
                                            <option key={site} value={site}>{site}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}       
                      
                            {renderSecondSection()}
                    
                    
                                <ResponsiveContainer width="100%" height="100%">
                                        <MyLineChart />
                                </ResponsiveContainer>

                        </div>
                    </div>
                 


                    {/* Diagramme circulaire */}
                    {/* <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
                            <div className="h-30">
                                <ResponsiveContainer width="100%" height="100%">
                                    <MyRingChart />
                                </ResponsiveContainer>
                            </div>
                    </div> */}







                        {/* pie chart */}
                        <div className="bg-pink-100 col-span-1 rounded-lg shadow-md p-6">
                            <div className="mb-4">
                              
                                    <select
                                        value={selectedSite3}
                                        onChange={(e) => setSelectedSite3(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Sélectionnez un site</option>
                                        {sites.map(site => (
                                            <option key={site} value={site}>{site}</option>
                                        ))}
                                    </select>
                            </div> 
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <MyPieChart />
                                </ResponsiveContainer>
                            </div>
                        </div>
                    {/* MyBarChart */}



                    
                    <div className="bg-pink-100 col-span-1 rounded-lg shadow-md p-6">
                            <div className="mb-4">

                                    <select
                                        value={selectedSite3}
                                        onChange={(e) => setSelectedSite3(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Sélectionnez un site</option>
                                        {sites.map(site => (
                                            <option key={site} value={site}>{site}</option>
                                        ))}
                                    </select>
                            </div>
                            <div className="h-48">
                                <ResponsiveContainer width="110%" height="75%">
                                    <MyBarChart />
                                </ResponsiveContainer>
                             </div>
                          
                        </div>
                    
                    
                    {/* diagramme de dispersion */}

                   

        </div>





        {/* diagramme de dispersion 2 */}


            <div className="pt-8 pb-0 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-full mx-auto h-auto">
                        <div className="bg-purple-100 col-span-1 rounded-lg shadow-md p-6">
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <select
                                        value={selectedPollutant3}
                                        onChange={(e) => setSelectedPollutant3(e.target.value)}
                                        className="border rounded-md p-2"
                                        >
                                        <option value="">Sélectionnez un polluant</option>
                                        {pollutants.map(pollutant => (
                                            <option key={pollutant} value={pollutant}>{pollutant}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedSecondPollutant3}
                                        onChange={(e) => setSelectedSecondPollutant3(e.target.value)}
                                        className="border rounded-md p-2"
                                        >
                                        <option value="">Sélectionnez un polluant</option>
                                        {pollutants.map(pollutant => (
                                            <option key={pollutant} value={pollutant}>{pollutant}</option>
                                        ))}
                                    </select>
                           

                                
                                        <select
                                            value={selectedOrganisme}
                                            onChange={(e) => setSelectedOrganisme(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Sélectionnez un organisme</option>
                                            {Organisme.map(Organisme => (
                                                <option key={Organisme} value={Organisme}>{Organisme}</option>
                                            ))}
                                        </select>
                                  
                            </div>




                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <MyScatterChart2 />
                                </ResponsiveContainer>
                            </div>
                        </div>







                        <div className="bg-purple-100 col-span-1 rounded-lg shadow-md p-6">
                                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <select
                                            value={selectedPollutant2}
                                            onChange={(e) => setSelectedPollutant2(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Sélectionnez un polluant</option>
                                            {pollutants.map(pollutant => (
                                                <option key={pollutant} value={pollutant}>{pollutant}</option>
                                            ))}
                                        </select>
                                  
                                        <select
                                            value={selectedSecondPollutant2}
                                            onChange={(e) => setSelectedSecondPollutant2(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Sélectionnez un polluant</option>
                                            {pollutants.map(pollutant => (
                                                <option key={pollutant} value={pollutant}>{pollutant}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedSite2}
                                            onChange={(e) => setSelectedSite2(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Sélectionnez un site</option>
                                            {sites.map(site => (
                                                <option key={site} value={site}>{site}</option>
                                            ))}
                                        </select>
                                    </div>


                                <div/>     
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <MyScatterChart />
                                </ResponsiveContainer>
                            </div>
                            </div>


                            
                            <div className="bg-yellow-100 col-span-2 rounded-lg shadow-md">
                            <select 
                                value={selectedPollutant4}
                                onChange={(e) => setSelectedPollutant4(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Sélectionnez un polluant</option>
                                {pollutants.map(pollutant => (
                                    <option key={pollutant} value={pollutant}>{pollutant}</option>
                                ))}
                            </select>
                                <MyMap />
                            </div>

                
                   
                







                        


      
            
          
            
            

            

                    </div>
                    </main>
            
            );


};

export default Dashboardrecup;