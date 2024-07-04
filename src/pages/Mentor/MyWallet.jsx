import React, { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO, startOfDay, endOfDay, compareAsc } from 'date-fns';
import "./../../CSS/MyWallet.css";
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import Urlprotected from '../../components/Urlprotected.jsx';



function MyWallet() {
  const [actualData,setactualData] =useState();
  const token=JSON.parse(localStorage.getItem("token"))|| "";
let BaseUrl = process.env.REACT_APP_Base_Url; 

const filterOptions = [
  { value: 'all', label: 'All Year' },
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'thisYear', label: 'This Year' },
];
  const [selectedOptionRevenue, setSelectedOptionRevenue] = useState(filterOptions[0]);
  const [selectedOptionWithdrawal, setSelectedOptionWithdrawal] = useState(filterOptions[0]);

  const getFilteredData = (selectedOption) => {
    const now = new Date();
    return actualData && actualData.filter(item => {
      const itemDate = parseISO(item.date);
      switch (selectedOption.value) {
        case 'today':
          return isWithinInterval(itemDate, { start: startOfDay(now), end: endOfDay(now) });
        case 'thisWeek':
          return isWithinInterval(itemDate, { start: startOfWeek(now), end: endOfWeek(now) });
        case 'thisMonth':
          return isWithinInterval(itemDate, { start: startOfMonth(now), end: endOfMonth(now) });
        case 'thisYear':
          return isWithinInterval(itemDate, { start: startOfYear(now), end: endOfYear(now) });
        default:
          return true; // 'All Year' returns all data
      }
    }).sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
  };

  const renderChart = (dataKey, color, name, selectedOption) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={getFilteredData(selectedOption)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} name={name} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderSelect = (title, selectedOption, setSelectedOption) => (
    <div className='flex justify-between'>
        <h1 className="text-[18px] font-bold">{title}</h1>
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          options={filterOptions}
          className="mb-4"
          styles={{ container: (provided) => ({ ...provided, width: '150px', zIndex: 20 }) }}
        />
    </div>
  );

  const Getrevenueandwithdrawal=()=>{
    let url= `${BaseUrl}/api/session/revenue-withdrawal`;
    fetch(url,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then(response => response.json()).then(res => {
        console.log(res);
        setactualData(res);
        
    });
  };


  useEffect(()=>{
    Getrevenueandwithdrawal();
  },[]);

  return (
    <Urlprotected path="Mentor">
    <div className='MyWallet_body gap-[30px]'>
      <div className='max-sm:hidden'><Sidebar liname={"My Wallet"} /></div>
      <div className='myWalletMain mr-[12px] max-md:w-[100vw] max-md:overflow-x-auto py-[15px]'>
        <Navbar Navtext={"My Wallet"} />
        <div className='MyWallet_mainContainer overflow-x-auto md:h-[75vh] max-md:p-4'>
          {/* Revenue Chart with its filter */}
          <div className="chartWithFilter">
            {renderSelect("Revenue", selectedOptionRevenue, setSelectedOptionRevenue)}
            {renderChart("Revenue", "#ffc658", "Revenue", selectedOptionRevenue)}
          </div>
          
          {/* Withdrawal Chart with its filter */}
          <div className="chartWithFilter">
            {renderSelect("Withdrawal", selectedOptionWithdrawal, setSelectedOptionWithdrawal)}
            {renderChart("Withdrawal", "#8884d8", "Withdrawal", selectedOptionWithdrawal)}
          </div>
        </div>
      </div>
    </div>
    </Urlprotected>
  );
}

export default MyWallet;
