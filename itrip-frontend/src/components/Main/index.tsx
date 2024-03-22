import React from 'react';
import Topbar from '../TopBar';
import SideBar from '../SideBar';

export const  Main = ({ children }:any) => {
    return (
    <SideBar>
        {children}
    </SideBar>
    );
  };