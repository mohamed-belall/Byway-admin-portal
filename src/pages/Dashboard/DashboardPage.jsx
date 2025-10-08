import { useEffect } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import DashboardService from "../../services/DashboardService";
import { useAtom } from "jotai";
import { DashboardAtom } from "../../atoms/DashboardAtom";
import {
  Users,
  BookOpen,
  FolderOpen,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useAtom(DashboardAtom);
  const fetchDashboardData = async () => {
    const data = await DashboardService.getDashboardData();

    setDashboardData({
      instructorsCount: data.instructorsCount,
      studentsCount: data.studentsCount,
      categoriesCount: data.categoriesCount,
      courseCount: data.courseCount,
      walletBalance: 37500,
      walletGrowth: 2.45,
      deposits: 108000,
    });
  };

  const walletChartData = [
    { month: "Jan", deposits: 45, withdrawals: 30 },
    { month: "Feb", deposits: 60, withdrawals: 40 },
    { month: "Mar", deposits: 75, withdrawals: 50 },
    { month: "Apr", deposits: 65, withdrawals: 45 },
    { month: "May", deposits: 90, withdrawals: 55 },
    { month: "Jun", deposits: 85, withdrawals: 50 },
    { month: "Jul", deposits: 100, withdrawals: 60 },
  ];

  const statisticsData = [
    { name: "Students", value: dashboardData.studentsCount, color: "#E5E7EB" },
    {
      name: "Instructors",
      value: dashboardData.instructorsCount,
      color: "#4F46E5",
    },
    { name: "Courses", value: dashboardData.courseCount, color: "#22D3EE" },
  ];

  const cardsData = [
    {
      count: dashboardData.instructorsCount,
      title: "Instructors",
      icon: Users,
      bgColor: "bg-blue-100",
    },
    {
      count: dashboardData.studentsCount,
      title: "Students",
      icon: Users,
      bgColor: "bg-green-100",
    },
    {
      count: dashboardData.courseCount,
      title: "Courses",
      icon: BookOpen,
      bgColor: "bg-orange-100",
    },
    {
      count: dashboardData.categoriesCount,
      title: "Categories",
      icon: FolderOpen,
      bgColor: "bg-red-100",
    },
  ];

  const formatCurrency = (amount) => {
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(amount / 1000) + "K"
    );
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className="flex flex-col px-5 py-10 w-full  h-auto gap-10">
      <div className="flex flex-row gap-4 ">
        {cardsData.map((item, index) => (
          <div
            key={index}
            className="flex flex-row justify-between bg-white px-5 py-5 w-full shadow-md rounded-2xl h-auto"
          >
            <div className="flex flex-col items-start  gap-3">
              <div className="font-bold text-4xl">{item.count}</div>
              <div className="font-semibold text-xl">{item.title}</div>
            </div>
            <div className=" text-2xl ">
              <div className={`${item.bgColor} rounded-2xl p-4`}>
                <item.icon />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-8 gap-6">
        {/* Wallet Card - Takes 2 columns */}
        <div className="lg:col-span-4 2xl:col-span-5 flex flex-col justify-center  bg-white rounded-2xl px-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between ">
            <h3 className="text-2xl font-bold text-gray-900">Wallet</h3>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">This month</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex justify-center items-center gap-5">
            <div className="flex flex-col justify-start">
              <div className="text-4xl font-bold text-start text-indigo-600 ">
                {formatCurrency(dashboardData.walletBalance)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Wallet Balance</span>
                <div className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">
                    +{dashboardData.walletGrowth}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-500 font-medium">
                  On your account
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={walletChartData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 18 }}
                  />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="deposits"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 4, r: 6 }}
                    activeDot={{ r: 14, fill: "#6366f1" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", strokeWidth: 4, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
              <span className="text-gray-600 text-sm">Deposits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-gray-600 text-sm">Withdrawals</span>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="2xl:col-span-3 lg:col-span-4 flex flex-col justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h3>

          <div className="flex justify-center mb-6">
            <PieChart width={220} height={220}>
              <Pie
                data={statisticsData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {statisticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          {/* Legend */}
          <div className="flex flex-row justify-center px-3 py-4 rounded-2xl border-2 border-blue-50 shadow-2xl shadow-blue-200 ">
            {statisticsData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col  justify-center items-center  px-9  border-r border-r-gray-200 last:border-0"
              >
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="text-lg text-gray-600">{item.name}</div>
                </div>
                <span className="font-semibold text-gray-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
