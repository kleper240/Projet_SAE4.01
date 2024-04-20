// ScatterChart.js

import React from 'react';
import { Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ScatterChart } from 'recharts';
import {transformData } from '../components/helpers';

const ScatterChartComponent = ({ data, selectedPollutant, selectedSite, selectedSecondPollutant, selectedSecondSite, isComparing }) => {
    const transformedData = transformData(data);
    const selectedSitesData = transformedData.filter(item => item['nom site'] === selectedSite || item['nom site'] === selectedSecondSite);
    const scatterChartData = selectedSitesData.map((item, index) => ({
        'nom site': item['nom site'],
        [selectedPollutant]: parseFloat(item[selectedPollutant]),
        [selectedSecondPollutant]: parseFloat(item[selectedSecondPollutant]),
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

export default ScatterChartComponent;
