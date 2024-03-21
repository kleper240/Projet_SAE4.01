import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { formatDate, csvToJson } from './helpers';

const Dashboardrecup = () => {
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPollutant, setSelectedPollutant] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [pollutants, setPollutants] = useState([]);
    const [sites, setSites] = useState([]);

    const geodairAPI = {
        baseUrl: "http://localhost:3001/api/data",
        fetchData: async function (selectedDate, fileName) {
            let url = `${this.baseUrl}/${selectedDate}/${fileName}`;

            try {
                let response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Réponse HTTP erronée : ${response.status} - ${response.statusText}`);
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
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let selectedDateFormatted = formatDate(selectedDate);
            const fileName = `FR_E2_${selectedDateFormatted}.csv`;
            await geodairAPI.fetchData(selectedDateFormatted, fileName);
        };
        fetchData();
    }, [selectedDate]);

    const handlePollutantChange = (pollutant) => {
        setSelectedPollutant(pollutant);
        const filteredSites = data.filter(item => item.Polluant === pollutant).map(item => item['nom site']);
        setSites([...new Set(filteredSites)]);
    };

    return (


        
        <div className="container mx-auto mt-8">
            <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                dateFormat="dd/MM/yyyy"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div className="mt-4">
                <select
                    value={selectedPollutant}
                    onChange={(e) => handlePollutantChange(e.target.value)}
                    className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                    <option value="">Sélectionnez un polluant</option>
                    {pollutants.map(pollutant => (
                        <option key={pollutant} value={pollutant}>{pollutant}</option>
                    ))}
                </select>
            </div>
            <div className="mt-4">
                <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                    <option value="">Sélectionnez un site</option>
                    {sites.map(site => (
                        <option key={site} value={site}>{site}</option>
                    ))}
                </select>
            </div>
            {/* <div className="mt-4">
                {data && data.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>{`Polluant: ${item.Polluant}, Site: ${item['nom site']}, Valeur: ${item.valeur}`}</li>
                        ))}
                    </ul>
                )}
            </div> */}

            


            



        
        </div>
    );
};

 
export default Dashboardrecup;