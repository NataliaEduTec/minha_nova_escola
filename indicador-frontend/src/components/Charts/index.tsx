import ApexCharts from 'apexcharts'

import { useEffect, useRef } from 'react'

type Props = {
    options: ApexCharts.ApexOptions;
    className?: string;
    percentage?: boolean
}

export default function Charts({ options, className = '', percentage = false }: Props) {
    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = new ApexCharts(chartRef.current, {
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true,
                        type: 'x',
                        autoScaleYaxis: false,
                        allowMouseWheelZoom: true,
                        zoomedArea: {
                            fill: {
                                color: '#90CAF9',
                                opacity: 0.4
                            },
                            stroke: {
                                color: '#0D47A1',
                                opacity: 0.4,
                                width: 1
                            }
                        }
                    },
                    ...options.chart,
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%',
                        borderRadius: 5,
                        borderRadiusApplication: 'end',
                        dataLabels: {
                            position: 'top'
                        }
                    },
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#000',
                                    formatter: function (w: { globals: { seriesTotals: any[]; }; }) {
                                        // Soma todos os valores da série
                                        const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                        return total.toString();
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        position: 'bottom',
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                dataLabels: {
                    enabled: true,
                    position: 'top',
                    offsetY: -13,
                    style: {
                        colors: ['#000'],
                        background: '#fff',
                        borderRadius: 5,
                    },
                    // colocar uma porcentagem % no final do valor
                    ...(percentage && {formatter: function (val: number) {
                        return val.toFixed(2).toString().replace(".", ",") + '%';
                    }})
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent'],
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'right',
                    offsetY: 40
                },
                ...options
            })
            chart.render()

            return () => {
                chart.destroy()
            }
        }
    }, [options])

    return <div ref={chartRef} className={`w-full h-full ${className}`} />
}