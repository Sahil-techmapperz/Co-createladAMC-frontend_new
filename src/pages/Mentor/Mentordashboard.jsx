import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./../../CSS/mentor_dashboard.css";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import TableComponent from "../../components/TableComponent.jsx";
import { FaCoins } from "react-icons/fa";
import Scheduled_Sessions from "./../../assets/account-circle.png";
import Total_Clients from "./../../assets/contact2.png";
import Wallet_Balances from "./../../assets/store.png";
import graph1 from "./../../assets/Group 1000002280.png";
import graph2 from "./../../assets/Group 1000002281.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Urlprotected from "../../components/Urlprotected.jsx";

const MentorDashboard = () => {
    const token = JSON.parse(localStorage.getItem("token")) || "";
    let BaseUrl = process.env.REACT_APP_Base_Url;

    const [data1, setdata1] = useState([]);
    const [data2, setdata2] = useState([]);
    const [ScheduledSessions, setScheduledSessions] = useState({
        title: "Scheduled Sessions",
        count: 0,
        percentageChange: "+55%",
        iconSrc: Scheduled_Sessions,
        bgColor: "#4463A4",
    });
    const [TotalMentees, setTotalMentees] = useState({
        title: "Total Mentees",
        count: 0,
        percentageChange: "+30%",
        iconSrc: Total_Clients,
        bgColor: "#4AB2EC",
    });
    const [WalletBalance, setWalletBalance] = useState({
        title: "Wallet Balance",
        count: 0,
        percentageChange: "+10%",
        iconSrc: Wallet_Balances,
        bgColor: "#2F5197",
    });
    const [Upcomeingsession, setUpcomeingsession] = useState([]);


    const data = [
        ScheduledSessions,
        TotalMentees,
        WalletBalance,
    ];

    const GetScheduledSessions = () => {
        let url = `${BaseUrl}/api/session/mentorSessionCounts`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            console.log(res);
            setScheduledSessions(prevSessions => ({
                ...prevSessions,
                count: res.currentMonthCount,
                percentageChange: res.percentageChange,
            }));
        });
    };

    const GetTotalMentees = () => {
        let url = `${BaseUrl}/api/session/client-count`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            console.log(res, "in");
            setTotalMentees(prevTotalMentees => ({
                ...prevTotalMentees,
                count: res.currentMonthClientCount,
                percentageChange: res.percentageChange,
            }));
        });
    };

    const Getlastfiveclients = () => {
        let url = `${BaseUrl}/api/session/lastfiveclients`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            console.log(res, "in");
            setUpcomeingsession(res);
        });
    };

    const Getwalletbalances = () => {
        let url = `${BaseUrl}/api/session/wallet-balances`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            console.log(res, "wallet-balances");
            setWalletBalance(prevWalletBalance => ({
                ...prevWalletBalance,
                count: res.currentWalletBalance
            }));
        });
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${BaseUrl}/api/session/getsession_bymonths_and_getsession_byweek`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            console.log(responseData, "getsession_bymonths_and_getsession_byweek");
            setdata1(responseData.All_Sessions_By_months);
            setdata2(responseData.Sessions_BY_Weeks);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    useEffect(() => {

        fetchData();
        GetScheduledSessions();
        GetTotalMentees();
        Getwalletbalances();
        Getlastfiveclients();
    }, []);



    return (
        <Urlprotected path="Mentor">
        <div className='flex gap-[30px] bg-gray-100'>
            <div className="max-sm:hidden">
                <Sidebar liname={"Dashboard"} />
            </div>
            <div className='flex flex-col mr-[12px] w-full'>
                <Navbar Navtext={"Dashboard"} />
                <div className="h-[90vh] overflow-x-auto overflow-y-auto">
                    <div className='grid grid-cols-1 md:grid-cols-3 items-start w-full gap-5 py-8'>
                        {data.map((item, index) => (
                            <div key={index} className='flex min-h-[132px] flex-col items-center bg-white shadow-sm ring-2 ring-gray-300 ring-opacity-50 rounded-lg p-4'>
                                <div className='flex items-center justify-between w-full'>
                                    <img className={`w-16 object-contain h-16 rounded-[8px] p-2 px-3 relative top-[-35px]`} src={item.iconSrc} alt={`Icon ${index + 1}`} style={{ backgroundColor: item.bgColor }} />
                                    <div>
                                        <p className='font-semibold text-md w-[max-content]'>{item.title}</p>
                                        <p className='text-2xl font-bold'>
                                            {item.title === "Wallet Balance" ? (
                                                <div className="flex justify-center items-center gap-2">
                                                    <FaCoins className="text-[#0796F6]" /> {item.count}
                                                </div>
                                            ) : (
                                                item.count
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {
                                    item.title !== "Wallet Balance" &&
                                    <div className='flex gap-1 w-full'>
                                        <p className='text-sm font-semibold text-green-600'>{item.percentageChange}</p>
                                        <p className='text-sm'>than last month</p>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>

                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-3'>
                        <div className="shadow-sm ring-2 ring-gray-300 ring-opacity-50 rounded-lg px-4 py-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={data1}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="ml-[20px]">
                                <p className="font-bold">All Sessions By months</p>
                                <p className="text-gray-600">just updated</p>
                            </div>
                        </div>

                        <div className="shadow-sm ring-2 ring-gray-300 ring-opacity-50 rounded-lg px-4 py-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={data2}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="ml-[20px]">
                                <p className="font-bold">Sessions BY Weeks</p>
                                <p className="text-gray-600">updated 4 min ago</p>
                            </div>
                        </div>
                    </div>

                    <TableComponent data={Upcomeingsession} className="shadow-inherit" />
                </div>
            </div>
        </div>
        </Urlprotected>
    );
};

export default MentorDashboard;
