export const options = {
    scales: {
        y: {
            ticks: {
                color: 'rgb(255,255,255)',
                font: {
                    family: 'Heebo',
                    weight: '300',
                    size: 16,
                }
            },
            grid: {
                color: 'rgba(255,255,255,0.5)'
            }
        },
        x: {
            ticks: {
                color: 'rgb(255,255,255)',
                font: {
                    family: 'Heebo',
                    weight: '300',
                    size: 16,
                }
            },
            grid: {
                color: 'rgba(255,255,255,0.5)'
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    },
    events: ['click'],
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgb(255,255,255)',
    color: 'rgb(255,255,255)',
    maintainAspectRatio: false
}

export const doughnutOptions = {
    plugins: {
        legend: {
            labels: {
                font: {
                    family: 'Heebo',
                    weight: '300',
                    size: 16,
                }
            },
        }
    },
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgb(255,255,255)',
    color: 'rgb(255,255,255)',
    maintainAspectRatio: false
}

export const chartColors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
]