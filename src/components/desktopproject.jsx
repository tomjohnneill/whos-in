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
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import ThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Payment from 'material-ui/svg-icons/action/payment';
import Assignment from 'material-ui/svg-icons/action/assignment';
import People from 'material-ui/svg-icons/social/person-outline';
import Group from 'material-ui/svg-icons/social/group';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Place from 'material-ui/svg-icons/maps/place';
import SignupModal from './signupmodal.jsx';
import JoiningModal from './joiningmodal.jsx';
import Badge from 'material-ui/Badge';
import Share from './share.jsx'



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
    marginTop: '-5px',
    fontWeight: 'lighter',
    letterSpacing: '1.5px'
  },
  chip: {
  margin: 4,
},
explanation: {
  fontSize: '8pt',
  color: grey500
},     selectedTab: {
    height: '36px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '20px',
    letterSpacing: '0.4px',
    fontFamily: 'Permanent Marker',
    lineHeight: '16px',

    paddingLeft: '20px',
    paddingRight: '20px',
  },
  tab: {
    height: '36px',
    fontFamily: 'Open Sans',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
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

// a and b are javascript Date objects
export function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  try {
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  } catch(err) {
    var utc1 = 0
    var utc2 = 1
  }

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export default class DesktopProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0
      , loading: true, selected: 'story', inkBarLeft: '38.875px'}
  }

  componentDidMount(props) {
    console.log(this.state)
    console.log(this.props)
    this.setState({project: this.props.project, charity: this.props.charity, loading: false})
    console.log(this.state)
  }


  setModal = () => {
    let modal = this.state.modalOpen
    this.setState({modalOpen: !modal})
  }

  handleModal = (e) => {
    this.setState({modalOpen: true})
  }

  handleModalChangeOpen = (e) => {
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
    browserHistory.push(`/pages/pledges/${ this.props.pledge.slug }/${ this.props.pledge._id }/edit` )
  }

  handleUnpledge(_id, title, e) {
    e.preventDefault()

  }

  descriptionMarkup() {
    return {__html: this.state.project.Description ?
      this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.Description}
  }

  handleAdminDrawer = (e) => {
    e.preventDefault()
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
  }


  handleAnalyticsClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/analytics')
  }

  handleProjectClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/project')
  }

  handleConsoleLog = (value) => {

       this.setState({selected: value})

  }

  handleFeedbackClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/pledged-users')
  }

  handleUserInputClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/form-builder')
  }

  handleUserListClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/user-list')
  }

  handleGroupsClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/user-groups')
  }

  handleBroadcastClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/broadcast')
  }

  handlePaymentsClick = (e) => {
    this.setState({adminDrawerOpen: !this.state.adminDrawerOpen})
    browserHistory.push('/pages/pledges/' + this.props.pledge.slug + '/' + this.props.pledge._id + '/payment-plans')
  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    console.log(window.innerWidth)
    this.setState({inkBarLeft: (rect.width-60)/2  + rect.x - (window.innerWidth - Math.min(window.innerWidth,1000) )/2  ,

    })

  }


  render () {
    var tabLength = 2
    var inkBarLeft = this.refs.tabs ? this.refs.tabs.state.selectedIndex : 0 * 50 + 20
    var badgeFill = 1


    return (
      <div>

        {this.state.loading ?


          <div style={{marginTop: '36px'}}>

          <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex',
                justifyContent: 'center'}}>
                <div style={{flex: 1, height: '100%', width: '60%'}}>
                  <div style={{backgroundColor: grey200, width: '100%', height: '300px'}}/>
                </div>
                <div style={{flex: 1, height: '100%', width: '40%', justifyContent: 'space-between', display: 'flex', flexDirection: 'column'}}>
                  <CardTitle
                    style={{paddingTop: '0px', paddingLeft: '32px',  overflowX:'hidden', paddingBottom: '0px'}}
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
                </div>
              </div>
            </div>

         :
            <div style={{marginTop: '20px'}}>

            <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex',
                  justifyContent: 'center'}}>
                  <div style={{width: '100%', maxWidth: '1000px'}}>
                  <div >
                  <p style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left', margin: 0}}>
                    {this.state.project.Name}
                  </p>
                  <p style={{fontSize: '18px', fontWeight: 'light', textAlign: 'left'}}>
                    {this.state.project.Summary}
                  </p>
                </div>

              <div
                ref='variableBox'
                style={{display: 'flex',
                    alignItems: 'center', flexDirection: 'row'}}>
              <div style={{flex: 538, height: '320px', width: '60%'}}>
                <img src={changeImageAddress(this.state.project['Featured Image'], '750xauto')} style={{height: '320px', width: '100%'
                  , objectFit: 'cover'}}/>
              </div>
              <div style={{ height: '320px', width: '383px'}}>
                <CardTitle
                  style={{height: '100%', paddingTop: '0px', paddingLeft: '32px',  overflowX:'hidden', paddingBottom: '0px'}}
                  children={
                    <div style={{justifyContent: 'space-between', display: 'flex', flexDirection: 'column', height: '100%'}}>
                      <div>
                        <p style={{fontWeight: '600',  textAlign: 'left', margin: '0px'}}>50 people are in</p>
                        <p style={{fontWeight: 'lighter',  textAlign: 'left', marginTop: '4px'}}>65 people needed</p>
                        <LinearProgress  style={{height: '5px', borderRadius: '1.5px'}} color={'#00ABE8'} mode="determinate" value={6} />
                        <div style={{display: 'flex', paddingTop: '16px'}}>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                            <div style={styles.bottomBit}>
                              Where
                            </div>
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                            <div style={styles.bottomBit}>
                              Type
                            </div>
                          </div>


                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <div style={styles.number}>
                            {this.state.project['End Date'] ? dateDiffInDays(new Date(),this.state.project['End Date']) : 10}
                          </div>
                          <div style={{fontWeight: 'lighter'}}>
                            days to go...
                          </div>
                        </div>
                      </div>

                      <Share
                        Name={this.props.project.Name}
                        smsbody={encodeURIComponent("I'm thinking of going to this event, can you come with me? ") + window.location.href}
                        emailbody={`Hi%20there%2C%0A%0AI%20just%20agreed%20to%20go%20to%20this%20event%3A%20%22${this.props.project.Name}%22%2C%20but%20don%27t%20really%20want%20to%20go%20to%20it%20by%20myself.%20%0A%0AIf%20you%20come%20with%20me%2C%20we%20could%20both%20do%20something%20good.%20You%20can%20read%20a%20bit%20more%20about%20it%20here%3A%0A%0A${window.location.href}%0A%0AThanks!%0A%0A` + "name"}
                        />

                      <div>
                    <RaisedButton

                       primary={true} fullWidth={true}
                        labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontFamily: 'Permanent Marker', fontSize: '18px'}}
                       label="Join Now" onTouchTap={this.handleJoiningModal} />

                      </div>

                    </div>

                  }/>




                    <div>
                      {this.state.project.location ?
                    <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px'}}>
                      <Place style={{marginRight: '16px'}} color={grey500}/>
                      {this.state.project.location.place}
                    </div>
                    : null}
                    {this.state.project['End Date'] != null ?
                    <div style={{alignItems: 'center', display: 'flex', paddingLeft: '32px', marginTop: '12px'}}>
                      <AccessTime style={{marginRight: '16px'}} color={grey500}/>
                      {this.state.project['End Date']}
                    </div> : null
                  }
                    </div>
              </div>
              </div>
              </div>
            </div>

            <div style={{paddingLeft: 'auto', paddingRight: 'auto', display: 'flex',
                  justifyContent: 'center', marginTop: '32px'}}>
                <div style={{width: '300px', maxWidth: '300px'}}>



                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{backgroundColor: 'white', maxWidth: '1000px', width: '100%', display: 'flex'}}>



            <Tabs
              ref='tabs'
              style={{flex: 538, borderBottom: '1px solid #e4e4e4'}}
              tabItemContainerStyle={{ backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}


                inkBarStyle={{zIndex: 2, backgroundColor: '#FF9800',
                left:this.state.inkBarLeft, width: '60px'}}



              onChange={this.handleConsoleLog}
              tabTemplateStyle={{backgroundColor: 'white'}}

              >
              <Tab
                style={{width: 'auto'}}
                buttonStyle={this.state.selected === 'story' ? styles.selectedTab : styles.tab}
                value='story'
                onTouchTap={this.changeAnchorEl}
                label='The Story'>
                <CardText  children = {
                    <div>
                        <div style={{display: 'flex'}}>
                          Organisation details
                        </div>
                         <div dangerouslySetInnerHTML={this.descriptionMarkup()}/>
                           <div className="fb-like" href={this.state.project.FacebookURL}
                          width='200px'  layout="standard" action="like" size="small" showFaces="true" share="false"></div>
                        <div style={{marginTop: '20px', padding: '16px', boxSizing: 'border-box', backgroundColor: '#f5f5f5'
                          , display: 'flex', height: '77px', alignItems: 'center'}}>
                          <div style={{fontFamily: 'Permanent Marker', fontSize: '20px'}}>
                            Start a project of your own
                          </div>
                          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <RaisedButton label="Let's Go" style={{borderRadius: '4px', float: 'right'}}
                              labelStyle={{fontFamily: 'Permanent Marker'}}/>
                          </div>
                        </div>
                    </div>
                  }>

                </CardText>
              </Tab>
              {this.props.details && this.props.details.length > 0 ?
              <Tab
                style={{width: 'auto'}}
                value='actions'
                buttonStyle={this.state.selected === 'story' ? styles.selectedTab : styles.tab}
                onTouchTap={this.changeAnchorEl}
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
                }>

                <Divider/>
                <div style={{marginBottom: '200px'}}>



                </div>



              </Tab> : null}
              <Tab
                value='feedback'
                style={{width: 'auto'}}
                buttonStyle={this.state.selected === 'feedback' ? styles.selectedTab : styles.tab}
                onTouchTap={this.changeAnchorEl}
                label='Feedback'>
                <div>
                  {/*
                    <OrgFeedback
                      pledgedUsers={this.props.pledge.pledgedUsers}
                      pledgeId={this.props.params._id} pledgeCreatorId={this.props.pledge.creatorId}/>
                    */}
                </div>
              </Tab>

              {this.state.project.stripe && this.state.project.stripe.plans ?
              <Tab
                value='support'
                buttonStyle={styles.selectedTab}
                label='Support'>
                <div>


                </div>
              </Tab> : null}
            </Tabs>

            <div style={{width: 383, boxSizing: 'border-box', padding: '0px 16px 0px 32px'}}>
              <div style={{height: '36px', borderBottom: 'solid 1px #DDDDDD'}}/>
              <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left'}}>Who's In?</h1>
              <li>

                <ul style={{textAlign: 'left', alignItems: 'center', borderBottom: '1px solid #DDDDDD', height: '60px', fontSize: '10px', display: 'flex'}}>
                  <Avatar src=''/>
                  <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                    <div>
                      <b>Name</b> <br/>
                  Where from
                  </div>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    2 minutes ago
                  </div>
                </ul>

                <ul style={{textAlign: 'left', alignItems: 'center', borderBottom: '1px solid #DDDDDD', height: '60px', fontSize: '10px', display: 'flex'}}>
                  <Avatar src=''/>
                  <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                    <div>
                      <b>Name</b> <br/>
                  Where from
                  </div>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    2 minutes ago
                  </div>
                </ul>


                <ul style={{textAlign: 'left', alignItems: 'center', borderBottom: '1px solid #DDDDDD', height: '60px', fontSize: '10px', display: 'flex'}}>
                  <Avatar src=''/>
                  <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                    <div>
                      <b>Name</b> <br/>
                  Where from
                  </div>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    2 minutes ago
                  </div>
                </ul>


              </li>
            </div>


            <CardActions>

            </CardActions>
          </div>
          </div>

          <SignupModal
            _id={this.props.params._id}
            title={this.props.params.pledge}
            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          onComplete={this.onComplete}/>


          <JoiningModal
            _id={this.props.params._id}
            title={this.props.params.project}
              open={this.state.joiningOpen}
              changeOpen={this.handleJoiningChangeOpen}
              onComplete={this.onComplete}
              />



      {/*
      <div>
      <FacebookProvider appId={Meteor.settings.public.FacebookAppId}>
        <Comments href={'https://www.allforone.io' +browserHistory.getCurrentLocation().pathname} />
      </FacebookProvider>
      </div>
      */}

      </div>
    }
  </div>
    )
  }
}
