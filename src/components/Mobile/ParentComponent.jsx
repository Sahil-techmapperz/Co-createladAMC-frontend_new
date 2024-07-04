import React, { useState } from 'react';
// import MobileNav from './MobileNav';
import NavbarSide from './NavbarSide';
import MobileNav from './MobileNav';

const ParentComponent = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    return (
        <>
        <MobileNav  toggleDrawer={toggleDrawer}/>
            <NavbarSide isOpen={isDrawerOpen} onClose={toggleDrawer} handleLinkClick={() => {}} />
        </>
    );
}
export default ParentComponent
