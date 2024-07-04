import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Mentordashboard from '../pages/Mentor/Mentordashboard';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MyAccount from '../pages/Mentor/MyAccount';
import NoticeBoard from '../pages/Mentor/NoticeBoard';
import MyWallet from '../pages/Mentor/MyWallet';
import MyWithdrawls from '../pages/Mentor/MyWithdrawls';
import Calender from '../pages/Mentor/Calender';
import MessageChat from '../pages/Mentor/MessageChat';
import PersonalInfo from '../pages/Mentor/PersonalInfo';
import Session from '../pages/Mentor/Session';
import Payment_methods from '../pages/Mentor/Payment_methods';
import MobileNav from './Mobile/MobileNav';
import NavbarSide from './Mobile/NavbarSide';
import ClientDashboard from '../pages/MentorClient/ClientDashboard/ClientDashboard';
import ClientNavbar from '../pages/MentorClient/ClientNavbar/ClientNavbar';
import ClientIntroSession from '../pages/MentorClient/ClientIntroSession/ClientIntroSession';

import ReactBarchart from '../pages/SuparAdmin/ReactBarchart/ReactBarchart';
import ClientMyWallet from '../pages/MentorClient/ClientMyWallet/ClientMyWallet';
import ClientSidebar from '../pages/MentorClient/ClientSidebar/ClientSidebar';
import ClientSnCalender from '../pages/MentorClient/ClientSessionCalander/ClientSnCalander';
import ClientNotice from '../pages/MentorClient/ClientNoticeBoard/ClientNotice';
import Signin from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';
import ClientMyAcc from '../pages/MentorClient/ClientMyAccount/ClientMyAcc';



import SuperAdminDashboard from '../pages/SuparAdmin/SuperAdminDashboard/SuperAdminDashboard';
import SuperAdminUserTable from '../pages/SuparAdmin/SuperAdminUsers/SuperAdminUsers';
import SuperAdminSide from '../pages/SuparAdmin/SuperAdminSide/SuperAdminSide';
import SuperAdminNoticeBoard from '../pages/SuparAdmin/SuperAdminNoticeBoard/SuperAdminNoticeBoard';
import SuperAdminNavbar from '../pages/SuparAdmin/SuperAdminNav/SuperAdminNav';
import SuperAdminAccount from '../pages/SuparAdmin/SuperAdminAccount/SuperAdminAccount';
import SuperAdminIssueReport from '../pages/SuparAdmin/SuperAdminIssuReport/SuperAdminIssuReport';
import Menteesessiondetails from '../pages/MentorClient/Menteesessiondetails/Menteesessiondetails';
import ClientSession from "../pages/MentorClient/ClientSession/ClientSession"
import LoginSecurity from '../pages/Mentor/LoginSecurity';
import Profile from '../pages/Mentor/Profile';
import ClientPersonalInfo from '../pages/MentorClient/PersonalInfo';
import ClientProfile from '../pages/MentorClient/ClientProfile';
import ClientMessageChat from '../pages/MentorClient/ClientMessageChat';
import ClientLoginSecurity from '../pages/MentorClient/ClientLoginSecurity';
import ClientPaymentMethods from '../pages/MentorClient/ClientPayment_methods';
import IssueReport from '../pages/Mentor/Issuereport';
import ClientIssueReport from '../pages/MentorClient/Issuereport';
import Allmentors from '../pages/MentorClient/Allmentors/AllMentors';
import AdminProfile from '../pages/SuparAdmin/AdminProfile';
import AdminPersonalInfo from '../pages/SuparAdmin/AdminPersonalInfo';
import AdminMessageChat from '../pages/SuparAdmin/AdminMessageChat';




const AllRoute = () => {
  return (
    <>

      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
        <Mentordashboard />
        </ProtectedRoute>
        } />
        <Route path='/navbar' element={<Navbar />} />
        <Route path='/side' element={<Sidebar />} />
        <Route path='/Myaccounts' element={<MyAccount />} />
        <Route path='/NoticeBoard' element={<NoticeBoard />} />
        <Route path='/MyWallet' element={<MyWallet />} />
        <Route path='/login' element={<Signin />} />
        <Route path='/mywithdrawls' element={<MyWithdrawls />} />
        <Route path='/calender' element={<Calender />} />
        <Route path='/session' element={<Session />} />
        <Route path='/PersonalInfo' element={<PersonalInfo />} />
        <Route path='/payment_methods' element={
          <ProtectedRoute>
            <Payment_methods/>
          </ProtectedRoute>
        } />
        <Route path='/LoginSecurity' element={
          <ProtectedRoute>
            <LoginSecurity/>
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        } />
        <Route path='/chatMessage' element={
          <ProtectedRoute>
            <MessageChat />
          </ProtectedRoute>
        } />
        <Route path='/mentorissuereport' element={
          <ProtectedRoute>
            <IssueReport />
          </ProtectedRoute>
        } />
        <Route path='/mobileNav' element={<MobileNav />} />
        <Route path='/navbarSide' element={<NavbarSide />} />
        <Route path='/clientDashboard' element={<ClientDashboard />} />
        <Route path='/clientNavbar' element={<ClientNavbar />} />
        <Route path='/menteeAllSession' element={<ClientIntroSession />} />
        <Route path='/clientPersonalInfo' element={<ClientPersonalInfo />} />
        <Route path='/clientProfile' element={<ClientProfile />} />
        <Route path='/clientchatMessage' element={
          <ProtectedRoute>
            <ClientMessageChat />
          </ProtectedRoute>
        } />
        <Route path='/clientLoginSecurity' element={
          <ProtectedRoute>
            <ClientLoginSecurity/>
          </ProtectedRoute>
        } />
        <Route path='/clientpaymentmethods' element={
          <ProtectedRoute>
            <ClientPaymentMethods/>
          </ProtectedRoute>
        } />

        <Route path='/clientissuereport' element={
          <ProtectedRoute>
            <ClientIssueReport/>
          </ProtectedRoute>
        } />
        <Route path='/allmentors' element={
          <ProtectedRoute>
            <Allmentors/>
          </ProtectedRoute>
        } />


        <Route path='/superAdminDashboard' element={<SuperAdminDashboard />} />
        <Route path='/superAdminUserTable' element={<SuperAdminUserTable />} />
        <Route path='/superAdminSidebar' element={<SuperAdminSide />} />
        <Route path='/superAdminNavbar' element={<SuperAdminNavbar/>} />
        <Route path='/superAdminAccount' element={<SuperAdminAccount/>} />
        <Route path='/superAdminNoticeBoard' element={<SuperAdminNoticeBoard />} />
        <Route path='/superAdminIssueReport' element={<SuperAdminIssueReport />} />
        <Route path='/adminProfile' element={<AdminProfile />} />
        <Route path='/adminPersonalInfo' element={<AdminPersonalInfo />} />
        <Route path='/adminchatmessage' element={<AdminMessageChat />} />

        



        <Route path='/reactBarchart' element={<ReactBarchart />} />
        <Route path='/clientMyWallet' element={<ClientMyWallet />} />
        <Route path='/clientSideBar' element={<ClientSidebar />} />
        <Route path='/clientSnCalender' element={<ClientSnCalender />} />
        <Route path='/clientNotice' element={<ClientNotice />} />
        <Route path='/clientMyAccount' element={<ClientMyAcc />} />
        <Route path='/menteesessiondetails' element={<Menteesessiondetails />} />
        <Route path='/clientIntroSession/:mentorId' element={<ClientSession />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default AllRoute;
