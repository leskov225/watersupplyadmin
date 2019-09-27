import React from "react";
import { Auth } from 'aws-amplify';
import { nope } from 'lodash';
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Zoom
} from "@material-ui/core";

import { sidebarLinks } from "./constants";

const drawerWidth = 240;

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#262f35",
    boxShadow: theme.shadows[2],
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 500,
    marginLeft: theme.spacing(-1),
    padding: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5)
  }
}))(Tooltip);

const useStyles = makeStyles(theme => {
  return {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    paper: {
      backgroundColor: "#181E22"
    },
    drawerOpen: {
      width: drawerWidth,
      paddingTop: '60px',
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: "hidden",
      paddingTop: '60px',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1
      }
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    list: {
      padding: 0
    },
    navLink: {
      display: "block",
      "&.active, &:hover": {
        backgroundColor: "#262f35"
      },
      "&[disabled]": {
        pointerEvents: "none"
      }
    },
    listItem: {
      height: "60px",
      justifyContent: "center",
      padding: 0
    },
    listLogo: {
      color: "yellow",
      minWidth: "26px"
    },
    listItemIcon: {
      color: "white",
      minWidth: "22px"
    }
  };
});

const Sidebar = () => {
  const classes = useStyles();
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, classes.drawerClose)}
      classes={{
        paper: clsx(classes.paper, classes.drawerClose)
      }}
    >
      <List className={classes.list}>
        {sidebarLinks.map(({ disabled, icon, linkTo, title }) => (
          <NavLink
            to={linkTo}
            exact
            key={title}
            className={classes.navLink}
            disabled={disabled}
          >
            <div onClick={!linkTo ? () => Auth.signOut() : nope}>
              <StyledTooltip
                title={title}
                placement="right"
                TransitionComponent={Zoom}
              >
                <ListItem className={classes.listItem} disabled={disabled}>
                  <ListItemIcon className={classes.listItemIcon}>
                    {icon}
                  </ListItemIcon>
                </ListItem>
              </StyledTooltip>
            </div>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
