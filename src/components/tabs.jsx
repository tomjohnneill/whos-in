import React , {PropTypes} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Home from './home.jsx';
import Profile from './profile.jsx';
import CharitiesList from './charitieslist.jsx';
import ProjectList from './projectlist.jsx';
import { Link, browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Featured from './featured.jsx';

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#FF9800',
    textTransform: 'none',
    fontSize: '20px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    fontFamily: 'Permanent Marker',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  tab: {
    height: '60px',
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
  textfield: {
    height: '40px',
    fontsize: '20px'
  }
}


export default class UserTabs extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
    var lookup = ['projects','profile','charities']
    this.state = {
      slideIndex: this.props.params.tab ? lookup.indexOf(this.props.params.tab) : 0,
      inkBarLeft: '25.0625px',
    };
  }

  componentDidMount() {
    this.setState({value: this.props.params.tab})
  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-60)/2  + rect.x - 60,

    })

  }

  handleTwoTabClick = (value) => {
    var lookup = ['projects','profile','charities']
    browserHistory.push('/' + value)
    this.setState({
      value: value,
      slideIndex: lookup.indexOf(value),
    });
  }

  render () {
    console.log(this.state)
    return (
      <div>
        {localStorage.getItem('worktoolsToken') ?
          null
        :
      <Home/>
        }
        <Tabs
          className='tab'
          style={{borderBottom: '1px solid #e4e4e4', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1) ', paddingLeft: '60px', paddingRight: '60px'}}
          tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
            value={this.props.params.tab}
            onChange={this.handleTwoTabClick}
            inkBarStyle={{zIndex: 2, backgroundColor: '#FF9800',
            left:this.state.inkBarLeft, width: '60px'}}
          >

            <Tab
              onTouchTap={this.changeAnchorEl}
              label="Featured"  buttonStyle={this.props.params.tab === 'projects' ||
              !this.props.params.tab ? styles.selectedTab : styles.tab} style={{width: 'auto', fontSize: '16px'}} value="projects">
              <span>
                <ProjectList id='block'/>
              </span>
            </Tab>
            <Tab
              onTouchTap={this.changeAnchorEl}
              label="Outdoor" buttonStyle={this.props.params.tab === 'profile' ?
              styles.selectedTab : styles.tab} style={{width: 'auto', fontSize: '16px'}} value="profile">
              <span>
                <ProjectList id='block'/>
              </span>
            </Tab>
            <Tab
              onTouchTap={this.changeAnchorEl}
               label="Young People" buttonStyle={this.props.params.tab === 'charities' ?
              styles.selectedTab : styles.tab} style={{width: 'auto', fontSize: '16px'}} value="charities">
              <ProjectList  id='block'/>
            </Tab>
          </Tabs>
          <div style={{height: '311px', backgroundColor: '#F9F9F9', paddingTop: '81px',
            paddingLeft: '50px', paddingRight: '50px', display: 'flex', justifyContent: 'center'}}>
            <div style={{flex: 3}}>
              <div style={{paddingBottom: '16px', textAlign: 'left'}}>
                Newsletter
              </div>
              <TextField fullWidth={true}
                inputStyle={{borderRadius: '2px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                type='email'
                hintText={'Email Address'}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='email'
                style={styles.textfield}/>
              <div style={{width: '100%', display: 'flex', alignItems: 'left', paddingTop: '16px'}}>
                <RaisedButton label='Subscribe' backgroundColor='#E55749' labelStyle={{textTransform: 'none', color: 'white'}}/>
              </div>
            </div>
            <div style={{flex: 2}}>
              Address
            </div>
            <div style={{flex: 2}}>
              Contact us
              <br/>

            </div>
            <div style={{flex: 2}}>
              Find us on social media
            </div>
            <div style={{flex: 2}}>
              Terms
            </div>
          </div>
      </div>
    )
  }
}
