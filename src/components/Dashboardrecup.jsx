import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';
import 'tailwindcss/tailwind.css';
import { ResponsiveContainer } from 'recharts';

import { ScatterChart, Scatter } from 'recharts';


import { getMaxValue, calculateAverageFromTransformedData, transformData, formatDate, csvToJson } from './helpers';

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

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="w-full md:w-1/3 md:mr-2 mb-4 md:mb-0">
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
                        <div className="w-full md:w-1/3 md:mx-2 mb-4 md:mb-0">
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

                        <div className="w-full md:w-1/3 mt-4 md:mt-0">
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
                    </>
                )}
            </div>
            
            <div  className="w-full md:w-1/3 mt-4 md:mt-0">
                
                <button
                    onClick={toggleComparing}
                    className="ml-auto mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    {isComparing ? 'Annuler la comparaison' : 'Comparer'}
                </button>
                
                
            </div>
        

           
            <br />

            

            {renderSecondSection()}
            <br />

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
                    <h2 className="text-lg font-semibold mb-4">Graphique 3</h2>
                    <div className="border border-gray-300 h-32">
                        {/* Insérez le contenu du graphique 3 ici */}
                    </div>
                </div>

                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Graphique 4</h2>
                    <div className="border border-gray-300 h-32">
                        {/* Insérez le contenu du graphique 4 ici */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboardrecup;
