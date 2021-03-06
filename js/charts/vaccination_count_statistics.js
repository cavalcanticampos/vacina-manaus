var defaultData = 'https://raw.githubusercontent.com/pvfrota/vacina-manaus/master/db/vaccination_count.csv';

function vaccinationCountStatistics() {
    Highcharts.chart('vaccination-count-statistics-chart', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Vacinas aplicadas x A aplicar (estimado)'
        },
        accessibility: {
            announceNewData: {
                enabled: true,
                minAnnounceInterval: 15000,
                announcementFormatter: function (allSeries, newSeries, newPoint) {
                    if (newPoint) {
                        return 'New point added. Value: ' + newPoint.y;
                    }
                    return false;
                }
            }
        },
        data: {
            csvURL: defaultData,
            enablePolling: true,
            dataRefreshRate: 10
        }
    });
}

// Create the chart
vaccinationCountStatistics();