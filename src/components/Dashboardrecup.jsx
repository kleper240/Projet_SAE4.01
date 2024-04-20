import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,  AreaChart, BarChart, Area, Bar,RadarChart,Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';
import { ResponsiveContainer } from 'recharts';
import { ScatterChart, Scatter } from 'recharts';
import { getMaxValue, transformData, formatDate, csvToJson } from './helpers';
// import coord from './coord.csv';
import {Cell} from 'recharts';
import { PureComponent } from 'react';
import {ComposedChart} from 'recharts';



import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';



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
   
        // const transformedData = transformData(data);
        // const averages = calculateAverageFromTransformedData(transformedData);

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
                    
                    <div className="w-30 md:mx-2 mb-4 md:mb-0">
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

                    <div className="w-30 mt-4 md:mt-0 pl-3">
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

                    <div className="w-30 mt-4 md:mt-0 pl-3">
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
        
        // Filtrer les données pour inclure uniquement les deux sites sélectionnés
        const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite || item['nom site'] === selectedSecondSite);
    
        // Mapper les données pour ScatterChart
        const scatterChartData = selectedSitesData.map((item, index) => ({
            'nom site': item['nom site'],
            [selectedPollutant]: parseFloat(item[selectedPollutant]), // Convertir en nombre
            [selectedSecondPollutant]: parseFloat(item[selectedSecondPollutant]), // Convertir en nombre
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
                    <XAxis type="number" dataKey={selectedPollutant} name={selectedPollutant} unit=" unit" />
                    <YAxis type="number" dataKey={selectedSecondPollutant} name={selectedSecondPollutant} unit="unit" />
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
    
    
    

    const MyLineChart = () => {
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data2.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
        const max = Math.max(getMaxValue(filteredData), getMaxValue(filteredData2)); // Get the maximum value from both sets of data
        // console.log(max)
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

    

    const MyRadar = () => {
        const filteredData = data.filter(item => item.Polluant === 'NO' && item['nom site'] === selectedSite);
        const filteredData2 = data.filter(item => item.Polluant === 'NO2' && item['nom site'] === selectedSite);
        const filteredData3 = data.filter(item => item.Polluant === 'NOX as NO2' && item['nom site'] === selectedSite);
        const filteredData4 = data.filter(item => item.Polluant === 'PM2.5' && item['nom site'] === selectedSite);
        const filteredData5 = data.filter(item => item.Polluant === 'O3' && item['nom site'] === selectedSite);
        const filteredData6 = data.filter(item => item.Polluant === 'PM10' && item['nom site'] === selectedSite);
    
        const filteredData7 = data2.filter(item => item.Polluant === 'NO' && item['nom site'] === selectedSecondSite);
        const filteredData8 = data2.filter(item => item.Polluant === 'NO2' && item['nom site'] === selectedSecondSite);
        const filteredData9 = data2.filter(item => item.Polluant === 'NOX as NO2' && item['nom site'] === selectedSecondSite);
        const filteredData10 = data2.filter(item => item.Polluant === 'PM2.5' && item['nom site'] === selectedSecondSite);
        const filteredData11 = data2.filter(item => item.Polluant === 'O3' && item['nom site'] === selectedSecondSite);
        const filteredData12 = data2.filter(item => item.Polluant === 'PM10' && item['nom site'] === selectedSecondSite);
    
        const radarData = [
            {
                subject: 'NO',
                A: Math.max(getMaxValue(filteredData)),
                B: Math.max(getMaxValue(filteredData7)),
                fullMark: 150,
            },
            {
                subject: 'NO2',
                A: Math.max(getMaxValue(filteredData2)),
                B: Math.max(getMaxValue(filteredData8)),
                fullMark: 150,
            },
            {
                subject: 'NOX as NO2',
                A: Math.max(getMaxValue(filteredData3)),
                B: Math.max(getMaxValue(filteredData9)),
                fullMark: 150,
            },
            {
                subject: 'PM2.5',
                A: Math.max(getMaxValue(filteredData4)),
                B: Math.max(getMaxValue(filteredData10)),
                fullMark: 150,
            },
            {
                subject: 'O3',
                A: Math.max(getMaxValue(filteredData5)),
                B: Math.max(getMaxValue(filteredData11)),
                fullMark: 150,
            },
            {
                subject: 'PM10',
                A: Math.max(getMaxValue(filteredData6)),
                B: Math.max(getMaxValue(filteredData12)),
                fullMark: 150,
            },
        ].map(item => ({
            ...item,
            A: item.A === -Infinity ? 0 : item.A,
            B: item.B === -Infinity ? 0 : item.B,
        }));
    
        console.log(radarData);
    
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={selectedSite} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name={selectedSecondSite} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        );
    };
    
    
    


    const MyBarChart = () => {
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && (item['nom site'] === selectedSite || item['nom site'] === selectedSecondSite));
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom site" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valeur" fill="#8884d8" />
                    {isComparing && <Bar dataKey="valeur" fill="#82ca9d" />} {/* Optionnel */}
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const MyBiaxalBarChart = () => {
        // Filtrer les données pour le premier polluant sélectionné et le site sélectionné
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
    
        // Création du tableau de données à afficher dans le graphique
        const dataToDisplay = Array.from({ length: 24 }, (_, index) => ({
            name: (filteredData[index] && filteredData[index]['Date de début']) || "Unknown Date",
            [selectedPollutant]: filteredData[index] ? filteredData[index].valeur : 0,
            [selectedSecondPollutant]: filteredData2[index] ? filteredData2[index].valeur : 0
        }));
    
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataToDisplay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey={selectedPollutant} fill="#8884d8" name={selectedPollutant} />
                    <Bar yAxisId="right" dataKey={selectedSecondPollutant} fill="#82ca9d" name={selectedSecondPollutant} />
                </BarChart>
            </ResponsiveContainer>
        );
    };
    

    
    

    const MyStackedAreaChart = () => {
        // Filtrer les données pour le premier polluant sélectionné et le site sélectionné
        const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
        const filteredData2 = data.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite);
    
        // Création du tableau de données à afficher dans le graphique
        const dataToDisplay = Array.from({ length: 24 }, (_, index) => ({
            name: (filteredData[index] && filteredData[index]['Date de début']) || "Unknown Date",
            [selectedPollutant]: filteredData.length > index ? filteredData[index].valeur : 0,
            [selectedSecondPollutant]: filteredData2.length > index ? filteredData2[index].valeur : 0
        }));
    
        return (
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    width={500}
                    height={400}
                    data={dataToDisplay}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey={selectedPollutant} stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey={selectedSecondPollutant} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
            </ResponsiveContainer>
        );
    };
    

    // const MyStackedAreaChart = ({ data, selectedPollutant, selectedSecondPollutant }) => {
    //     if (!data || data.length === 0) {
    //         return <p>Data is loading...</p>; // Display a loading message or a spinner
    //     }
    
    //     // Helper function to parse week number
    //     const getWeekNumber = (date) => {
    //         const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    //         const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    //         return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    //     };
    
    //     // Function to group data by weeks
    //     const groupDataByWeek = (data) => {
    //         return data.reduce((acc, item) => {
    //             const date = new Date(item['Date de début']);
    //             const weekNum = getWeekNumber(date);
    //             const weekKey = `Week ${weekNum}`;
    //             if (!acc[weekKey]) {
    //                 acc[weekKey] = { name: weekKey, [selectedPollutant]: 0, [selectedSecondPollutant]: 0 };
    //             }
    //             acc[weekKey][selectedPollutant] += Number(item[selectedPollutant] || 0);
    //             acc[weekKey][selectedSecondPollutant] += Number(item[selectedSecondPollutant] || 0);
    //             return acc;
    //         }, {});
    //     };
    
    //     const weeklyData = Object.values(groupDataByWeek(data));
    
    //     return (
    //         <ResponsiveContainer width="100%" height={400}>
    //             <AreaChart
    //                 data={weeklyData}
    //                 margin={{
    //                     top: 10, right: 30, left: 0, bottom: 0,
    //                 }}
    //             >
    //                 <CartesianGrid strokeDasharray="3 3" />
    //                 <XAxis dataKey="name" />
    //                 <YAxis />
    //                 <Tooltip />
    //                 <Area type="monotone" dataKey={selectedPollutant} stackId="1" stroke="#8884d8" fill="#8884d8" />
    //                 <Area type="monotone" dataKey={selectedSecondPollutant} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
    //             </AreaChart>
    //         </ResponsiveContainer>
    //     );
    // };
   



    // function fetchDataAndConvertToJson() {
    //     return fetch(coord)
    //       .then(response => response.text())
    //       .then(data => {
    //         return csvToJson(data);
    //       });
    //   }
    //     const MyMap = () => {
    //       const [mergedData, setMergedData] = useState([]);
        
    //       useEffect(() => {
    //         fetchDataAndConvertToJson()
    //           .then(jsonData => {
    //             const transformedData = transformData(data);
    //             const mergedData = transformedData.map(dataObj => {
    //               const matchjsondata = jsonData.find(
    //                 jsonObj =>
    //                   jsonObj["code station"] === dataObj["code station"] 
                      
    //               );
                  
    //               if (matchjsondata) {
    //                 let latitude = parseFloat(matchjsondata.Latitude.replace(",", "."));
    //                 let longitude = parseFloat(matchjsondata.Longitude.replace(",", "."));
    //                 console.log(latitude, longitude);
    //                 return { ...dataObj, latitude: latitude, longitude: longitude };
    //               } else {
                     
    //                 return dataObj;
    //               }
    //             });
    //             setMergedData(mergedData);
    //           });
    //       }, []);
        
    //       return (
    //         <>
            
            
    //           <MapContainer center={position} zoom={6} style={{ height: '730px', width: '100%' }}>
    //             <TileLayer
    //               // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?key=q5ys1RZA0YUSXpDxGDcU"
    //               url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    //               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //             />
    //             {mergedData.map((item, index) => {
    //               const { latitude, longitude } = item;
    //               console.log(index);
                
    //               // Vérifier si les coordonnées sont définies et valides
    //               if (latitude !== undefined && longitude !== undefined) {
                      
    //                 return (
    //                   <Marker key={index} position={[latitude, longitude]}>
    //                   <Popup>
    //                     {/* Contenu du popup pour chaque marqueur */}
    //                     <div>
    //                       <h3>{item["code station"]}</h3>
    //                       <p>Latitude: {latitude}</p>
    //                       <p>Longitude: {longitude}</p>
    //                       {/* Autres informations à afficher */}
    //                     </div>
    //                   </Popup>
    //                 </Marker>
    //                 );
    //               }
    //               // Si les coordonnées sont invalides, ne pas créer le marqueur
               
    //             })}
    //           </MapContainer>
      
    //         </>
    //       );
    //   };

    
    return (

        <>
        <div className="container mx-auto mt-8">




            <div className="grid grid-cols-2 gap-4">


                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Line chart</h2>
                    <div className="border border-gray-300 h-52">
                        <MyLineChart />
                    </div>
                </div>

                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Diagramme de dispertion</h2>
                    <div className="border border-gray-300 h-32">
                        <MyScatterChart />
                    </div>
                </div>

                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Line chart</h2>
                    <div className="border border-gray-300 h-52">
                        <MyBarChart />
                    </div>
                </div>

                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Line chart</h2>
                    <div className="border border-gray-300 h-62">
                        <MyRadar/>
                    </div>
                </div>







                {/* <div className="border p-4">
                            <select 
                                value={selectedPollutant4}
                                onChange={(e) => setSelectedPollutant4(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                                <option value="">Sélectionnez un polluant</option>
                                {pollutants.map(pollutant => (
                                    <option key={pollutant} value={pollutant}>{pollutant}</option>
                                ))}
                            </select>
                            <MyMap />
                </div> */}

            </div>


        </div>


        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 auto-rows-[140px] gap-3 my-10">

                <div className =" bg-neutral-100 border-2 rounded-xl p-2  md col-span-4 row-span-1">

                    <div className="flex flex-row md:flex-row items-start md:items-center">
                                <div className="w-30  md:mr-2 mb-4 md:mb-0">
                                    <DatePicker
                                        
                                        //on fait en sort que handleFetchData soit appelé lorsqu'on selectionne une date

                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date);
                                            handleFetchData(); // Appel automatique de la fonction pour récupérer les données dès que la date est sélectionnée
                                        }}                        dateFormat="dd/MM/yyyy"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {dateSelected && (
                                    <>
                                        <div className="w-30 md:mx-2 mb-4 md:mb-0">
                                            <select
                                                value={selectedPollutant}
                                                onChange={(e) => handlePollutantChange(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Sélectionnez un polluant</option>
                                                {pollutants.map(pollutant => (
                                                    <option key={pollutant} value={pollutant}>{pollutant}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-30 mt-4 md:mt-0 pl-3">
                                            <select
                                                value={selectedSite}
                                                onChange={(e) => setSelectedSite(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Sélectionnez un site</option>
                                                {sites.map(site => (
                                                    <option key={site} value={site}>{site}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-30 mt-4 md:mt-0 pl-3">
                                        <button
                                                onClick={toggleComparing}
                                                className="w-full ml-auto  px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                            >
                                                {isComparing ? 'Annuler la comparaison' : 'Comparer'}
                                        </button>

                                        </div>

                                </>
                            )}
                    </div>
           
                    <br />
                    {renderSecondSection()}
                    <br />


                </div>
                <div className =" bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center w-20px ">
                    <h2 className="text-xl text-gray-600">objet1</h2>
                </div>
                <div className =" bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center  ">
                    <h2 className="text-xl text-gray-600">objet2</h2>
                </div>
                <div className=" bg-neutral-100 border-2 rounded-xl p-2     md col-span-2 ">
                    <div className="border border-gray-300 h-full">
                        <MyLineChart />
                    </div>
                </div>
                <div className=" bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center  md col-span-2  ">
                    <h2 className="text-xl text-gray-600">objet4</h2>
                </div>
                <div className=" bg-neutral-100 border-2 rounded-xl p-2     md col-span-2 row-span-2">
                    {/* <h2 className="text-xl text-gray-600">objet5</h2> */}
                    <div className="border border-gray-300 h-full">
                        <MyLineChart />
                    </div>

                </div>
                <div className=" bg-neutral-100 border-2 rounded-xl p-2     md  row-span-2">
                    {/* <h2 className="text-xl text-gray-600">objet6</h2> */}
                    <div className="border border-gray-300 h-full">
                        <MyRadar/>
                    </div>
                </div>
                <div className=" bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center    md  row-span-2">
                    <h2 className="text-xl text-gray-600">objet7</h2>
                </div>
                <div className=" bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center    md col-span-2">
                    <h2 className="text-xl text-gray-600">objet8</h2>

                    
                </div>
                
            </div>
        </div>

        </>
    );
};



export default Dashboardrecup;