import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import {Link, browserHistory} from 'react-router';
import {Spiral, Tick} from './icons.jsx'
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

const styles = {
  contactDetails : {
    fontSize: '18px',
    fontWeight: 'lighter',
    padding: '6px',
    textAlign: 'left'
  }
}

var worktoolsToken = localStorage.getItem('worktoolsToken') !== 'undefined' ? localStorage.getItem('worktoolsToken') :
  '05a797cd-8b31-4abe-b63b-adbf0952e2c7'

class PhotoUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)

    fetch('https://3ymyhum5sh.execute-api.eu-west-2.amazonaws.com/prod/getS3Url')
      .then(response => response.json())
      .then(function(data) {
        var stripped = data.substring(data.indexOf('amazonaws.com/') + 14, data.indexOf('?'))
        var imageUrl = 'https://d3kkowhate9mma.cloudfront.net/' + stripped


        console.log(changeImageAddress(imageUrl, '250xauto'))
        this.setState({imageUrl: imageUrl})
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                var body = {
                  'Picture': imageUrl
                }
                fetch(`https://api.worktools.io/api/User/${this.props.userId}/?api_token=${worktoolsToken}`, {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: 'PATCH',
                  body: JSON.stringify(body)
                })
                this.props.changeImage(imageUrl)
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

  }

  render() {
    console.log(this.props)


    return (
      <div>
        <Dropzone key={'photos'} onDrop={this.upload.bind(this)}  style={{}}>
              {({ isDragActive, isDragReject }) => {
                let styles = {
                  width: 'auto',
                  height: 100,
                  textAlign: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgb(133, 137, 135)',
                  borderRadius: 6,
                  color: grey500,

                }

                const acceptedStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#6c6',
                  backgroundColor: '#eee'
                }

                const rejectStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#c66',
                  backgroundColor: '#eee'
                }

                if (isDragActive) {
                  return (
                    <div style={acceptedStyles}>
                      File will be accepted
                    </div>
                  )
                }
                if (isDragReject) {
                  return (
                    <div style={rejectStyles}>
                      File will be rejected
                    </div>
                  )
                }
                // Default case
                return (
                  <div style={styles}>
                    Drag and drop (or click) to upload
                  </div>
                )
              }}
            </Dropzone>
      </div>
    )
  }
}

class RecentlySupported extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    fetch(`https://api.worktools.io/api/Engagement/?api_token=${this.props.worktoolsToken}&Volunteer=` + this.props.userId)
    .then(response => response.json())
    .then(data => this.setState({projects: data}))
  }

  render() {
    return (
      <div>
        <div style={{borderBottom: 'solid 1px #DDDDDD'}}>
          <div style={{width: '50%', textAlign: 'left', display: 'inline-block'}}>
            Recently Supported
          </div>
          <div style={{width: '50%', textAlign: 'right', display: 'inline-block'}}>
            Turn up rate: <b style={{fontFamily: 'Permanent Marker'}}>100%</b>
          </div>
        </div>
        {
          this.state.projects ?
          this.state.projects.map((project) => (
            <Link to={'/projects/' + project['Project Name'] +'/' + project.Project}>
              <div style={{display: 'flex', paddingLeft: '18px', textAlign: 'left',
                paddingBottom: '20px', borderBottom: '1px solid #DDDDDD', paddingTop: '20px'}}>

                <div style={{width: '250px'}}>
                  <Spiral style={{height: '58px'}}/>
                <div>
                  <b>{project['Charity Name']}</b> <br/>
                  {project['Project Name']}<br/>
                  Date
                </div>
                </div>
                <div style={{flex: 1}}>
                  <img style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    src={project['Project Photo']}/>
                </div>
              </div>
            </Link>
          )) :
          null
        }
      </div>
    )
  }
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, loading: true, slideIndex: 0}

  }

  componentDidMount(props) {
    var worktoolsToken = localStorage.getItem('worktoolsToken') ?
      localStorage.getItem('worktoolsToken') : '05a797cd-8b31-4abe-b63b-adbf0952e2c7'
    fetch('https://api.worktools.io/api/User/' + this.props.params._id + `/?api_token=${worktoolsToken}`)
      .then(response => response.json())
      .then(function(data) {
        var user = data[0]
        this.setState({user: user})
        return fetch(`https://api.worktools.io/api/Engagement/?api_token=${worktoolsToken}&Volunteer=` + this.props.params._id);
      }.bind(this))
      .then(response => response.json())
      .then(data => this.setState({engagements: data, loading: false}))
      .catch(error => this.setState({error, loading: false}))

    fetch(`https://api.worktools.io/api/Review/?api_token=${worktoolsToken}&Reviewee=` +
            this.props.params._id)
      .then(response => response.json())
      .then(data => this.setState({reviews: data}))
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleListClick(engagement, e) {
    browserHistory.push('/pages/projects/' + 'eng' + '/' + engagement.Project)
  }

  changeImage = (imageUrl) => {
    var user = this.state.user
    user['Picture'] = imageUrl
    this.setState({user: user})
  }


  render() {
    console.log(this.state)

    var worktoolsToken = localStorage.getItem('worktoolsToken') ?
      localStorage.getItem('worktoolsToken') : '05a797cd-8b31-4abe-b63b-adbf0952e2c7'

    return (
      <div className='block'>
        {this.state.loading ?
          <div>
            Loading ...
          </div>
          :
          this.state.error ?
          <div>
            We're really sorry, something didn't quite work
          </div>
          :
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{display: 'flex' , paddingLeft: '10px', paddingTop: '60px',
               width: '100%', paddingRight: '10px', maxWidth: '1100px'
                ,boxSizing: 'border-box'}}>
              <div>
                {this.state.user.Picture ?
                <img style={{height: '200px', width: '200px', objectFit: 'cover', borderRadius: '4px'}}
                  src={this.state.user.Picture ? this.state.user.Picture : null}/>
                :
                <PhotoUpload changeImage={this.chamgeImage} userId={this.props.params._id}/>
                }
                <div style={styles.contactDetails}>
                  Email address
                  <Tick style={{height: '24.8px', float: 'right'}}/>
                </div>
                <div style={styles.contactDetails}>
                  Phone Number
                  <Tick style={{height: '24.8px', float: 'right'}}/>
                </div>

                <div style={{paddingTop: '10px', paddingBottom: '10px', borderBottom: 'solid 1px #DDDDDD',
                  borderTop: 'solid 1px #DDDDDD', marginTop: '30px', paddingLeft: '6px', textAlign: 'left',
                fontSize: '18px'}}>
                  Connected Accounts
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
                    <FontIcon color={this.state.user.Facebook ? '#3b5998' : '#DDDDDD'}
                      className='fab fa-facebook fa-2x' style={{borderRadius: '50%',padding: '3px', height: '35px', width: '35px'}}/>
                    <FontIcon color={this.state.user.Linkedin ? '#0077b5' : '#DDDDDD'}
                      className='fab fa-linkedin fa-2x' style={{borderRadius: '50%',padding: '3px', height: '35px', width: '35px'}}/>
                    <FontIcon color={this.state.user.Twitter ? '#1DA1F2' : '#DDDDDD'}
                      className='fab fa-twitter fa-2x' style={{borderRadius: '50%',padding: '3px', height: '35px', width: '35px'}}/>
                    <FontIcon color={this.state.user.Messenger ? '#0084ff' : '#DDDDDD'}
                      className='fab fa-facebook-messenger fa-2x' style={{padding: '3px', height: '35px', width: '35px'}}/>
                  </div>
                </div>
              </div>
              <div style={{width: '400px', marginLeft: '50px'}}>
                <div style={{display: 'flex'}}>
                  <div style={{width: '50%', textAlign: 'left', fontFamily: 'Permanent Marker', fontSize: '24px'}}>
                    Hey, I'm {this.state.user.Name.replace(/ .*/,'')}
                  </div>
                  <div style={{width: '50%', textAlign: 'right', fontFamily: 'Permanent Marker', color: '#FF9800', fontSize: '24px'}}>
                    6 Reviews
                  </div>
                </div>
                <div style={{textAlign: 'left', marginTop: '6px'}}>
                  Germany, Berlin - Joined in 2014
                </div>
                <div style={{display: 'flex', alignItems: 'left', marginTop: '6px', marginBottom: '50px'}}>
                  <FlatButton label='Edit Profile' labelStyle={{padding: '10px', color: '#65A1e7', fontFamily: 'Permanent Marker',
                      fontSize: '20px'}}
                      icon={<FontIcon className="fas fa-pencil-alt" style={{color: '#65A1e7'}}/>}
                       />

                </div>
                <RecentlySupported worktoolsToken={worktoolsToken} userId={this.props.params._id}/>
              </div>
              <div style={{marginLeft: '50px', width: '400px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  Verified user <Tick color={'#3B9E74'} style={{height: '50px' , marginLeft: '10px'}}/>

                </div>
                <div style={{backgroundColor: '#DDDDDD', height: '40vh', width: '100%', marginTop: '105px'}}>
                  Other interesting titbits
                </div>
              </div>
            </div>

          </div>
        }
      </div>
    )
  }
}
