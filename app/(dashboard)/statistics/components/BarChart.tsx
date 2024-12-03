"use client";
import { FaSyncAlt } from "react-icons/fa";
import Card from "@/components/card";
import { TopTerritory } from "@/api_lib/Dashboard";
import { MdBarChart } from "react-icons/md";
import { useMemo } from "react";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("@/components/charts/BarChart"), {
    loading: () => <></>,
    ssr: false,
});

const TerritoryChart = ({ data, onReload }: { data: TopTerritory[]; onReload?: () => void }) => {
    const barChartData = [
        {
            name: "Revenue",
            data: data?.map(item => item.revenue),
            color: "#6AD2Fa",
        },
        {
            name: "Cost",
            data: data?.map(item => item.cost),
            color: "#4318FF",
        },
    ];

    const barChartOptions = useMemo(() => ({
        chart: {
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            style: {
                fontSize: "12px",
                fontFamily: undefined,
            },
            onDatasetHover: {
                style: {
                    fontSize: "12px",
                    fontFamily: undefined,
                },
            },
            theme: "dark",
        },
        xaxis: {
            categories: data?.map(item => item.name),
            show: true,
            labels: {
                show: true,
                style: {
                    colors: "#A3AED0",
                    fontSize: "14px",
                    fontWeight: "500",
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: false,
            color: "black",
            labels: {
                show: true,
                style: {
                    colors: "#CBD5E0",
                    fontSize: "14px",
                },
            },
        },
        grid: {
            show: false,
            strokeDashArray: 5,
            yaxis: {
                lines: {
                    show: true,
                },
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "#4318FF",
                            opacity: 1,
                        },
                        {
                            offset: 100,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.28,
                        },
                    ],
                    [
                        {
                            offset: 0,
                            color: "#6AD2FF",
                            opacity: 1,
                        },
                        {
                            offset: 100,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.28,
                        },
                    ],
                ],
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: "25px",
            },
        },
        responsive: [{
            breakpoint: 1368,
            options: {
                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        columnWidth: "10px",
                    },
                },
            },
        }]
    }), [data]);

    return (
        <Card className="!p-[20px] text-center w-full mt-4">
            <div className="flex justify-between place-items-center">
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                    Top doanh thu theo khu vực
                </h4>
                <button
                    onClick={onReload}
                    className="-mr-1 -mt-1 p-2 rounded-full text-blue-500 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <FaSyncAlt className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center place-items-center h-full w-full min-h-[300px]">
                {data?.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-300">Không có dữ liệu.</p>
                ) : !data ? (
                    <svg
                        aria-hidden="true"
                        className="w-14 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                ) : (
                    <div className="h-full min-h-[300px] w-full">
                        {/* @ts-ignore */}
                        <BarChart chartData={barChartData} chartOptions={barChartOptions} />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TerritoryChart;