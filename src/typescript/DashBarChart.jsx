// BarChart.js

import React from 'react';
import { Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts';

const BarChartComponent = ({ data, selectedPollutant, selectedSite, selectedSecondSite, isComparing }) => {
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
                {isComparing && <Bar dataKey="valeur" fill="#82ca9d" />}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
