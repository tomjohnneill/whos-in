import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {Link, browserHistory} from 'react-router';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import DocumentTitle from 'react-document-title';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import MediaQuery from 'react-responsive';
import {SignupModal} from './signupmodal.jsx';
import TextField from 'material-ui/TextField';

const styles = {
  number: {
    color: '#FF9800',
    fontSize: '20px',
  },
  bottomBit: {
    color: grey500,
    marginTop: '-5px',
    fontSize: '12px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  }
}

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

export default class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {modalOpen: false, loading: true, flipped: false}
  }



  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleNewPledge = (e) => {
    console.log('handleNewPledge fired')

  }

  handleCreatePledge = (e) => {
    e.preventDefault()
    browserHistory.push('/projects/new')
  }

  handleTap = (id, slug, e) => {

    console.log(id)
    console.log(slug)
    console.log(e)

    browserHistory.push('/pages/pledges/' + slug + '/' + id)

  }

  handleFlip = (e) => {
    e.preventDefault()
    if (localStorage.getItem('worktoolsToken')) {
      browserHistory.push('/create-project/1')
    } else {
      this.setState({flipped: !this.state.flipped})
    }
  }

  componentDidMount() {
      this.setState({ loading: true });

      fetch('https://ident.me/.json')
      .then(response => response.json())
      .then(function(data) {
        var ip = data
        console.log(data)
        return fetch('https://freegeoip.net/json/' + data.address)
      })
      .then(response => response.json())
      .then(data => console.log(data))

      fetch('https://api.worktools.io/api/Project/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7')
        .then(response => response.json())
        .then(data => this.setState({ projects: data, loading: false }))
        .catch(error => this.setState({ error, loading: false }));


    }

  handleName = (e,  newValue) => {
    this.setState({name: newValue})
  }


  handleEmail = (e, newValue) => {
    this.setState({email: newValue})
  }

  handlePassword = (e, newValue) => {
    this.setState({password: newValue})
  }

  handleCreateAccount = () => {
    var body = {
      'Name' : this.state.name,
      'Email' : this.state.email,
      'Password': this.state.password,
      'External User' : 'True',
      'Role' : 'Volunteer'
    }

    var authenticate = {
      'email': this.state.email,
      'password' : this.state.password
    }
    console.log(body)
    fetch('https://api.worktools.io/api/User/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => console.log(data[0]))
    .then(data => fetch('https://api.worktools.io/api/_/authenticate/?api_token=8613b9b6-8d3c-44da-9592-12998754bf38', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(authenticate)
    }))
    .then(response => response.json())
    .then(data => localStorage.setItem('worktoolsToken', data.api_token))
    .then(data => console.log(localStorage))
    .then(data => browserHistory.push('/create-project'))
    .catch(error => this.setState({ error, loading: false }));
  }

  render() {

    console.log(this.state)

    return (
      <div id='block'>


          <div>
          <div>

            <div style={{width: '100%' , position: 'relative', animation: '16s forwards zoomScale'}}
              className='image-container'>
              <img style={{width: '100%', height: 'calc(100vh - 150px)', objectFit: 'cover'}}
                src='https://d3kkowhate9mma.cloudfront.net/e5ad2d71-5fed-41b8-a1bb-c6583fc77afa'/>
              <div className='overlay' style={{top: 0, right: 0, width: '100%', height: '100%',
                zIndex: 1.5, backgroundColor: 'rgba(0,0,0,0.3)', position: 'absolute'}}/>
            </div>


              <div style={{position: 'absolute',
                zIndex: 2, backgroundColor: 'rgba(0,0,0,0.3)',
                boxShadow: '0 0 50px 50px rgba(0,0,0,0.3)',
                width: '50%',
                top: '165px', left: '60px',
                display: 'flex', alignItems: 'left', flexDirection: 'column'
              }}>
                  <div style={{fontFamily: 'Permanent Marker', fontSize: '100px', color: '#FF9800'}}>
                    Who's In?
                  </div>
                  <div style={{textAlign: 'left', color: 'white', fontSize: '70px'}} >
                    Building a movement starts with one first step

                  </div>

              </div>

            <div
              className='container'
              style={{position: 'absolute', backgroundColor: 'white',
              zIndex: 2, borderRadius: '10px', height: '427px', width: '426px',
              top: '165px', right: '120px', boxShadow: '0px 2px 4px rgba(0,0,0,0.5)'
            }}>
            <div id='card' className={this.state.flipped === true ? 'flipped' : 'notflipped'}>
                <span className='front' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                  <div style={{fontFamily: 'Permanent Marker', paddingBottom: '20px', fontSize: '24px'}}>
                    Create Your Project
                  </div>
                  <div style={{paddingLeft: '60px', paddingRight: '60px', fontSize: '16px', lineHeight: '1.3', paddingBottom: '35px'}}>
                    Are you are charity, organisation or campaign
                  who wants to find supporters for a project you are running?

                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', paddingLeft: '50px', backfaceVisibility: 'inherit'
                    , paddingRight: '50px', borderRadius: '10px', paddingBottom: '20px',
                    display: this.state.flipped ? 'none' : null
                  }}>
                    <RaisedButton fullWidth={true} backgroundColor='#E55749'
                      buttonStyle={{borderRadius: '6px'}}
                      onTouchTap={this.handleFlip}
                      disabled={this.state.flipped}
                      labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                      labelColor='white' label='Create' style={{height: '50px'}}
                      />
                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', paddingLeft: '50px', backfaceVisibility: 'hidden'
                    , paddingRight: '50px', borderRadius: '10px', visibility: this.state.flipped ? 'hidden': null}}>
                    <FlatButton fullWidth={true}  labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center'}}
                      labelColor='white' label='Login' disabled={this.state.flipped} style={{height: '50px', backfaceVisibility: 'hidden'}}/>
                  </div>
                </span>
                <span className='back'
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                      <div style={{paddingBottom: '16px'}}>
                        Create your Account
                      </div>
                      <div style={{width: '100%', paddingLeft: '50px', paddingBottom: '16px',
                        paddingRight: '50px', boxSizing: 'border-box'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Name'}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='name'
                          onChange={this.handleName}
                          style={styles.textfield}/>
                      </div>
                      <div style={{width: '100%', paddingLeft: '50px', paddingBottom: '16px',
                        paddingRight: '50px', boxSizing: 'border-box'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Email'}
                          onChange={this.handleEmail}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='email'
                          style={styles.textfield}/>
                      </div>
                      <div style={{width: '100%', paddingLeft: '50px', paddingBottom: '16px',
                        paddingRight: '50px', boxSizing: 'border-box'}}>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          onChange={this.handlePassword}
                          type='password'
                          hintText={'Password'}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='password'
                          style={styles.textfield}/>
                      </div>
                      <div style={{width: '100%', boxSizing: 'border-box', paddingLeft: '50px', backfaceVisibility: 'inherit'
                        , paddingRight: '50px', borderRadius: '10px', paddingBottom: '20px'}}>
                        <RaisedButton fullWidth={true}
                          backgroundColor={this.state.email && this.state.password && this.state.name ?  '#E55749' : '#C5C8C7'}
                          buttonStyle={{borderRadius: '6px'}}
                          onTouchTap={this.handleCreateAccount}
                          labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                          labelColor='white' label='Complete' style={{height: '50px'}}
                          />
                      </div>

                </span>
                </div>
            </div>

          </div>


        {/*
        <SignupModal
          open={this.state.modalOpen}
          changeOpen={this.handleModalChangeOpen}
          />

          */}
        </div>


      </div>
    )
  }
}
