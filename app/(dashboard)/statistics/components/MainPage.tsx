"use client";

import { useEffect, useState } from "react";
import Widget from "@/components/widget";
import { FaMoneyBillWave, FaCoins, FaChartLine, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { DashboardOperation, OverviewProgression, OverviewStats, TopProduct, TopTerritory } from "@/api_lib/Dashboard";
import { IoIosAdd, IoIosBrowsers } from "react-icons/io";
import { IoShareOutline } from "react-icons/io5";
import PieChartCard from "./PieChartCard";
import TotalSpent from "./ProgressChart";
import TerritoryChart from "./BarChart";

const StatisticsMain = () => {
    const dashboardOperation = new DashboardOperation();
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [progression, setProgression] = useState<OverviewProgression[] | null>(null);
    const [topProducts, setTopProducts] = useState<TopProduct[] | null>(null);
    const [topTerritory, setTopTerritory] = useState<TopTerritory[] | null>(null);

    const fetchProgression = async () => {
        const token = localStorage?.getItem("accessToken");
        const result = await dashboardOperation.getOverviewProgression({ token });
        if (!result.error) {
            setProgression(result.data);
            console.log(result.data);
        }
    };

    const fetchTopProducts = async () => {
        setTopProducts(null);
        const token = localStorage?.getItem("accessToken");
        const result = await dashboardOperation.getTopProducts({ token });
        if (!result.error) {
            setTopProducts(result.data);
        }
    };

    const fetchTopTerritory = async () => {
        setTopTerritory(null);
        const token = localStorage?.getItem("accessToken");
        const result = await dashboardOperation.getTopTerritory({ token });
        if (!result.error) {
            setTopTerritory(result.data);
        }
    };

    useEffect(() => {
        const fetchData = async () => {

            const token = localStorage?.getItem("accessToken");
            const result = await dashboardOperation.getOverviewStats({ token });
            if (!result.error) {
                setStats(result.data);
            }
        };

        fetchData();
        fetchProgression();
        fetchTopProducts();
        fetchTopTerritory();
    }, []);

    const reloadRevenue = async () => {
        setStats((prev) => ({ ...prev, revenue: null }));
        const token = localStorage?.getItem("accessToken");
        const result = await dashboardOperation.getOverviewStats({ token });
        if (!result.error) {
            setStats((prev) => ({ ...prev, revenue: result.data.revenue }));
        }
    };

    const reloadCost = async () => {
        setStats((prev) => ({ ...prev, cost: null }));
        const token = localStorage?.getItem("accessToken");
        const result = await dashboardOperation.getOverviewStats({ token });
        if (!result.error) {
            setStats((prev) => ({ ...prev, cost: result.data.cost }));
        }
    };

    const reloadProfit = async () => {
        setStats((prev) => ({ ...prev, profit: null }));
        const dashboardOperation = new DashboardOperation();
        const token = localStorage?.getItem("accessToken");
        const result = await dashboardOperation.getOverviewStats({ token });
        if (!result.error) {
            setStats((prev) => ({ ...prev, profit: result.data.profit }));
        }
    };

    return (
        <>
            <div className="sticky top-0 w-full flex gap-2 z-10 bg-white dark:bg-[#242526] h-12 min-h-12 px-2 justify-center place-items-center">
                <div className="gap-1 px-1 flex">
                    <FaAngleLeft className="w-5 h-5" />
                    <FaAngleRight className="w-5 h-5" />
                </div>

                <div className="dark:bg-[#3A3B3C] bg-lightPrimary rounded-full flex w-full h-9 overflow-clip relative"></div>

                <div className="gap-2 px-1 flex">
                    <IoShareOutline className="w-5 h-5" />
                    <IoIosAdd className="w-6 h-6" />
                    <IoIosBrowsers className="w-5 h-5" />
                </div>
            </div>
            <div className="bg-lightPrimary dark:!bg-[#3a3b3c]/20 p-4">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 2xl:grid-cols-3 pb-4">
                    <Widget
                        icon={<FaMoneyBillWave className="w-7 h-7" />}
                        title="Doanh thu (30 ngày)"
                        subtitle={!stats?.revenue?.toLocaleString() ? "Loading..." : stats?.revenue.toLocaleString() + " $"}
                        onReload={reloadRevenue}
                    />
                    <Widget
                        icon={<FaCoins className="w-7 h-7" />}
                        title="Chi phí (30 ngày)"
                        subtitle={!stats?.cost?.toLocaleString() ? "Loading..." : stats?.cost.toLocaleString() + " $"}
                        onReload={reloadCost}
                    />
                    <Widget
                        icon={<FaChartLine className="w-7 h-7" />}
                        title="Lợi nhuận (30 ngày)"
                        subtitle={!stats?.profit?.toLocaleString() ? "Loading..." : stats?.profit.toLocaleString() + " $"}
                        onReload={reloadProfit}
                    />
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                    <PieChartCard topProducts={topProducts} onReload={fetchTopProducts} />
                    <TotalSpent data={progression} />
                </div>
                <TerritoryChart data={topTerritory} onReload={fetchTopTerritory} />
            </div>
        </>
    );
};

export default StatisticsMain;