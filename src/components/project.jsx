import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {Link, browserHistory} from 'react-router';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Edit from 'material-ui/svg-icons/image/edit';
import DocumentTitle from 'react-document-title';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import {Helmet} from "react-helmet";
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
//import MessengerPlugin from 'react-messenger-plugin';
//import Form from '/imports/ui/components/form.jsx';
//import OrgFeedback from '/imports/ui/components/organisationfeedback.jsx';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import ThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Payment from 'material-ui/svg-icons/action/payment';
import Assignment from 'material-ui/svg-icons/action/assignment';
import People from 'material-ui/svg-icons/social/person-outline';
import Group from 'material-ui/svg-icons/social/group';
import MediaQuery from 'react-responsive';
import DesktopProject from './desktopproject.jsx';
import SignupModal from './signupmodal.jsx';
import JoiningModal from './joiningmodal.jsx';
import Badge from 'material-ui/Badge';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Place from 'material-ui/svg-icons/maps/place';
import FacebookProvider, { Like } from 'react-facebook';

const Loading = () => (
  <div/>
)


const styles = {
  box: {
    backgroundColor: grey200,
    marginTop: '10px',
    marginBottom: '10px',
    padding: '10px'
  },
  header: {
    backgroundColor: 'white',
    fontSize: '20pt',
    fontWeight: 'bold',
    padding: '10px',
  },
  cardTitle: {
    display: 'flex',
    marginTop: '10px'
  },
  bigTitle: {
    width: '50%',
    fontStyle: 'italic',
    color: grey500
  },
  currentCommitments: {
    textAlign: 'center',

  },
  targetCommitments: {
    textAlign: 'center'
  },
  smallIcon: {
    width: 24,
    height: 24,
    color: 'white',
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 36,
    height: 36,
    padding: '4px 4px 4px 20px'
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
  number: {
    color: '#FF9800',
    fontSize: '20px',

  },
  bottomBit: {
    color: grey500,
    marginTop: '-5px'
  },
  chip: {
  margin: 4,
},
explanation: {
  fontSize: '8pt',
  color: grey500
}
}


var _MS_PER_DAY = 1000 * 60 * 60 * 24;

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

const FB = window.FB

export default class Project extends React.Component {
  constructor(props) {
    super(props);
    var worktoolsToken = localStorage.getItem('worktoolsToken')
    var loggedIn
    if (worktoolsToken) {
      loggedIn = true
    } else {
      loggedIn = false
    }
    this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0, loading:true, loggedIn: loggedIn}
  }

  loadFbLoginApi() {

       window.fbAsyncInit = function() {
           window.FB.init({
               appId      : '1924574794468253',
               cookie     : true,  // enable cookies to allow the server to access
               // the session
               xfbml      : true,  // parse social plugins on this page
               version    : 'v2.1' // use version 2.1
           });
       };

       console.log("Loading fb api");
         // Load the SDK asynchronously
       (function(d, s, id) {
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) return;
           js = d.createElement(s); js.id = id;
           js.src = "//connect.facebook.net/en_US/sdk.js";
           fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
  }


  componentDidMount(props) {

    this.loadFbLoginApi()
    this.setState({ loading: true });



    fetch('https://api.worktools.io/api/Project/'+ this.props.params._id + '/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7')
      .then(response => response.json())
      .then(function(data) {
        var project = data[0]
        console.log(project)
        this.setState({project: project})
        return fetch('https://api.worktools.io/api/Charity/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&=Account%20Owner=' + project['Account Owner']);

      }.bind(this))
      .then(response => response.json())
      .then(data => this.setState({charity: data[0], loading: false}))
      .catch(error => this.setState({ error, loading: false }));


  }

  handleLinkedInAuthorize = () => {
    browserHistory.push(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77x7m5rz1zpal8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flinkedin%2F%3Fid%3D${this.state.project.id}&state=987654321&scope=r_basicprofile`)
  }

  handleFacebookAuthorize = () => {

  }

  handleTabClick = (tab) => {
    console.log(tab)
  }

  handleModal = (e) => {
    this.setState({modalOpen: true})
  }

  handleModalChangeOpen = (e) => {
    console.log('modal change state fired for some reason')
    this.setState({modalOpen: false})
  }

  handleJoiningModal = (e) => {

    this.setState({joiningOpen: true})
  }

  handleJoiningChangeOpen = () => {
    console.log('modal change state fired for some reason')
    this.setState({joiningOpen: false})


  }

  handleDecline(e) {
    e.preventDefault()
    this.setState({open: true})
  }

  handleClose() {
  this.setState({open: false});
};

  handleEditClick = (e) => {
    e.preventDefault()
    // I need to do something here
  }

  handleUnpledge(_id, title, e) {
    e.preventDefault()

  }

  descriptionMarkup() {
    return {__html: this.state.project.Description ?
      this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.what}
  }

  handleAdminDrawer = (e) => {
    e.preventDefault()
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
  }

  handleAnalyticsClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.state.pledge.slug + '/' + this.state.pledge._id + '/analytics')
  }

  handleProjectClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.state.pledge.slug + '/' + this.state.pledge._id + '/project')
  }

  handleConsoleLog = (e) => {
    setTimeout(() => {
       this.setState({selectedIndex: this.refs.tabs.state.selectedIndex})
   }, 100);
  }

  handleFeedbackClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.state.pledge.slug + '/' + this.state.pledge._id + '/pledged-users')
  }

  handleUserInputClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.state.pledge.slug + '/' + this.state.pledge._id + '/form-builder')
  }

  handleUserListClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.state.pledge.slug + '/' + this.state.pledge._id + '/user-list')
  }

  handleGroupsClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.state.pledge.slug + '/' + this.state.pledge._id + '/user-groups')
  }

  onComplete = (e) => {

  }

  setLoggedIn = () => {
    this.setState({loggedIn: true, modalOpen: false})
  }

  addOg = (nextProps) => {

  }

  addTwitterMeta = (nextProps) => {

  }

  handleFriendClick(_id, e) {
    e.preventDefault()

  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {

      this.addOg(nextProps)
      this.addTwitterMeta(nextProps)

    }

  }




  render () {


    /*
    var tabLength = 2
    if (!this.props.loading) {
      console.log(this.props.details)
      if (this.props.pledge.stripe && this.props.pledge.stripe.plans) {
        tabLength += 1
      }
      if (this.props.details && this.props.details.length > 0) {
        console.log(this.props.details)
        tabLength += 1
      }
    }
    console.log('Tab Length: ' + tabLength)

    var inkBarLeft = this.refs.tabs ? this.refs.tabs.state.selectedIndex : 0 * 50 + 20

    var badgeFill
     if (this.props.details && this.props.details.length > 0 && this.props.details[this.props.details.length-1].members) {
      var lastResponse = this.props.details[this.props.details.length-1].members.filter(function(response) {
        return response.userId == Meteor.userId()
        if (lastResponse) {
          badgeFill = null
        } else {
          badgeFill = this.props.details.length
        }
      })
    } else if (this.props.details && this.props.details.length > 0) {
      badgeFill = this.props.details.length
    } else {
      badgeFill = null
    }

    */

    var badgeFill = 1
    var tabLength = 2


    console.log(this.state)

    return (
      <div>
        {this.state.loading ?
          <div/>
          :
          <Helmet>
              <meta charSet="utf-8" />
              <title>{this.state.project.Name}</title>

                <meta property="og:url"                content={window.location.href} />
                <meta property="og:type"               content="article" />
                <meta property="og:title"              content={this.state.project.Name}/>
                <meta property="og:description"        content={this.state.project.Summary} />
                <meta property="og:image"              content={this.state.project['Featured Image']} />
                <meta name="twitter:card" content={this.state.project.Summary} />
                <meta name="Description" content={this.state.project.Summary}/>

          </Helmet>
        }
        <div>
        {this.state.loading ?

          <MediaQuery maxDeviceWidth={700}>
            <Card style={{backgroundColor: 'white', maxWidth: '700px'}}>
              <div style={{padding: '10px'}}>
                <Chip
                  style={{paddingLeft: '10px', paddingRight: '40px'}}
                >
                .
                </Chip></div>
                <CardMedia
                >
                  <div style={{height: '200px', backgroundColor: grey200, width: '100%'}} />
                </CardMedia>
                <CardTitle
                  style={{overflowX:'hidden'}}
                  title={<div style={{backgroundColor: '#dbdbdb', height: '36px', width: '90%'}}/>}
                  subtitle={<div style={{backgroundColor: '#efefef', height: '16px', width: '100%', marginTop: '3px'}}/>}
                  children={
                    <div>
                      <div style={{height: '16px'}}/>
                      <LinearProgress  style={{height: '10px', borderRadius: '4px'}}
                        color={amber500} mode="determinate"
                        value={0} />
                      <div style={{display: 'flex', paddingTop: '16px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                          <div style={{backgroundColor: '#ffefd8', height: '16px', width: '5px'}}>

                          </div>
                          <div style={{color: grey500}}>
                           people
                          </div>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                          <div style={{backgroundColor: '#ffefd8', height: '16px', width: '5px'}}>

                          </div>
                          <div style={{color: grey500}}>
                            days to go...
                          </div>
                        </div>
                      </div>

                      <div>

                        <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '16px', width: '100%', boxSizing: 'border-box'}}>
                          <Place style={{marginRight: '16px'}} color={grey500}/>
                          <div style={{backgroundColor: '#efefef', height: '12px', width: '60%'}}/>
                        </div>


                        <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '12px', width: '100%', boxSizing: 'border-box'}}>
                          <AccessTime style={{marginRight: '16px'}} color={grey500}/>
                          <div style={{backgroundColor: '#efefef', height: '12px', width: '30%'}}/>
                        </div>

                      </div>
                    </div>

                  }/>
            </Card>
          </MediaQuery>
            :
          <DocumentTitle title={this.state.project.Name}>
            <div>
          <MediaQuery minDeviceWidth={700}>
              <DesktopProject params={this.props.params} project={this.state.project} charity={this.state.charity}/>
          </MediaQuery>

          <MediaQuery maxDeviceWidth = {700}>
          <Card style={{backgroundColor: 'white', maxWidth: '700px'}}>

              <div style={{padding: '10px'}}>
                <Chip

                >
                  <Avatar src={this.state.project.creatorPicture} />
                  by {this.state.charity.Name}
                </Chip></div>

            <CardMedia

            >
              <img src={this.state.project['Featured Image']} />
            </CardMedia>
            <CardTitle
              style={{overflowX:'hidden'}}
              title={this.state.project.Name}
              subtitle={this.state.project.Summary}
              children={
                <div>
                  <div style={{height: '16px'}}/>
                  <LinearProgress  style={{height: '10px', borderRadius: '4px'}} color={amber500} mode="determinate" value={this.state.project.projectCount/this.state.project.target*100} />
                  <div style={{display: 'flex', paddingTop: '16px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                      <div style={styles.number}>
                        {this.state.project.projectCount}
                      </div>
                      <div style={styles.bottomBit}>
                        /{this.state.project.target} people
                      </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                      <div style={styles.number}>

                      </div>
                      <div style={styles.bottomBit}>
                        days to go...
                      </div>
                    </div>
                  </div>
                  <div>
                    {this.state.project.location ?
                  <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '16px'}}>
                    <Place style={{marginRight: '16px'}} color={grey500}/>
                    {this.state.project.location.place}
                  </div>
                  : null}
                  {this.state.project.eventDate ?
                  <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '12px'}}>
                    <AccessTime style={{marginRight: '16px'}} color={grey500}/>
                    {this.state.project.eventTime.getHours() + ':' + this.state.project.eventTime.getMinutes() + ', ' + this.state.project.eventDate.toLocaleDateString()}
                  </div> : null
                }
                  </div>
                </div>

              }/>


              <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '60%', marginBottom: '16px'}}>
                  {1 ==1 ?
                    <div>
                  <RaisedButton

                     primary={true} fullWidth={true} labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                      label="Join Now" onTouchTap={this.state.loggedIn ? this.handleJoiningModal : this.handleModal} />

                    </div>:
                  <RaisedButton primary={true} fullWidth={true}  labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                    label="Join Now" onTouchTap={this.handleFacebook} /> }
                </div>
            </div>



            {/*
            <div style={{color: 'rgba(0, 0, 0, 0.54)', padding: '16px', fontSize: '14px'}}>
              All or nothing - either all {this.state.pledge.target} of us, or none of us do this.
            </div>
            */}
            <Divider/>


            <Tabs
              ref='tabs'
              style={{overflowX: 'hidden'}}
              onChange={this.handleConsoleLog}
              tabTemplateStyle={{backgroundColor: 'white'}}
              inkBarStyle={{left: (this.state.selectedIndex) * (100/tabLength) + 5 + '%', backgroundColor: '#FF9800'
                , zIndex: 2, width: 100/tabLength - 10 +  '%'}}
              children={<Divider/>}
              >
              <Tab
                buttonStyle={{textTransform: 'none', color: 'rgba(0, 0, 0, 0.54)', backgroundColor: 'white',
                                }}
                label='The Story'>
                <CardText  children = {
                    <div>
                         <div dangerouslySetInnerHTML={this.descriptionMarkup()}/>
                           <FacebookProvider appId="1924574794468253">
                            <Like target="_top" href={this.state.project.FacebookURL} colorScheme="dark" showFaces={true} share />
                          </FacebookProvider>
                    </div>
                  }>

                </CardText>
              </Tab>
              {this.state.details && this.state.details.length > 0 ?
              <Tab
                buttonStyle={{textTransform: 'none', color: 'rgba(0, 0, 0, 0.54)', backgroundColor: 'white',
                                }}
                label={
                  badgeFill > 0 ?
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{marginRight: '12px'}}>Actions
                      </div>
                  <Badge
                    badgeStyle={{position: 'inherit'}}
                    secondary={true}
                    style={{padding: '0px'}}
                    badgeContent={badgeFill}
                    />
                  </div> :
                  "Actions"
                }

                >

                <Divider/>
                <div style={{marginBottom: '200px'}}>
                  {/*
                                        <Form pledgeId={this.state.params._id} setModal={this.setModal}  handleFacebook={this.handleFacebook} pledgedUsers={this.state.pledge.pledgedUsers}/>
                      */}
                </div>



              </Tab> : null}
              <Tab
                buttonStyle={{textTransform: 'none', color: 'rgba(0, 0, 0, 0.54)', backgroundColor: 'white',
                                }}
                label='Feedback'>
                <div>
                  {/*
                    <OrgFeedback
                      pledgedUsers={this.state.pledge.pledgedUsers}
                      pledgeId={this.state.params._id} pledgeCreatorId={this.state.pledge.creatorId}/>
                      */}

                </div>
              </Tab>

              {this.state.project.stripe && this.state.project.stripe.plans ?
              <Tab
                buttonStyle={{textTransform: 'none', color: 'rgba(0, 0, 0, 0.54)', backgroundColor: 'white',
                                }}
                label='Support'>
                <div>



                </div>
              </Tab> : null}
            </Tabs>


            <CardActions>

            </CardActions>
          </Card>

          </MediaQuery>

          <SignupModal
            _id={this.props.params._id}
            title={this.props.params.project}
            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          onComplete={this.setLoggedIn}/>

        <JoiningModal
          _id={this.props.params._id}
          Name={this.state.project.Name}
          title={this.props.params.project}
            open={this.state.joiningOpen}
            changeOpen={this.handleJoiningChangeOpen}
            onComplete={this.onComplete}
            />

          </div>
      </DocumentTitle >
      }
    </div>
      <Drawer
        onRequestChange={(open) => this.setState({adminDrawerOpen: open})}
        docked={false}
        open={this.state.adminDrawerOpen}>
        <Subheader style={{backgroundColor: grey200, fontSize: '20px' ,color: 'rgba(0, 0, 0, 0.87)'}}>Admin Tools</Subheader>
        <Divider/>
          <MenuItem leftIcon={<ShowChart/>} onTouchTap={this.handleAnalyticsClick} >Analytics</MenuItem>
          <MenuItem leftIcon={<ThumbsUpDown/>} onTouchTap={this.handleFeedbackClick} >Feedback</MenuItem>
          <MenuItem leftIcon={<Group/>} onTouchTap={this.handleGroupsClick} >User Groups</MenuItem>
          <MenuItem leftIcon={<People/>} onTouchTap={this.handleUserListClick} >Pledged Users List</MenuItem>
        </Drawer>

      </div>
    )
  }
}
