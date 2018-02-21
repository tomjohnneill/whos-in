import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    var basics = JSON.parse(localStorage.getItem('basics'))
    this.state = {
      searchText: '', places: [], loading: true,
      address: basics ? basics.address : '',
      min: basics? basics.min : null,
      max: basics ? basics.max : null,
      deadline: basics? parseISOString(basics.deadline): null
    }
  }


  handleNext = (e) => {
    e.preventDefault()
    var basics = {address: this.state.address, min: this.state.min,
      max: this.state.max, deadline: this.state.deadline}
    var basicString = JSON.stringify(basics)
    localStorage.setItem('basics', basicString)
    browserHistory.push('/create-project/3')
  }

  handleSetMin = (e) => {
    this.setState({min: e.target.value})
  }

  handleSetMax = (e) => {
    this.setState({max: e.target.value})
  }

  handleSetDeadline = (e, date) => {
    this.setState({deadline: date})
  }

  render() {


    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
          So when is this going to happen?</p>
        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <div style={{width: '100%',  paddingBottom: '32px',
             boxSizing: 'border-box'}}>
            <p style={styles.header}>
              When is the start date and time?
            </p>
            <DatePicker
               style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                   boxSizing: 'border-box'}}
                 underlineShow={false}
                 value={this.state.deadline}
                 onChange={this.handleSetDeadline}
                 hintStyle={{  bottom: '8px'}}
                 hintText="Deadline" textFieldStyle={styles.textfield}/>
             </div>


        <div style={{width: '100%',  paddingBottom: '32px',
           boxSizing: 'border-box'}}>
          <p style={styles.header}>
            When is the finish date and time?
          </p>
          <DatePicker
             style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                 boxSizing: 'border-box'}}
               underlineShow={false}
               value={this.state.deadline}
               onChange={this.handleSetDeadline}
               hintStyle={{  bottom: '8px'}}
               hintText="Deadline" textFieldStyle={styles.textfield}/>
             </div>

        </div>
        <RaisedButton label='NEXT' backgroundColor='#E55749'
          onTouchTap={this.handleNext}
          labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
      </div>
    )
  }
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export default class DateAndTime extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{maxWidth: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div style={{paddingRight: '50px'}}>
                <Form />
              </div>
            </div>

              <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
                <img src='http://dru-cdn.zipcar.com/sites/default/files/6__milwaukeefarm_4.jpg'
                  style={{width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
              </div>

          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: '16px'}}>
            <Form />
          </div>
        </MediaQuery>
      </div>
    )
  }
}
