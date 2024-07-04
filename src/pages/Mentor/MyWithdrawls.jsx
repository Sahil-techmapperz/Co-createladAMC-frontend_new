import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import './../../CSS/MyWithdrawls.css';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { FaCoins } from "react-icons/fa";
// import Select from 'react-select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO, startOfDay, endOfDay, compareAsc } from 'date-fns';
import Urlprotected from '../../components/Urlprotected.jsx';


// StatusPill component defined directly within the MyWithdrawls component file
const StatusPill = ({ value }) => {
    let statusColor = value === 'Success' ? 'green'
        : value === 'Pending' ? 'orange'
            : value === 'Declined' ? 'red'
                : 'gray'; // Default color

    return (
        <span style={{
            color: 'white',
            backgroundColor: statusColor,
            padding: '5px 10px',
            borderRadius: '15px',
            display: 'inline-block',
            textTransform: 'capitalize',
        }}>
            {value}
        </span>
    );
};

const MyWithdrawls = () => {
    const [initialData, setInitialData] = useState([]);
    const [currentWalletBalance, setcurrentWalletBalance] = useState('');
    const [token, setToken] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [coin, setCoin] = useState();
    const [actualData, setactualData] = useState([]);
    const [moneyAmount, setMoneyAmount] = useState({
        amount: 0,
        method: "",
        notes: ""
    });
    const [selectedStatus, setSelectedStatus] = useState({ value: 'all', label: 'All Statuses' });
    const [searchInput, setSearchInput] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState({ value: 'all', label: 'All Payment Methods' });
    const [filteredData, setFilteredData] = useState(initialData);
    const BaseUrl = process.env.REACT_APP_Base_Url;




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

    const Getrevenueandwithdrawal = () => {
        const token = JSON.parse(localStorage.getItem("token")) || "";
        let url = `${BaseUrl}/api/session/revenue-withdrawal`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            console.log(res, "revenue");
            setactualData(res);

        });
    };


    const Getwalletbalances = () => {

        const token = JSON.parse(localStorage.getItem("token")) || "";
        let url = `${BaseUrl}/api/session/wallet-balances`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(res => {
                // console.log(res);
                setcurrentWalletBalance(res.currentWalletBalance);

            })
            .catch(error => {
                console.error('Error fetching withdrawals:', error);

            });
    };









    // Update function for when the payment method changes
    const handleMethodChange = (e) => {
        const { name, value } = e.target;
        setMoneyAmount({
            ...moneyAmount,
            [name]: value,  // Using computed property names to dynamically set the property
        });
    }

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem("token"));
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            Getwithdrawals();
        }
    }, [token]);

    const Getwithdrawals = () => {
        let url = `${BaseUrl}/api/user/withdrawals`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(res => {

                const convertedWithdrawals = res.map(withdrawal => ({
                    id: withdrawal._id,
                    payment: `${withdrawal._id}`,
                    status: withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1),
                    amount: `$${withdrawal.amount.toFixed(2)}`,
                    method: withdrawal.method,
                    date: new Date(withdrawal.requestedAt).toISOString().split('T')[0]
                }));

                setInitialData(convertedWithdrawals);
            })
            .catch(error => {
                console.error('Error fetching withdrawals:', error);
            });
    };

    const columns = useMemo(() => [
        { Header: 'PAYMENT ID', accessor: 'payment' },
        {
            Header: 'STATUS',
            accessor: 'status',
            Cell: ({ value }) => <StatusPill value={value} />,
        },
        { Header: 'AMOUNT', accessor: 'amount' },
        { Header: 'METHOD', accessor: 'method' },
        { Header: 'DATE', accessor: 'date' },
    ], []);


    useEffect(() => {
        const lowercasedFilter = searchInput.toLowerCase();

        const filtered = initialData.filter(item => {
            const date = new Date(item.date);
            const startDateCheck = startDate ? date >= startDate : true;
            const endDateCheck = endDate ? date <= endDate : true;
            const statusCheck = selectedStatus.value === 'all' || item.status.toLowerCase() === selectedStatus.value;
            const methodCheck = selectedMethod.value === 'all' || item.method === selectedMethod.value;
            const searchCheck = item.payment.toLowerCase().includes(lowercasedFilter) ||
                item.amount.toLowerCase().includes(lowercasedFilter) ||
                item.method.toLowerCase().includes(lowercasedFilter) ||
                item.date.includes(lowercasedFilter);

            return startDateCheck && endDateCheck && statusCheck && methodCheck && searchCheck;
        });
        setFilteredData(filtered);
    }, [selectedStatus, searchInput, startDate, endDate, selectedMethod, initialData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredData });


    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleMoneyAmountChange = (e) => {
        const enteredAmount = parseFloat(e.target.value);
        console.log(enteredAmount);
        let calculatedAmount;
        if (enteredAmount) {
            calculatedAmount = enteredAmount / 100; // Adjusting the formula here
        } else {
            calculatedAmount = 0;
        }
        setMoneyAmount({ ...moneyAmount, amount: calculatedAmount });
    };


    const handleWithdrawal = () => {

        if (moneyAmount.amount < 1) {
            alert('Minimum withdrawal amount is $1. Please increase the amount.');
            return;
        }
        if (moneyAmount.method === "") {
            alert('Please select a payment method before proceeding.');
            return;
        }

        let url = `${BaseUrl}/api/user/withdrawals`;
        fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            // Ensuring the body is structured according to the API's expected format:
            body: JSON.stringify({
                amount: moneyAmount.amount,
                method: moneyAmount.method,
                notes: moneyAmount.notes,
                coin: coin  // Assuming 'coin' is an additional field expected by the server.
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    alert('Withdrawal failed: ' + res.error);
                } else {
                    alert('Withdrawal successful! Transaction Details: ' + JSON.stringify(res.details));
                }
                Getwithdrawals();
                Getrevenueandwithdrawal();
                Getwalletbalances();
            })
            .catch(error => {
                console.error('Error fetching withdrawals:', error);
                alert('An error occurred while processing your request. Please try again.');
            });

        closeModal();
    };

    useEffect(() => {
        Getrevenueandwithdrawal();
        Getwalletbalances();
    }, []);




    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'White',
            minWidth: '300px',
            padding: '20px',
            borderRadius: '5px',
            border: 'none',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
        },
    };

    return (
        <Urlprotected path="Mentor">
        <div className='flex gap-[30px]'>
            <div className="max-sm:hidden"><Sidebar liname={"My Withdrawal"} /></div>
            <div className='w-full h-[100vh] md:overflow-y-hidden mr-[12px] py-[15px]'>
                <Navbar Navtext={"My Withdrawal"} />
                <div className='md:h-[80vh] mt-[10px] md:overflow-x-auto max-md:px-[10px] '>
                    <div className='flex justify-end text-[20px]'> <div className='flex justify-center items-center gap-2 text-[#0796F6]'><b className='text-black'>CurrentBalance -</b> <FaCoins /> <span className='text-black'> {currentWalletBalance}</span></div></div>

                    <div className='mywithdral_payment flex max-md:gap-2 max-md:flex-col md:justify-between md:items-center gap-[10px]' >
                        <div className='flex gap-2  max-md:flex-col'>
                            <div className="filter-group">
                                <div className="filter-label">Status:</div>
                                <Select
                                    options={[{ value: 'all', label: 'All Statuses' }, { value: 'pending', label: 'Pending' }, { value: 'success', label: 'Success' }, { value: 'declined', label: 'Declined' }]}
                                    value={selectedStatus}
                                    onChange={setSelectedStatus}
                                />
                            </div>
                            <div className="filter-group">
                                <div className="filter-label">Payment Method:</div>
                                <Select
                                    options={[{ value: 'all', label: 'All Methods' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'stripe', label: 'stripe' }, { value: 'crypto', label: 'Cryptocurrency' }, { value: 'paypal', label: 'paypal' }]}
                                    value={selectedMethod}
                                    onChange={setSelectedMethod}
                                />
                            </div>
                            <div className="filter-group">
                                <div className="filter-label">Start Date:</div>
                                <DatePicker
                                    className='border-[2px] border-gray-300 py-1 px-2 rounded-md'
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Start Date"
                                />
                            </div>
                            <div className="filter-group">
                                <div className="filter-label">End Date:</div>
                                <DatePicker
                                    className='border-[2px] border-gray-300 py-1 px-2 rounded-md'
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    placeholderText="End Date"
                                />
                            </div>
                        </div>
                        <div className='flex gap-[20px] md:mt-[20px] '>
                            <button className='w-[150px] p-[5px] border rounded text-white bg-blue-500' onClick={openModal}>Withdrawal</button>
                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                                ariaHideApp={false} 
                               
                            >
                                <button onClick={closeModal} style={{ position: 'absolute', width: "fit-content", top: '10px', right: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'black', fontSize: '25px' }}>
                                    <FaTimes />
                                </button>
                                <h2 style={{ textAlign: 'center', color: 'black' }}>Withdrawal</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                    <label style={{ width: '80%' }}>Coin:</label>
                                    <input
                                        placeholder='Enter CCL Coin'
                                        type="text"
                                        value={coin}
                                        onChange={(e) => setCoin(e.target.value)}
                                        onInput={handleMoneyAmountChange}
                                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%' }}
                                    />
                                    <label style={{ width: '80%' }}>Money Amount:</label>
                                    <input
                                        placeholder='Calculated Amount'
                                        type="text"
                                        value={moneyAmount.amount}
                                        readOnly
                                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%' }}
                                    />
                                    <label style={{ width: '80%' }}>Payment Methods:</label>
                                    <select
                                        value={moneyAmount.method}
                                        name='method'
                                        onChange={handleMethodChange}
                                        style={{ padding: '10px', borderRadius: '5px', width: '80%', border: '1px solid #ccc' }}
                                    >
                                        <option value="">Select payment method</option>
                                        <option value="bank_transfer">Bank Transfer 2% fee</option>
                                        <option value="stripe">Stripe 2.5% fee</option>
                                        <option value="crypto">Cryptocurrency 1% fee</option>
                                        <option value="paypal">PayPal 3% fee</option>
                                    </select>
                                    <label style={{ width: '80%' }}>Notes:</label>
                                    <textarea
                                        placeholder='Add any relevant notes here...'
                                        value={moneyAmount.notes}
                                        name='notes'
                                        onChange={handleMethodChange}
                                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '80%', minHeight: '100px' }}
                                    />
                                    <button
                                        onClick={handleWithdrawal}
                                        style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', width: '80%', marginTop: '20px' }}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </Modal>

                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search by amount, payment method..."
                                style={{ padding: '10px', width: '300px' }}
                                className='border-[2px] border-gray-300 py-1 px-2 rounded-md'
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2 mt-2'>

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
                    <table {...getTableProps()} className='md:m-[20px]' >
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </Urlprotected>
    );
}

export default MyWithdrawls;
