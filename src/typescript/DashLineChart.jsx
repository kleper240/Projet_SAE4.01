// LineChart.js

import React from 'react';
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart } from 'recharts';
import { getMaxValue } from '../components/helpers';

const LineChartComponent = ({ data, selectedPollutant, selectedSite, selectedSecondPollutant, selectedSecondSite, isComparing }) => {
    const filteredData = data.filter(item => item.Polluant === selectedPollutant && item['nom site'] === selectedSite);
    const filteredData2 = isComparing ? data.filter(item => item.Polluant === selectedSecondPollutant && item['nom site'] === selectedSecondSite) : [];
    const max = Math.max(getMaxValue(filteredData), getMaxValue(filteredData2));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date de début" />
                <YAxis domain={[0, max]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valeur" stroke="#8884d8" />
                {isComparing && <Line type="monotone" dataKey="valeur" stroke="#82ca9d" data={filteredData2} />}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;
