import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Search from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';



const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px',
    boxSizing: 'border-box'
  },
  whiteTextfield : {
    backgroundColor: 'rgb(255,255,255)',
    height: '40px',

  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 700
  }
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}


export default class OrganisationLookup extends React.Component{
  constructor(props) {
    super(props);
    this.state = {searchText: '', charities: [], loading: false, stage: 0}
  }

  loadPlacesApi() {

  }

  componentDidMount(props) {
    this.loadPlacesApi()
  }

  handleClose = () => {
    this.setState({error: null});
  };

   debounce = function(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };

  fetchCharities = () => {
    console.log('fetching')
    fetch('https://charitybase.uk/api/v0.2.0/charities?search=' + encodeURIComponent(this.state.searchText))
    .then(response => response.json())
    .then(function(data) {
      var charities = data.charities.map(a => a.name)
      this.setState({rawCharities: data.charities})
      this.setState({charities: []})
      this.setState({charities: charities})
    }.bind(this))
    .catch(error => this.setState({error}))
  }

  handleUpdateInput = (searchText) => {


    this.setState({
      searchText: searchText,
    });

    this.debounce(this.fetchCharities(), 500)


    };

  handleNewRequest = (string, v) => {
    console.log(string)
    console.log(this.state.rawCharities)
    var newArray = this.state.rawCharities.filter(function (el) {
      return el.name === string
      });
    console.log(newArray)
    this.setState({loading: true})
    fetch(`https://charitybase.uk/api/v0.2.0/charities?search=${string}&fields=beta.activities,favicon,mainCharity,charityNumber,contact&limit=1`)
    .then(response => response.json())
    .then(data => {this.setState({loading: false, details: data.charities ? data.charities[0] : {}});
      var charity = data.charities[0]
      this.setState({
        activities: charity.beta ? charity.beta.activities : null,
        email: charity.mainCharity ? charity.mainCharity.email : null,
        website: charity.mainCharity ? charity.mainCharity.website : null,
        phone: charity.contact ? charity.contact.phone : null,
        address: charity.contact ? charity.contact.address.toString() : null,
        postcode: charity.contact ? charity.contact.postcode : null,
        charityNumber: charity.charityNumber,
      })
    }
  )
    };

  changeCharityInfo (id, e, nv) {
    console.log(id)
    console.log(nv)
    console.log(e)
    this.setState({[id]: nv})
  }


  handleNext = (e) => {
    e.preventDefault()
    var worktoolsToken = localStorage.getItem('worktoolsToken')
    var basics = JSON.parse(localStorage.getItem('basics'))
    var story = JSON.parse(localStorage.getItem('story'))
    var coverPhoto = localStorage.getItem('coverPhoto')
    var times = JSON.parse(localStorage.getItem('times'))
    var body = {
      'Name': story.title,
      'Description': story.story,
      'Target People': basics.min,
      'Maximum People': basics.max,
      'Featured Image': coverPhoto,
      'Deadline': basics.deadline,
      'Location': basics.address,
      'Start Time': times['Start Time'],
      'End Time': times['End Time']
    }
    console.log(body)
    console.log(JSON.stringify(body))


    var charityBody = {
      'Name': this.state.searchText,
      'Summary': this.state.activities,
      'Description': this.state.activities,
      'Website': this.state.website,
      'Email': this.state.email,
      'Address': this.state.address,
      'Logo': this.state.logo,
      'Phone': this.state.phone,
      'Postcode': this.state.postcode,
      'Charity Number': this.state.charityNumber,
      'Facebook': this.state.facebook,
      'Instagram': this.state.instagram,
      'Twitter': this.state.twitter
    }
    fetch(`https://api.worktools.io/api/Charity/?api_token=${worktoolsToken}&Charity%20Number=${this.state.charityNumber}`)
    .then(response => response.json())
    .then(data => {
      if (data[0]) {
        fetch(`https://api.worktools.io/api/Charity/${data[0].id}/?api_token=${worktoolsToken}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify(charityBody)
        })
        .then(response => response.json())
        .then(newData => console.log(newData))
        .then(newData => {
          body.Charity = data[0].id
          fetch(`https://api.worktools.io/api/Project/?api_token=${worktoolsToken}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
          })
          .then(response => response.json())
          .then(data => browserHistory.push('/create-project/' + data[0].id))
          .catch(error => {this.setState({error: error}); console.log(error)})

        }
        )
        .catch(error => {this.setState({error: error}); console.log(error)})
      } else {
        fetch(`https://api.worktools.io/api/Charity/?api_token=${worktoolsToken}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(charityBody)
        })
        .then(response => response.json())

        .then(data => {
          console.log(data)
          body.Charity = data[0].id
          console.log(body)
          fetch(`https://api.worktools.io/api/Project/?api_token=${worktoolsToken}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
          })
          .then(response => response.json())
          .then(newProject => {
            console.log(newProject)
            browserHistory.push('/create-project/' + newProject[0].id)})
          .catch(error => {this.setState({error: error}); console.log(error)})

        }
        )
        .catch(error => {this.setState({error: error}); console.log(error)})
      }
    })

    .catch(error => {this.setState({error: error}); console.log(error)})



    /*
    localStorage.removeItem('basics')
    localStorage.removeItem('story')
    localStorage.removeItem('times')
    localStorage.removeItem('coverPhoto')
    */
  }

  handleFill = (e) => {
    console.log(this.state.details)
    e.preventDefault()
    if (!this.state.details) {
      this.setState({loading: true})
    }
    this.setState({stage: 1})
  }

  render() {
    console.log(this.state)
    return (
      <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
        <div style={{width: '500px', display: 'flex'
          , justifyContent: 'center'}} className='basics-container'>
          <div className='form' style={{textAlign: 'center', paddingLeft: '50px', paddingRight: '50px'}}>
            <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px'}}>
              Add your details</p>
            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <p style={{margin: '0px', paddingRight: '24px', paddingLeft: '24px', paddingBottom: '16px'}}>
              First, type your organisation's name, then we'll see if we can find your details for you.
              </p>
              <AutoComplete
                fullWidth={true}
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box', height: '40px'}}
                hintText="Type your organisation name or charity number"
                searchText={this.state.searchText}
                underlineShow={false}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                onUpdateInput={this.handleUpdateInput}
                onNewRequest={this.handleNewRequest}
                dataSource={this.state.charities}
                openOnFocus={true}
                textFieldStyle={{height: '40px'}}
                style={styles.textfield}
                filter={(searchText, key) => true}
              />
            </div>
            <div >
              {this.state.stage === 1 && !this.state.loading ?
                <div>
                <div style={{height: '40px'}}/>
              <RaisedButton label='Save and Continue' primary={true}
                onTouchTap={this.handleNext}
                fullWidth={true}
                labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}
                />

              </div>
              :
              <div>
                <RaisedButton label='Smart Fill' backgroundColor='#E55749'
                  onTouchTap={this.handleFill}
                  fullWidth={true}
                  labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
                <FlatButton style={{marginTop: '16px'}} label='Fill in by hand' labelStyle={{color: '#4A90E2'}}
                  onTouchTap={(e) => {this.setState({stage: 1, loading: false, details: {}})}}
                  fullWidth={true}/>
              </div>
            }
            </div>
          </div>
        </div>
        <div style={{flex: 1, width: '100%', marginLeft: '50px', boxSizing: 'border-box', height: '70vh'}} className='basics-image'>
          {this.state.stage === 0 ?
            <div style={{backgroundColor: '#F5F5F5',display: 'flex', alignItems: 'center', flexDirection: 'column', height: '70vh', justifyContent: 'center'}} >

                <Search style={{height: '100px', width: '100px'}} color='rgb(0,0,0)'/>
                <p style={{width: '100%', marginTop: '16px'}}>
                  We'll try and find your details for you
                </p>
            </div>
            :
            this.state.loading ?
            <div style={{height: '70vh', display: 'flex', flexDirection: 'column',
               justifyContent: 'center', alignItems: 'center', backgroundColor:'#F5F5F5' }}>
              <CircularProgress size={80} thickness={5} />
              <div style={{paddingTop: '16px'}}>
                We're just seeing if we can find your details
              </div>
            </div>
            :
            <div style={{marginTop: '-10px', paddingLeft: '50px', paddingRight: '50px', textAlign: 'left'}}>
              <div style={{padding: '10px', backgroundColor: '#F5F5F5', fontFamily: 'Permanent Marker', fontSize: '30px', marginBottom: '16px'}}>
                Check your details
              </div>

              <div style={{padding: '6px'}}>
                <p style={styles.header}>
                Display Name
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  defaultValue={this.state.details.name}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='name'
                  onChange={this.changeCharityInfo.bind(this, 'name')}
                  style={styles.whiteTextfield}/>
              </div>


              <div style={{display: 'flex'}}>
                <div style={{flex: '2', padding: '6px'}}>
                  <p style={styles.header}>
                  Contact
                </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.changeCharityInfo.bind(this, 'phone')}
                      defaultValue={this.state.phone}
                      hintText={'Phone'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='location3'
                      style={styles.whiteTextfield}/>

                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.changeCharityInfo.bind(this, 'address')}
                      defaultValue={this.state.address}
                      hintText={'Address'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='location3'
                      style={styles.whiteTextfield}/>

                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.changeCharityInfo.bind(this, 'postcode')}
                      defaultValue={this.state.postcode}
                      hintText={'Postcode'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='location3'
                      style={styles.whiteTextfield}/>


                </div>

                <div style={{flex: 1, padding: '6px'}}>
                  <p style={styles.header}>
                  Charity Number
                  </p>
                  <TextField fullWidth={true}
                    inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    defaultValue={this.state.charityNumber}
                    onChange={this.changeCharityInfo.bind(this, 'charityNumber')}
                    hintText={'Charity Number'}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    key='location3'
                    style={styles.whiteTextfield}/>
                </div>
              </div>

              <div style={{padding: '6px'}}>
                <p style={styles.header}>
                Organisation Activities
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  defaultValue={this.state.activities}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  onChange={this.changeCharityInfo.bind(this, 'activities')}
                  key='activities'
                  rows={3}
                  multiLine={true}
                  style={styles.whiteTextfield}/>
              </div>

              <div style={{display: 'flex'}}>
                <div style={{flex: 1, padding: '6px'}}>
                  <p style={styles.header}>
                  Email
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'Email'}
                  onChange={this.changeCharityInfo.bind(this, 'email')}
                  defaultValue={this.state.email}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                <p style={styles.header}>
                  Facebook
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'Facebook'}
                  defaultValue={this.state.facebook}
                  onChange={this.changeCharityInfo.bind(this, 'facebook')}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                <p style={styles.header}>
                  Instagram
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'@Username'}
                  defaultValue={this.state.instagram}
                  onChange={this.changeCharityInfo.bind(this, 'instagram')}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                </div>
                <div style={{flex: 1, padding: '6px'}}>
                  <p style={styles.header}>
                    Website
                  </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  onChange={this.changeCharityInfo.bind(this, 'website')}
                  defaultValue={this.state.website}
                  hintText={'Website'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location3'
                  style={styles.whiteTextfield}/>
                <p style={styles.header}>
                  Twitter
                </p>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'@Username'}
                  onChange={this.changeCharityInfo.bind(this, 'twitter')}
                  defaultValue={this.state.twitter}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location2'
                  style={styles.whiteTextfield}/>
                </div>
              </div>

              <Dialog
                modal={false}
                open={this.state.error ? true : false}
                onRequestClose={this.handleClose}>
                <b>Error:</b>
                <br/>
                {this.state.error ? this.state.error.toString() :null}
                <br/><br/>
                Try again, or contact us at help@whosin.io
              </Dialog>
            </div>
          }
        </div>
      </div>
    )
  }
}
