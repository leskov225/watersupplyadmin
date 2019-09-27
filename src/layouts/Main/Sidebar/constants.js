import React from "react";

import PeopleIcon from '@material-ui/icons/People';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const iconStyle = { fontSize: "1.4rem" };

export const sidebarLinks = [
  {
    icon: <PeopleIcon style={iconStyle} />,
    name: "Organizations",
    linkTo: "/",
    title: "Organizations"
  },
  {
    icon: <PermContactCalendarIcon style={iconStyle} />,
    name: "Users",
    linkTo: "/users",
    title: "Users"
  },
  {
    icon: <ExitToAppIcon style={iconStyle} />,
    name: "Log Out",
    linkTo: "",
    title: "Log Out"
  }
];
