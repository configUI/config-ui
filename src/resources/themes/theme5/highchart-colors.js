'use strict';

window.arrColorThemesForCPU = ['#5655BB', '#8888E0', '#489449', '#83CD82', '#FE2F2F', '#FEA8A8', '#000'];
window.arrColorThemes = ['#3A99D9', '#F1C330', '#7CB5EC', '#434348'];
window.bgColorThemes = ['rgba(255,255,255,0.2)', 'rgba(0,0,0,0)'];
window.arrColorddr = ['#7b4c1699' ,'#3c0b03' , '#816449','#333']; //ddr graphs
function loadHighchartTheme() {
    window.theme = {
            colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
            ],
            chart: {
                backgroundColor: null,
                style: {
                    fontFamily: "'Roboto', sans-serif"
                }
            },
            title: {
                style: {
                    color: "#000",
                    fontSize: '11px',
                    fontWeight: "500",
                    fontFamily: "'Roboto', sans-serif"
                }
            },
            subtitle: {
                style: {
                    color: '#000'
                }
            },
            tooltip: {
                style: {
                    color: '#282828'
                }
            },
            legend: {
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '12px'
                }
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#1d1d1d',
                        fontWeight: 'bold'
                    }
                }
            },
            yAxis: {
                labels: {
                    style: {
                        color: '#1d1d1d',
                        fontWeight: 'bold'
                    }
                },
                title: {
                   style: {"fontSize": "10px", "margin": "10px", "color":"#070707"},
                }
            },
            plotOptions: {
                series: {
                    shadow: true
                },
                candlestick: {
                    lineColor: '#404048'
                },
                map: {
                    shadow: false
                }
            },

            // Highstock specific
            navigator: {
                xAxis: {
                    gridLineColor: '#D0D0D8'
                }
            },
            rangeSelector: {
                buttonTheme: {
                    fill: 'white',
                    stroke: '#C0C0C8',
                    'stroke-width': 1,
                    states: {
                        select: {
                            fill: '#D0D0D8'
                        }
                    }
                }
            },
            scrollbar: {
                trackBorderColor: '#C0C0C8'
            },

            // General
            background2: '#E0E0E8'

        };
};

/**Loading Highchart Theme. */
loadHighchartTheme();
