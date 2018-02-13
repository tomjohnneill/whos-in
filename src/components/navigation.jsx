import React, {PropTypes} from 'react';
import { IndexLink, Link, browserHistory } from 'react-router';
import {grey200, grey500, grey100, amber500, blue200} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import Settings from 'material-ui/svg-icons/action/settings';
import InfoOutline from 'material-ui/svg-icons/action/info';
//import MessagingButton from '/imports/ui/components/messagingbutton.jsx';
import {SignupModal} from './signupmodal.jsx';

//import globalStyles from '/client/main.css';


const style = {
  display: 'inline-block',
  margin: '16px 32px 16px 0',
  title: {
    cursor: 'pointer',
    fontFamily: 'Permanent Marker',
    color: '#FF9800',
    fontSize: '30px',
    marginRight: '15px',
    width: '100px'
  },
  appBar: {
    margin: '0px',
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0.5), 0px 2px 4px, rgba(0,0,0.5)',
    paddingLeft: '16px',
    backgroundColor: 'white',
    borderBottom: '1px solid #DBDBDB'
  },
  otherAnchor :{
    float: 'right',
    width: '10px',
  },
  popover: {
    maxWidth: '180px'
  },
  avatar: {
    cursor: 'pointer'
  }
  , badge: {
    paddingBottom : '0px'
    , paddingTop: '16px'
    , marginRight: '12px'
    , cursor: 'pointer'
  }
  , alertBadge: {
    paddingBottom : '0px'
    , paddingTop: '16px'
    , cursor: 'pointer'
  }
  , rightSide: {
    height: '50px'
    , display: 'flex'
    , alignItems: 'center'
  }
  , plainIcon: {
    paddingRight: '36px',
    paddingLeft: '12px'
  }
  , alertPlain: {
    paddingRight: '12px'
  }
  , verifiedPlain: {
    paddingRight: '24px'
  }
};

export default class Navigation extends React.Component {

  constructor(props){
    super(props);
    this.state = {open: false, changePasswordOpen: false, modalOpen: false};
    this.logout = this.logout.bind(this);

  }



  logout(e){
    e.preventDefault();

    this.setState({data: {isAuthenticated: false}})


  }


  handleOpen() {
  this.setState({changePasswordOpen: true});
  };

  handleClose() {
    this.setState({changePasswordOpen: false});
  };


  handleRequestClose() {
    this.setState({
      open: false
    });
  };

  handleChange(textField, event) {
        this.setState({
            [textField]: event.target.value
        });
    }

  handleTitleTap(event) {
    event.preventDefault();

    browserHistory.push('/')
  }

  handleYourListings(event) {
    browserHistory.push('/yourdetails')
  }

  handleDashboard(event) {
    browserHistory.push('/dashboard')
  }

  handleBlog(event) {
    event.preventDefault()
    browserHistory.push('/blog')
  }

  handleChangePassword(e) {

  }

  handleSettingsClick = (e) => {
    e.preventDefault()
    this.setState({
      open: true,
      anchorEl: e.currentTarget
    })
  }

  handleAboutClick = (e) => {
    e.preventDefault()
    browserHistory.push('/messages')
  }

  handleSignOut = (e) => {
    e.preventDefault()

  }

  handleModal = (e) => {
    this.setState({open: false})
    this.setState({modalOpen: true})
  }

  setModal = () => {
    let modal = this.state.modalOpen
    this.setState({modalOpen: !modal})
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleSignIn = (e) => {
    e.preventDefault()

  }

  handleTerms = (e) => {
    e.preventDefault()
    browserHistory.push('/terms')
  }

  handlePrivacyPolicy = (e) => {
    e.preventDefault()
    browserHistory.push('/privacypolicy')
  }


  handleNewPledge = (e) => {
    console.log('handleNewPledge fired')

  }

  handleCreateProject = (e) => {
    e.preventDefault()
    browserHistory.push('/create-project/1')
  }

  renderLayout() {

  return(

      <div style={{borderBottom: '1px solid #DBDBDB !important'}}>

        <AppBar
          showMenuIconButton={false}
          style={style.appBar}
          className='appbar'
          iconElementRight={
                            <div style={{display: 'flex', alignItems: 'center'}}>
                            <MediaQuery minDeviceWidth = {700}>
                              {localStorage.getItem('worktoolsToken') ?
                              <RaisedButton
                                style={{height: '36px', marginRight: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                                buttonStyle={{height: '36px'}}
                                 labelStyle={{height: '36px', display: 'inline-flex', alignItems: 'center',
                                      letterSpacing: '0.6px', fontWeight: 'bold'}}
                                labelClassName
                                 label={<span className='flexthis'>Start a Project</span>} onTouchTap={this.handleCreateProject}/>
                               :
                               null}
                            </MediaQuery>
                            <IconButton tooltip='Settings' onTouchTap={this.handleSettingsClick}>
                            <Settings color={'#484848'}/>
                            </IconButton>
                            </div>}
          title={
            <div className='flexthis' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span onTouchTap ={this.handleTitleTap.bind(this)}  className = 'whosin' style={style.title}>
              Who's In?
            </span>

            </div>
          }
          titleStyle = {{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}
          />

        <div>
          {/*<SignupModal

            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          />
          */}
        <Popover
          open={this.state.open}
         anchorEl={this.state.anchorEl}
         anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
         targetOrigin={{horizontal: 'left', vertical: 'top'}}
         onRequestClose={this.handleRequestClose.bind(this)}
       >

         <Menu>
           {
             1 == 1 ? <MenuItem primaryText="Sign In" onTouchTap={this.handleModal}/> :
             <MenuItem primaryText="Sign Out" onTouchTap={this.handleSignOut}/>
           }
           <MenuItem primaryText="Terms &amp; Conditions"  onTouchTap={this.handleTerms}/>
           <MenuItem primaryText="Privacy Policy"  onTouchTap={this.handlePrivacyPolicy}/>

         </Menu>
       </Popover>
       </div>
      </div>
    );
  }
  render () {
    return(
    <div>
      {this.renderLayout()}

    </div>
  )
  }
}
