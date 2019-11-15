import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Loading } from './components/Loading';
import ChatBar from '../ChatBar';
import InputCaht from '../InputChat';
import { dateTime } from '../../../../model/dateTime';
import './styles/chat-box.css';
import { useProfile, useShare } from '../../../../controllers';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: (window.innerWidth),
        flexShrink: 0,
    },
    drawerPaper: {
        width: (window.innerWidth),
    }
}))

function ChatSlide(props) {

    const theme = useTheme();
    const classes = useStyles();
    const [chat, setChat] = useState(null)
    const [msg, setMsg] = React.useState(null)
    const { isProfile } = useProfile(props)
    const { isShare } = useShare(props)

    const sendMsg = () => {

        let path = `share/${props.isStatus.member.share_id}/chat`

        props.db.database().ref(`${path}`).push({
            uid: props.isStatus.share.uid,
            share_id: props.isStatus.share.id,
            profile: isProfile,
            msg: `${msg}`,
            date: dateTime
        })
        setMsg('')
    }

    const updateMsg = (e) => {
        setMsg(e.target.value);

        if (isShare.chat !== null) {
            setChat(isShare.chat)
        }
    }

    useEffect(() => {
        async function fetchData() {
            let path_chat = `share/${props.isStatus.member.share_id}/chat`

            await props.db.database().ref(`${path_chat}`).once("value").then(function (chat_value) {
                let chatData = (chat_value.val())
                if (chatData !== null) {
                    setChat(chatData)
                }
            })
        }
        fetchData();
    })

    return (
        <Fragment>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {chat !== null
                    ? (<Fragment>
                        <ChatBar>
                            <IconButton onClick={props.onClose} style={{ position: "absolute", left: 0 }}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon fontSize="large" /> : <ChevronRightIcon fontSize="large" />}
                            </IconButton>
                            <div style={{
                                position: 'absolute',
                                left: (window.innerWidth / 2.2),
                            }}>
                                <h2>Chat</h2>
                            </div>
                        </ChatBar>

                        <div className="box">
                            <div className="chat-box">
                                {chat !== null
                                    ? (<Fragment>
                                        {Object.keys(chat).map((key) => (
                                            <Fragment>
                                                {props.isUsersPrivate.uid === chat[key].uid
                                                    ? (<Fragment>
                                                        <div class="container darker">
                                                            <img src={`${chat[key].profile.photoURL}`} alt="Avatar" class="right" />
                                                            <h4 style={{
                                                                marginTop: 0
                                                            }} class="left">{chat[key].profile.displayName}</h4>
                                                            <p class="left">{chat[key].msg}</p>
                                                        </div>
                                                    </Fragment>)
                                                    : (<Fragment>
                                                        <div class="container">
                                                            <img src={`${chat[key].profile.photoURL}`} alt="Avatar" class="left" />
                                                            <h4 tyle={{
                                                                marginTop: 0
                                                            }}class="right">{chat[key].profile.displayName}</h4>
                                                            <p class="right">{chat[key].msg}</p>
                                                        </div>
                                                    </Fragment>)
                                                }
                                            </Fragment>
                                        ))}
                                    </Fragment>)
                                    : (<Fragment></Fragment>)
                                }
                            </div>
                        </div>
                        <div style={{
                            position: 'fixed',
                            bottom: 0,
                            width: '-webkit-fill-available',
                            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
                        }}>
                            <InputCaht value={msg} onChange={updateMsg} onClick={sendMsg} />
                        </div>
                    </Fragment>)
                    : (<Loading onClose={props.onClose} />)
                }
            </Drawer>
        </Fragment>
    )
}

ChatSlide.protoType = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    uid: PropTypes.string,
    isShare: PropTypes.object,
    isStatus: PropTypes.object,
    db: PropTypes.object,
    isUsersPrivate: PropTypes.object
}

export default ChatSlide;