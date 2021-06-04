import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import socketIO from "socket.io-client";

import ContactList from "../contact-list/contact-list";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import SendIcon from '@material-ui/icons/Send';
import { makeStyles, Typography } from "@material-ui/core";

import { fetchContacts, fetchChat } from "../../redux/actions/contacts/contacts.actions";
import {
  initialX3DHLoad,
  publishIdentityKey,
  publishPreKeyBundle,
  generateIntialMessage,
} from "../../redux/actions/x3dh/x3dh.actions";
import { decrypt, encrypt } from "../../x3dh/aes";
import { v4 as uuidv4 } from "uuid";

const Chat = ({
  token,
  user,
  contacts,
  sharedKeys,
  x3dhLoaded,
  x3dhLoading,
  initialMessages,
  publishPreKeyBundleFlag,
  publishIdentityKeyFlag,
  fetchContacts,
  fetchChat,
  initialX3DHLoad,
  publishIdentityKey,
  publishPreKeyBundle,
  generateIntialMessage
}) => {

  const [state, setState] = useState({
    selectedContact: "",
    selectedContactName: "",
    messageInput: "",
    lines: 0,
  });
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState({});

  const handleContactClick = (contactId, contactName) => {
    setState({ ...state, selectedContact: contactId, selectedContactName: contactName });
  };

  const onChange = (event) => {
    const lines = event.target.value.split("\n").length;
    console.log(lines);
    setState({ ...state, [event.target.name]: event.target.value, lines });
  }

  const onSubmit = async event => {
    event.preventDefault();
    if(state.selectedContact === "") return;
    const message = state.messageInput;
    console.log(message);
    const sharedKey = sharedKeys[state.selectedContact].sharedKey;
    const encryptedMessage = await encrypt(message, uuidv4(), sharedKey);
    console.log(sharedKey, encryptedMessage);

    socket.emit('sendMessage', { message: encryptedMessage, reciever: state.selectedContact, sender: user._id });

    setState({ ...state, messageInput: "", lines: 0 });
    if(chat.hasOwnProperty(state.selectedContact)){
      setChat({ ...chat, [state.selectedContact]: [ ...chat[state.selectedContact], { sender:user._id, message, encrypted: encryptedMessage.data } ] });
    } else {
      setChat({ ...chat, [state.selectedContact]: [ { sender:user._id, message, encrypted: encryptedMessage.data } ] });
    }
  };

  useEffect(() => {
    if(state.selectedContact){
      fetchChat(state.selectedContact);
    }
  }, [state.selectedContact, fetchChat]);

  useEffect(() => {
    fetchContacts();
    initialX3DHLoad();
    const _socket = socketIO('http://localhost:3000');
    _socket.emit('setUserSocket', { userId: user._id, username: user.username });
    setSocket(_socket);
  }, []);

  if(socket && x3dhLoaded){
    socket.on('userMessage', async (data) => {
      const { message, sender } = data;
      const sharedKey = sharedKeys[sender].sharedKey;
      const decryptedMessage = await decrypt(message, sharedKey);
      if(chat.hasOwnProperty(sender)){
        setChat({ ...chat, [sender]: [ ...chat[sender], { sender, message: decryptedMessage, encrypted: message.data} ] });

      } else {
        setChat({ ...chat, [sender]: [ { sender, message: decryptedMessage, encrypted: message.data } ] });
      }
    });
  }

  useEffect(() => {
    if(x3dhLoaded){
      console.log(publishIdentityKeyFlag, publishPreKeyBundleFlag);
      if(publishIdentityKeyFlag) {
        publishIdentityKey();
      } else if(publishPreKeyBundleFlag) {
        publishPreKeyBundle();
      }
    }
  }, [
    publishIdentityKeyFlag,
    publishPreKeyBundleFlag,
    x3dhLoaded
  ]);

  const contactString = JSON.stringify(contacts);
  useEffect(() => {
    if(x3dhLoaded){
      if(sharedKeys === null) sharedKeys = {};
      if(initialMessages === null) initialMessages = {};
      const userToSendInitialMessage = [];
      if(contacts.length !== 0){
        contacts.forEach((contact) => {
          if(!sharedKeys.hasOwnProperty(contact.user._id)){
            if(!initialMessages.hasOwnProperty(contact.user._id)){
              userToSendInitialMessage.push(contact.user);
            }
          }
        });
        if(userToSendInitialMessage.length !== 0){
          generateIntialMessage(userToSendInitialMessage);
        }
      }
    }
  }, [contactString, x3dhLoaded]);

  console.log(chat);


  const Chats = () => {
    if(state.selectedContact !== "" && chat[state.selectedContact]){
      const chatlist = chat[state.selectedContact];
      const chatJSX = chatlist.map((c, idx) => {
        const backgroundColor = user._id === c.sender ? "#dc653b" : "#4d426d";
        const backgroundColor2 = user._id === c.sender ? "#e89a7d" : "#70609f";
        return (
          <div key={idx} style={{ width: "35%", padding:"10px 20px", marginLeft:`${ user._id === c.sender ? "auto" : undefined }`, borderRadius: "20px", backgroundColor:`${backgroundColor}`, marginBottom:"20px" }}>
            <Typography variant="body1" style={{ wordBreak: "break-all", margin: "auto", marginBottom: "10px" }}>
              {c.message}
            </Typography>
            <div style={{ padding:"8px 10px", borderRadius: "20px", backgroundColor:`${backgroundColor2}`,  }}>
              <Typography variant="body1" style={{ wordBreak: "break-all", margin: "auto", fontSize:"0.6rem" }}>
                {c.encrypted}
              </Typography>
            </div>
          </div>
        );
      });
      return chatJSX;
    }
    return <></>;
  }

  let maxHeight = Math.min(Math.max((state.lines-1)*18, 0), 85);
  return (
    <Grid container justify="center" alignItems="center" style={{ position: "relative", backgroundColor: "#eee", height: "100vh" }}>
      <Grid item container xs={10} style={{ height: "95%" }}>
        <Paper elevation={3} style={{ width: "100%", height:"100%", borderRadius: "20px", backgroundColor:"#4d426d" }}>
          <Grid item container style={{ width: "100%", height:"100%" }}>
            <Grid item container direction="column" xs={4} spacing={2} style={{ padding: "20px 30px" }}>
              <Grid item xs style={{ maxHeight:"10%", display: "flex", justifyContent:"center", alignItems:"center" }}>
                <Link to="#" style={{ fontFamily: "Special Elite", fontSize: "1.6rem", textDecoration: "none", color: "#fff" }}>
                  X3DH Chat
                </Link>
              </Grid>
              <Grid item xs style={{ }}>
                <Paper elevation={0} style={{ height:"100%", borderRadius: "20px", padding: "0 20px", backgroundColor:"#5c4f82" }}>
                  <ContactList contacts={contacts} handleContactClick={handleContactClick} selectedContact={state.selectedContact} />
                </Paper>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={8} style={{ height: "100%", padding: "20px 30px" }}>
              <Paper elevation={0} style={{ position:"relative", width: "100%", height:"100%", borderRadius: "20px", backgroundColor:"#5c4f82" }}>
                <Grid item xs style={{ height: "92%", maxHeight: "92%", overflow:"hidden", padding: "30px" }}>
                  <div style={{ height: "100%", width: "100%", paddingRight: "17px", overflow: "auto" }}>
                    { Chats() }
                  </div>
                </Grid>
                <Grid item xs style={{ height: "8%", maxHeight: "8%", position: "relative", display:"flex", justifyContent:"center", alignItems: "center" }}>
                  <div style={{ height: `calc(100% + 20px + ${maxHeight}px)`, width: "90%", position: "absolute", bottom:"10px",  }}>
                    <form noValidate autoComplete="off" onSubmit={onSubmit} style={{ height:"100%" }}>
                      <Grid container justify="space-around" alignItems="center" style={{ height:"100%" }}>
                        <Grid item xs={9} style={{ position:"relative", height:"100%" }}>
                          <TextField
                            name="messageInput"
                            multiline
                            rowsMax={5}
                            value={state.messageInput}
                            onChange={onChange}
                            variant="outlined"
                            style={{ position:"absolute", bottom:"10px", width:"100%",}}
                            InputProps={{ style: {  borderRadius: "26px", backgroundColor:"#fff", outline:"none" } }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <button type="submit" style={{ border:"none", borderRadius:"50%", height: "60px", width: "60px", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"#339999" }}>
                            <i className="fa fa-paper-plane" aria-hidden="true" style={{ fontSize: "1.6rem", color: "#fff", marginRight: "5px" }}></i>
                          </button>
                        </Grid>
                      </Grid>
                    </form>
                  </div>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  const {
    auth:{ token, user },
    contact,
    x3dh: {
      publishIdentityKeyFlag,
      publishPreKeyBundleFlag,
      sharedKeys,
      initialMessages,
      x3dhLoaded,
      x3dhLoading
    }
  } = state;
  const contacts = [];
  for(const key in contact){
    contacts.push({"user": contact[key].user});
  }
  return {
    token,
    user,
    contacts,
    sharedKeys,
    initialMessages,
    publishPreKeyBundleFlag,
    publishIdentityKeyFlag,
    x3dhLoaded,
    x3dhLoading
  };
};

const mapDispatchToProps = {
  fetchContacts,
  fetchChat,
  initialX3DHLoad,
  publishIdentityKey,
  publishPreKeyBundle,
  generateIntialMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);