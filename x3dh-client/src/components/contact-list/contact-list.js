import React, { useEffect } from "react";
import { connect } from "react-redux";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { makeStyles } from "@material-ui/styles";

import ContactAvatar from "../../assets/avatar-svgrepo-com.svg";

const useStyles = makeStyles((theme) => ({
  listItem:{
    height: "90px",
    marginBottom: "10px",
    marginTop: "20px",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    "&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    }
  },
  listItemText: {
    color: "#fff",
    marginLeft: "25px"
  }
}));

const ContactList = ({ contacts, handleContactClick, selectedContact }) => {
  const classes = useStyles();
  console.log(contacts);
  const contactList = contacts.map((contact) => (
    <React.Fragment key={contact.user._id}>
      <ListItem
        button
        selected={selectedContact === contact.user._id}
        onClick={(event) => handleContactClick(contact.user._id, contact.user.firstName+" "+contact.user.lastName)}
        alignItems="center"
        className={`${classes.listItem}`}
      >
        <ListItemAvatar>
          <Avatar alt={contact.user.firstName + " " + contact.user.lastName} src={ContactAvatar} style={{ width: "65px", height: "65px" }}>
            {/* <ContactAvatar/> */}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={contact.user.firstName + " " + contact.user.lastName}
          className={`${classes.listItemText}`}
        />
      </ListItem>
      <Divider style={{ backgroundColor:"rgba(255,255,255,0.2)" }} />
    </React.Fragment>
  ));

  return <List component="nav">{contactList}</List>;
};

export default ContactList;
