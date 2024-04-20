import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MyLineChart, MyScatterChart, MyBarChart } from './GraphComponents'; // Importez les composants de graphiques
import { csvToJson, formatDate } from './helpers'; // Importez les fonctions nécessaires depuis le fichier helpers

const Dashrecup = () => {
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPollutant, setSelectedPollutant] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
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
                setDateSelected(true); // Mettre à jour l'état pour indiquer que la date a été sélectionnée
            } catch (error) {
                console.error("Error:", error);
            }
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            let selectedDateFormatted = formatDate(selectedDate);
            const fileName = `FR_E2_${selectedDateFormatted}.csv`;
            await geodairAPI.fetchData(selectedDateFormatted, fileName);
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

            {/* la partie pour le boutton  */}
            
            <div  className="w-full md:w-1/3 mt-4 md:mt-0">
                
                <button
                    onClick={toggleComparing}
                    className="ml-auto mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    {isComparing ? 'Annuler la comparaison' : 'Comparer'}
                </button>
                
                
            </div>
        

           {/* quand le boutton seras active on vas appaler cette methode  */}
            <br />
            {renderSecondSection()}
            <br />

            {/* GraphComponents */}
            <div className="grid grid-cols-2 gap-4">
                {/* Line Chart */}
                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Line chart</h2>
                    <div className="border border-gray-300 h-52">

                        <MyLineChart
                            selectedSite={selectedSite}
                            selectedPollutant={selectedPollutant}
                            data={data}
                        />
                    </div>
                </div>
                {/* Scatter Chart */}
                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Scatter chart</h2>
                    <div className="border border-gray-300 h-32">

                        <MyScatterChart
                            selectedSite={selectedSite}
                            selectedPollutant={selectedPollutant}
                            data={data}
                        />

                    </div>
                </div>
                {/* Bar Chart */}
                <div className="border p-4">
                    <h2 className="text-lg font-semibold mb-4">Bar chart</h2>
                    <div className="border border-gray-300 h-52">

                        <MyBarChart
                            selectedSite={selectedSite}
                            selectedPollutant={selectedPollutant}
                            data={data}
                        />

                    </div>
                </div>
            </div>
        </div>
    );

    
};

export default Dashrecup;
