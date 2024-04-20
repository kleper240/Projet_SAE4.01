import React from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter, LineChart, Line, BarChart, Bar } from 'recharts';

export const MyScatterChart = ({ selectedSite, selectedPollutant, data }) => {
    // Votre implémentation de composant de Scatter Chart
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey={selectedPollutant} name={selectedPollutant} unit=" unit" />
                <YAxis type="number" dataKey="valeur" name="Valeur" unit="unit" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name={selectedSite} data={data} fill="#8884d8" />
                <Legend />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export const MyLineChart = ({ selectedSite, selectedPollutant, data }) => {
    // Votre implémentation de composant de Line Chart
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Date de début" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valeur" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const MyBarChart = ({ selectedSite, selectedPollutant, data }) => {
    // Votre implémentation de composant de Bar Chart
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom site" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valeur" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const GraphComponents = { MyScatterChart, MyLineChart, MyBarChart };

export default GraphComponents;
