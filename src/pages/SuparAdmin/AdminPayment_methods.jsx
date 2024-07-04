import React, { useState, useEffect } from 'react';
import SuperAdminSide from '../SuparAdmin/SuperAdminSide/SuperAdminSide';
import SuperAdminNavbar from '../SuparAdmin/SuperAdminNav/SuperAdminNav';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal'; // Make sure this points to your Modal component

const AdminPaymentMethods = () => {
  const [paymentData, setPaymentData] = useState({
    bankTransfer: { accountInfo: {}, feePercentage: 2 },
    paypal: { accountInfo: {}, feePercentage: 3 },
    stripe: { accountInfo: {}, feePercentage: 2.5 },
    crypto: { accountInfo: {}, feePercentage: 1 }
  });
  const [modalInput, setModalInput] = useState({
    bankTransfer: { accountNumber: '', IFSC: '', branchName: '' },
    paypal: { paypalEmail: '' },
    stripe: { stripeAccountId: '' },
    crypto: { walletAddress: '', walletType: 'Bitcoin' }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditing, setCurrentEditing] = useState('');

  const BaseUrl = process.env.REACT_APP_Base_Url;
  const token = JSON.parse(localStorage.getItem("token")) || "";



  const fetchPaymentData = () => {
    const url = `${BaseUrl}/api/user/payment-methods`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setPaymentData(data);
    })
    .catch(error => {
      console.error('Error fetching payment data:', error);
    });
  };

  const openModal = (method) => {
    setCurrentEditing(method);
    // Check if the accountInfo object is empty
    const isAccountInfoEmpty = Object.keys(paymentData[method].accountInfo).length === 0;
  
    setModalInput(prev => ({
      ...prev,
      // Use existing accountInfo if not empty, otherwise fall back to what's in modalInput
      [method]: !isAccountInfoEmpty ? paymentData[method].accountInfo : prev[method]
    }));
  
    setModalOpen(true);
  };
  

  const handleChange = (e, method, key) => {
    const newValue = e.target.value;
    setModalInput(prev => ({
        ...prev,
        [method]: {
            ...prev[method],
            [key]: newValue
        }
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setPaymentData(prev => ({
      ...prev,
      [currentEditing]: {
        ...prev[currentEditing],
        accountInfo: { ...modalInput[currentEditing] }
      }
    }));
    Updatepaymentmethod();
    setModalOpen(false);
  };

  const Updatepaymentmethod = () => {
    const url = `${BaseUrl}/api/user/payment-methods/${currentEditing}`;
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          accountInfo: modalInput[currentEditing]
        })
    })
    .then(response => response.json())
    .then(res => {
      if (res.status === 200) {
        window.location.reload();
      } else {
        console.log(res.message);
      }
    })
    .catch(error => console.error('Error updating payment method:', error));
  };


  useEffect(() => {
    fetchPaymentData();
  }, [BaseUrl, token]);

const PaymentDetail = ({ method }) => {
    const accountInfoEntries = Object.entries(paymentData[method].accountInfo);
  
    return (
      <div className='relative p-2.5 border border-gray-300 rounded-lg m-2.5 bg-gray-100'>
        <h3 className='text-lg font-semibold uppercase'>{method} Details</h3>
        {accountInfoEntries.length > 0 ? (
          accountInfoEntries.map(([key, value]) => (
            <p key={key} className='mt-1 uppercase'><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}</p>
          ))
        ) : (
          <p className='text-red-500'>Payment method not added.</p> // Display when no account information is available
        )}
        <p className='mt-2'><strong>Fee Percentage:</strong> {paymentData[method].feePercentage}%</p>
        <button className='absolute w-fit right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline'
                onClick={() => openModal(method)}>Edit</button>
      </div>
    );
  };
  

  const renderModalContent = () => (
    <form onSubmit={handleUpdate} >
        <h1 className='font-bold underline text-[20px]'>Add or Update data </h1>
        {currentEditing && Object.entries(modalInput[currentEditing]).map(([key, value]) => (
            <div key={key} className='p-2 '>
                <label className='uppercase'>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                <input className='p-2 border rounded w-full' type="text" placeholder={`Enter ${key}`} value={value} onChange={(e) => handleChange(e, currentEditing, key)} />
            </div>
        ))}
        <button  className='bg-blue-600 text-white py-1 px-2 rounded cursor-pointer' type="submit">Save or Update</button>
    </form>
);

  return (
    <div className='flex gap-[30px] bg-gray-100 h-[100vh] overflow-hidden'>
      <div className="max-sm:hidden">
      <SuperAdminSide liname={"My Payments"} />
      </div>
      <div className='myAccount_body mr-[12px] w-full'>
      <SuperAdminNavbar Navtext={"My Payments"} />
        <div className='m-[20px] text-[18px] font-[600]'>
          <Link to={"/"}>Dashboard</Link> &gt; <Link to={'/Myaccounts'}>My Account</Link> &gt; <u>Payment Methods</u>
        </div>
        <div>
          {['bankTransfer', 'paypal', 'stripe', 'crypto'].map(method => (
            <PaymentDetail key={method} method={method} />
          ))}
          <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
            {renderModalContent()}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminPaymentMethods;
