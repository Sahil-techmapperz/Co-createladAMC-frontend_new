import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuperAdminSide from '../SuperAdminSide/SuperAdminSide';
import SuperAdminNavbar from '../SuperAdminNav/SuperAdminNav';
import MobileNav from '../../../components/Mobile/MobileNav';
import Pichart from '../../../assets/Group 268.png';
import CanvasJSReact from '@canvasjs/react-charts';
import './superAdminDashboard.css';
import Urlprotected from '../../../components/Urlprotected';

const { CanvasJSChart } = CanvasJSReact;
const BaseUrl = process.env.REACT_APP_Base_Url;

const ProgressBar = ({ progress = 0, color, label }) => {
  const containerStyles = {
    height: "25px",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: "50px",
    margin: "20px 0",
  };

  const fillerStyles = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: color,
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 0.2s ease-in-out",
  };

  const labelStyles = {
    padding: "5px",
    color: "white",
    fontWeight: "bold",
  };

  const labelContainerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
  };

  return (
    <>
      <div style={labelContainerStyles}>
        <span>{label}</span>
        <span>{`${progress.toFixed(2)}%`}</span>
      </div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}></span>
        </div>
      </div>
    </>
  );
};

const SuperAdminDashboard = () => {
  const [getAllMentee, setGetAllMentee] = useState([]);
  const [getAllMentor, setGetAllMentor] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [progressdata, setProgressdata] = useState([
    { progress: 0, color: "blue", label: "All Session" },
    { progress: 0, color: "#4caf55", label: "Scheduled Session" },
    { progress: 0, color: "#00cccc", label: "Completed Session" },
    { progress: 0, color: "#2D67B1", label: "Cancel Session" },
  ]);
  const [totalYearRevenue, setTotalYearRevenue] = useState({ monthlyRevenue: [], monthlySessionRevenue: [] });
  const [cclRevenue, setCclRevenue] = useState(0);
  const token = JSON.parse(localStorage.getItem("token")) || "";

  const fetchRevenue = async () => {
    const url = `${BaseUrl}/api/session/allsession-revenue`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const { totalRevenue = 0, sessionRevenue = 0 } = response.data || {};
      setTotalRevenue(totalRevenue);
      setCclRevenue(sessionRevenue);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  const YearlySessionRevenue = async () => {
    const url = `${BaseUrl}/api/session/currentYears_allsession-revenue`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const { monthlyRevenue = [], monthlySessionRevenue = [] } = response.data || {};
      setTotalYearRevenue({ monthlyRevenue, monthlySessionRevenue });
    } catch (error) {
      console.error('Error fetching yearly session revenue:', error);
    }
  };

  const sessionsProgressbar = async () => {
    const url = `${BaseUrl}/api/session/sessionstats`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const { scheduledPercentage = 0, completedPercentage = 0, canceledPercentage = 0 } = response.data || {};
      setProgressdata([
        { progress: scheduledPercentage, color: "#4caf55", label: "Scheduled Session" },
        { progress: completedPercentage, color: "#00cccc", label: "Completed Session" },
        { progress: canceledPercentage, color: "#2D67B1", label: "Cancel Session" },
      ]);
    } catch (error) {
      console.error('Error fetching session statistics:', error);
    }
  };

  const fetchUsers = async () => {
    const url = `${BaseUrl}/api/user/alluserforadmin`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const users = response.data || [];
      const mentees = users.filter(user => user.role === 'Client').slice(0, 3);
      const mentors = users.filter(user => user.role === 'Mentor').slice(0, 3);
      setGetAllMentee(mentees);
      setGetAllMentor(mentors);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchRevenue();
    fetchUsers();
    YearlySessionRevenue();
    sessionsProgressbar();
  }, []);

  const chartOptions = {
    animationEnabled: true,
    title: { text: "Monthly Revenue" },
    axisY: { title: "Revenue (CCL)", includeZero: true },
    data: [
      {
        type: "column",
        name: "Total Revenue",
        showInLegend: true,
        dataPoints: totalYearRevenue.monthlyRevenue.map((revenue, index) => ({
          label: new Date(0, index).toLocaleString('default', { month: 'short' }),
          y: parseFloat(revenue) || 0
        }))
      },
      {
        type: "column",
        name: "Session Revenue",
        showInLegend: true,
        dataPoints: totalYearRevenue.monthlySessionRevenue.map((revenue, index) => ({
          label: new Date(0, index).toLocaleString('default', { month: 'short' }),
          y: parseFloat(revenue) || 0
        }))
      }
    ]
  };

  return (
    <Urlprotected path="Admin">
      <div className='flex gap-[30px] h-[100vh] md:overflow-y-hidden bg-gray-100'>
        <div className="max-sm:hidden">
          <SuperAdminSide liname={"Super Admin Dashboard"} />
        </div>
        <div className='w-[100%] mr-[12px] max-sm:ml-[0px]'>
          <div className="sm:hidden ml-[10px]"> <MobileNav /> </div>
          <div className='max-sm:hidden'> <SuperAdminNavbar Navtext={"Dashboard"} /> </div>

          <div className='md:h-[90vh] md:overflow-y-auto'>
            <div className='grid grid-cols-2 gap-2 mt-[20px] w-[100%] max-sm:max-sm:grid-cols-1 max-sm:mt-[10px]'>
              <div className='flex w-full p-[5px] text-white gap-[15px] justify-between items-center background2 rounded-lg h-[70px] max-sm:gap-0 max-sm:w-[200px]'>
                <p className='m-[5px] max-sm:hidden font-normal p-[12px]'>Total Mentor</p>
                <p className='m-[5px] max-sm:hidden text-[20px] font-bold p-[12px]'>{getAllMentor.length}</p>
              </div>
              <div className='flex w-full p-[5px] text-white gap-[15px] justify-between items-center background2 rounded-lg h-[70px] max-sm:gap-0 max-sm:w-[200px]'>
                <p className='m-[5px] max-sm:hidden font-normal p-[12px]'>Total Gathering</p>
                <p className='m-[5px] max-sm:hidden text-[20px] font-bold p-[12px]'>{getAllMentor.length + getAllMentee.length}</p>
              </div>
            </div>

            <div className='grid grid-cols-2 w-[100%] gap-2 mt-[20px] p-2 max-sm:grid-cols-1 max-sm:gap-[10px]'>
              <div className='flex shadow p-4 h-[170px] justify-between rounded-lg'>
                <div>
                  <p>Total Revenue</p>
                  <p className='text-3xl mt-[20px] font-bold'>{totalRevenue} CCL</p>
                </div>
                <div className='flex justify-center items-center'>
                  <img className='w-[80px] h-[80px]' src={Pichart} alt="Pi Chart" />
                </div>
              </div>
              <div className='flex shadow p-4 h-[170px] justify-between rounded-lg'>
                <div>
                  <p>CCL Revenue</p>
                  <p className='text-3xl mt-[20px] font-bold'>{cclRevenue} CCL</p>
                </div>
                <div className='flex justify-center items-center'>
                  <img className='w-[80px] h-[80px]' src={Pichart} alt="Pi Chart" />
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-2 mt-4'>
              <div className='w-full md:w-[calc(50%-8px)]'>
                <CanvasJSChart options={chartOptions} />
              </div>

              <div className='flex flex-col px-[40px] pt-[20px] rounded-[10px] border-2 w-full md:w-[calc(48%-8px)]'>
                {progressdata.map((data, index) => (
                  <ProgressBar key={index} progress={data.progress} color={data.color} label={data.label} />
                ))}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2 bg-white mt-[20px] max-sm:grid-cols-1 max-sm:gap-[10px]'>
              <div className='shadow-lg p-3'>
                <p className='font-bold'>New Joinee Mentor</p>
                {getAllMentor.map((mentor, index) => (
                  <div key={index} className='flex justify-between mt-[20px] rounded-lg bg-gray-100 p-[25px]'>
                    <div>
                      <p className='font-bold'>Name</p>
                      <ul className='flex justify-between pt-[10px] gap-[10px]'>
                        <img className='h-[60px] w-[60px] rounded-[50%]' src={mentor.profilePictureUrl} alt="New Joinee" />
                        <div>
                          <li className='font-bold'>{mentor.name}</li>
                          <li>Mentor ID <span className='text-green-500'>{mentor.uniqueUserId}</span></li>
                        </div>
                      </ul>
                    </div>
                    <div>
                      <p className='font-bold'>Value</p>
                      <ul>
                        <div className='flex justify-between gap-[30px]'>
                          <li>{mentor.walletBalance} CCL</li>
                        </div>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className='shadow-lg p-3'>
                <p className='font-bold'>New Joinee Mentees</p>
                {getAllMentee.map((mentee, index) => (
                  <div key={index} className='flex justify-between mt-[20px] rounded-lg bg-gray-100 p-[25px]'>
                    <div>
                      <p className='font-bold'>Name</p>
                      <ul className='flex justify-between pt-[10px] gap-[10px]'>
                        <img className='h-[60px] w-[60px] rounded-[50%]' src={mentee.profilePictureUrl} alt="New Joinee" />
                        <div>
                          <li className='font-bold'>{mentee.name}</li>
                          <li>Mentee ID <span className='text-green-500'>{mentee.uniqueUserId}</span></li>
                        </div>
                      </ul>
                    </div>
                    <div>
                      <p className='font-bold'>Value</p>
                      <ul>
                        <div className='flex justify-between gap-[30px]'>
                          <li>{mentee.walletBalance} CCL</li>
                        </div>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Urlprotected>
  );
};

export default SuperAdminDashboard;
