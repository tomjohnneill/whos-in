import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Plant, Spiral} from './icons.jsx';
import {grey500} from 'material-ui/styles/colors'

var commonPassword = require('common-password');

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

export default  class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {type: 'signup', loading: false}
  }

  handleName = (e,  newValue) => {
    this.setState({name: newValue})
  }


  handleEmail = (e, newValue) => {
    this.setState({email: newValue})
  }

  handlePassword = (e, newValue) => {
    if (commonPassword(newValue)) {
      this.setState({badPassword: true})
    } else {
      this.setState({badPassword: false})
    }
    this.setState({password: newValue})
  }

  handleCreateAccount = () => {
    var body = {
      'Name' : this.state.name,
      'Email' : this.state.email,
      'Password': this.state.password,
      'External User' : true,
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
    .then(data => fetch('https://api.worktools.io/api/_/authenticate/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(authenticate)
    }))
    .then(response => response.json())
    .then(data => {console.log(data);localStorage.setItem('worktoolsToken', data.api_token)})
    .then(data => console.log(localStorage))
    .then(data => this.props.onComplete())
    .catch(error => this.setState({ error, loading: false }));

    fetch(`https://api.worktools.io/api/User/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Email=${this.state.email}`)
    .then(response => response.json())
    .then(data => localStorage.setItem('worktoolsID', data[0]._id))
    .catch(error => this.setState({ error}));
  }

  handleLogin = () => {
    var authenticate = {
      'email': this.state.email,
      'password' : this.state.password
    }
    fetch('https://api.worktools.io/api/_/authenticate/?api_token=8613b9b6-8d3c-44da-9592-12998754bf38', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(authenticate)
    })
    .then(response => response.json())
    .then(data => localStorage.setItem('worktoolsToken', data.api_token))
    .then(data => console.log(localStorage))
    .then(data => this.props.onComplete())
    .catch(error => this.setState({ error, loading: false }));

    fetch(`https://api.worktools.io/api/User/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Email=${this.state.email}`)
    .then(response => response.json())
    .then(data => localStorage.setItem('worktoolsID', data[0]._id))
    .catch(error => this.setState({ error}));
  }

  handleSwitchType = (e) => {
    e.preventDefault()
    if (this.state.type === 'login') {
      this.setState({type: 'signup'})
    } else {
      this.setState({type: 'login'})
    }
  }

  render() {


    return (
      <div>
        <Dialog
          open={this.props.open ? true : false}
          modal={false}

          onRequestClose={this.props.changeOpen}
          contentStyle={{width: '90%', maxWidth: '350px'}}
          >
          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }
          <div>
            {this.state.type === 'signup' ?
          <span
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                <Plant style={{marginBottom: '16px', height: '80px'}}/>
                <div style={{paddingBottom: '16px'}}>
                  Create your Account
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
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
                <div style={{width: '100%',paddingBottom: '16px',
                  boxSizing: 'border-box'}}>
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
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    onChange={this.handlePassword}
                    errorStyle={{marginTop: 6}}
                    errorText={this.state.badPassword ? "That password isn't very secure, try something else" : null}
                    onChange={this.handlePassword}
                    type='password'
                    hintText={'Password'}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='password'
                    style={styles.textfield}/>
                </div>
                <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                  ,borderRadius: '10px', paddingBottom: '20px'}}>
                  <RaisedButton fullWidth={true}
                    backgroundColor={this.state.email && this.state.password && this.state.name && !this.state.badPassword ?  '#E55749' : '#C5C8C7'}
                    buttonStyle={{borderRadius: '6px'}}
                    onClick={this.handleCreateAccount}

                    labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                    labelColor='white' label='Complete' style={{height: '50px'}}
                    />
                </div>
                <div>
                  Or switch to <b onTouchTap={this.handleSwitchType} style={{color: '#E55749'}}>Login</b>
                </div>

          </span>

          :

          <span
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                <Spiral style={{marginBottom: '16px', height: '80px'}}/>
                <div style={{paddingBottom: '16px'}}>
                  Login
                </div>


                <div style={{width: '100%',paddingBottom: '16px',
                  boxSizing: 'border-box'}}>
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
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
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
                <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                  ,borderRadius: '10px', paddingBottom: '20px'}}>
                  <RaisedButton fullWidth={true}
                    backgroundColor={this.state.email && this.state.password  ?  '#E55749' : '#C5C8C7'}
                    buttonStyle={{borderRadius: '6px'}}
                    onTouchTap={this.handleLogin}
                    labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                    labelColor='white' label='Go' style={{height: '50px'}}
                    />
                </div>
                <div>
                  Or switch to <b onTouchTap={this.handleSwitchType} style={{cursor: 'pointer',color: '#E55749'}}>
                  {this.state.type === 'login' ? 'Sign up' : 'Login'}</b>
                </div>

          </span>


        }

        </div>

        </Dialog>
      </div>
    )
  }
}
