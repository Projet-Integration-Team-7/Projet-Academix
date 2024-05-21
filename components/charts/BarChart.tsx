import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

/**
 * Composant BarChart
 * 
 * Affiche un graphique à barres en utilisant les données fournies.
 * 
 * @param chartData Les données du graphique à afficher.
 * @returns Le composant BarChart.
 */
const BarChart = ({ chartData }: any) => {
    return (
        <div>
            <Bar data={chartData}  />
        </div>
    );
};

export default BarChart;
