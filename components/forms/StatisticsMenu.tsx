import React from 'react';
import { Bar } from 'react-chartjs-2';

const StatisticsMenu = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            label: 'Data Set',
            data: data.map(item => item.value),
            backgroundColor: 'rgba(75,192,192,0.6)',
        }]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default StatisticsMenu;
