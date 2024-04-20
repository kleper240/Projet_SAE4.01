import React, { useState, useEffect } from 'react';
import { csvToJson, formatDate } from './helpers';

const DataRetrieval = ({ selectedDate, setData, setPollutants, setSites }) => {
    const [dateSelected, setDateSelected] = useState(false);

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
                setDateSelected(true);
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

    return null; // Ou tout autre élément React que vous souhaitez utiliser comme placeholder
};

export default DataRetrieval;
