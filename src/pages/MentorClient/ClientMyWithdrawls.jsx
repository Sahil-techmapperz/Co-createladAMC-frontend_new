import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ClientSidebar from '../MentorClient/ClientSidebar/ClientSidebar';
import ClientNavbar from '../MentorClient/ClientNavbar/ClientNavbar';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import Urlprotected from '../../components/Urlprotected';

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

const ClientMyWithdrawls = () => {
    const [initialData, setInitialData] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [token, setToken] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [coin, setCoin] = useState('');
    const [moneyAmount, setMoneyAmount] = useState('');
    const [bankDetails, setBankDetails] = useState(false);
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({ value: 'all', label: 'All Statuses' });
    const [searchInput, setSearchInput] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState({ value: 'all', label: 'All Payment Methods' });
    const [filteredData, setFilteredData] = useState(initialData);
    const BaseUrl = process.env.REACT_APP_Base_Url; 

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
            console.log(res);
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
        const enteredAmount = e.target.value;
        const calculatedAmount = enteredAmount * 10;
        setMoneyAmount(calculatedAmount);
    };

    const handleWithdrawal = () => {
        console.log('Withdrawal:', coin, moneyAmount, bankName, accountNumber);
        closeModal();
    };

    const handleAddBankDetails = () => {
        setBankDetails(true);
    };

    const handleCoinClick = () => {
        const coinValue = parseFloat(coin);
        if (!isNaN(coinValue)) {
            const amount = coinValue * 10;
            setMoneyAmount(amount.toString());
        }
    };

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
        <Urlprotected path="Client">
        <div className='flex gap-[30px]'>
            <div className="max-sm:hidden"><ClientSidebar liname={"My Withdrawal"} /></div>
            <div className='w-full h-[100vh] md:overflow-y-hidden mr-[12px] py-[15px]'>
                <ClientNavbar Navtext={"My Withdrawal"} />
                <div className='md:h-[80vh] mt-[10px] md:overflow-x-auto max-md:px-[10px]'>
                    <div className='mywithdral_payment flex max-md:gap-2 max-md:flex-col md:justify-between md:items-center' >
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
                                    options={[{ value: 'all', label: 'All Methods' }, { value: 'bank_transfer', label: 'Bank Transfer' },{ value: 'stripe', label: 'stripe' }, { value: 'crypto', label: 'Cryptocurrency' },{ value: 'paypal', label: 'paypal' }]}
                                    value={selectedMethod}
                                    onChange={setSelectedMethod}
                                />
                            </div>
                            <div className="filter-group">
                                <div className="filter-label">Start Date:</div>
                                <DatePicker
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
                        <div className='flex gap-[20px]'>
                            <button className='w-[150px] p-[5px] border rounded text-white bg-blue-500' onClick={openModal}>Withdrawal</button>
                            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
                                <FaTimes onClick={closeModal} size={25} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} />
                                <h2 style={{ color: 'black' }}>Withdrawal</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                                    <label style={{ color: 'black', marginBottom: '5px' }}>Coin:</label>
                                    <input placeholder='Enter CCL Coin' type="text" value={coin} onChange={(e) => setCoin(e.target.value)} onClick={handleCoinClick} style={{ padding: '5px', borderRadius: '5px', border: '1px solid black', width: '80%', marginBottom: '10px' }} />
                                    <label style={{ color: 'black', marginBottom: '5px' }}>Money Amount:</label>
                                    <input placeholder='Total Amount' type="text" value={moneyAmount} onChange={handleMoneyAmountChange} style={{ padding: '5px', borderRadius: '5px', border: '1px solid black', width: '80%', marginBottom: '10px' }} />
                                    {bankDetails && (
                                        <>
                                            <label style={{ color: 'black', marginBottom: '5px' }}>Bank Name:</label>
                                            <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid black', width: '80%', marginBottom: '10px' }} />
                                            <label style={{ color: 'black', marginBottom: '5px' }}>Account Number:</label>
                                            <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid black', width: '80%', marginBottom: '10px' }} />
                                        </>
                                    )}
                                    {!bankDetails && (
                                        <button onClick={handleAddBankDetails} style={{ backgroundColor: 'black', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>Add Bank Details</button>
                                    )}
                                    <button onClick={handleWithdrawal} style={{ backgroundColor: 'black', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>Withdraw</button>
                                </div>
                            </Modal>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search by amount, payment method..."
                                style={{ padding: '10px', width: '300px' }}
                            />
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

export default ClientMyWithdrawls;
