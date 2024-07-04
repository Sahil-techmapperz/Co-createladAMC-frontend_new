import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Urlprotected = ({ path, children }) => {
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Convert to seconds

                if (decodedToken.exp < currentTime) {
                    // Token is expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsTokenExpired(true);
                } else {
                    const userdata = JSON.parse(localStorage.getItem('user'));
                    if (!userdata || userdata.role !== path) {
                        setIsAuthorized(false);
                    }
                }
            } catch (error) {
                // Handle invalid token format
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsTokenExpired(true);
            }
        } else {
            setIsAuthorized(false);
        }
    }, [path, token]);

    if (isTokenExpired) {
        return <Navigate to="/login" replace />;
    }

    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Urlprotected;
