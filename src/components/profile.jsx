import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import {Link, browserHistory} from 'react-router';

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, loading: true, slideIndex: 0}

  }

  componentDidMount(props) {
    var worktoolsToken = localStorage.getItem('worktoolsToken') ?
      localStorage.getItem('worktoolsToken') : '05a797cd-8b31-4abe-b63b-adbf0952e2c7'
    fetch('https://api.worktools.io/api/User/' + 'DWERM1MqeKpM8' + `/?api_token=${worktoolsToken}`)
      .then(response => response.json())
      .then(function(data) {
        var user = data[0]
        this.setState({user: user})
        return fetch(`https://api.worktools.io/api/Engagement/?api_token=${worktoolsToken}&Volunteer=` + 'DWERM1MqeKpM8');
      }.bind(this))
      .then(response => response.json())
      .then(data => this.setState({engagements: data, loading: false}))
      .catch(error => this.setState({error, loading: false}))

    fetch(`https://api.worktools.io/api/Review/?api_token=${worktoolsToken}&Reviewee=` +
            'DWERM1MqeKpM8')
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
            }
        }

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

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
          <div>
            <div style={{width: '100%', height: '250px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'white'}}>
              <div style={{width: '150px', height: '150px', backgroundColor: 'white', borderRadius: '50%'}}>
                <img style={{height: '100%', width: 'auto', borderRadius: '50%'}} src={this.state.user.Picture ? this.state.user.Picture : null}/>
                {this.state.user.Picture ?
                  null :
                  <Dropzone style={{marginTop: '-20px'}} key={'photos'} onDrop={this.upload.bind(this)}  style={{}}>
                        {({ isDragActive, isDragReject }) => {
                          let styles = {
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            borderWidth: 0,
                            borderStyle: 'dashed',
                            borderRadius: '50%',

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
                }

              </div>
              <div style={{fontWeight: 600, fontFamily: 'Open Sans', zIndex: 3, position: 'relative',
                fontSize: 'larger', marginTop: '12px', letterSpacing: '-0.2px'}}>
                {this.state.user.Name}
              </div>
              <div style={{marginTop: '6px', zIndex: 3, position: 'relative'}}>
                London
              </div>


            </div>

            <div style={{
                borderRadius: '50%',
                width: '100%',
                backgroundColor: 'white',
                height: '80px',
                marginBottom: '-40px',
                zIndex: 2,
                position: 'relative',
                marginTop:'-70px'
              }}/>
            <div style={{
                background: 'linear-gradient(to bottom right, rgba(255, 152, 0,0.5), rgba(255, 152, 0,1))',
                height: '400px',
                width: '100%',
                }}>


                <SwipeableViews
                  style={{paddingTop: '36px'}}
                  index={this.state.slideIndex}
                  onChangeIndex={this.handleChange}
                >
                <div>

                  <List style={{paddingLeft: '24px', paddingRight: '24px'}}>
                    {this.state.engagements.map((engagement) => (

                      <ListItem
                        onTouchTap = {this.handleListClick.bind(this, engagement)}
                        style={{backgroundColor: 'rgba(255,255,255,0.9)', textAlign: 'left', borderRadius: '6px', marginTop: '12px'}}
                        primaryText={engagement.Project}
                        secondaryText={engagement.Comments}
                        leftAvatar={<Avatar src={this.state.user.Picture} />}
                      />

                    ))}
                  </List>
                </div>
                <List style={{paddingLeft: '24px', paddingRight: '24px'}}>
                  {this.state.reviews.map((review) => (

                    <ListItem
                      onTouchTap = {this.handleListClick.bind(this, review)}
                      style={{backgroundColor: 'rgba(255,255,255,0.9)', textAlign: 'left', borderRadius: '6px', marginTop: '12px'}}
                      primaryText={review.Text}
                      secondaryText={review['Project Name']}
                      leftAvatar={<Avatar src={this.state.user.Picture} />}
                    />

                  ))}
                </List>
                <List style={{paddingLeft: '24px', paddingRight: '24px'}}>
                  {this.state.engagements.map((engagement) => (

                    <ListItem
                      onTouchTap = {this.handleListClick.bind(this, engagement)}
                      style={{backgroundColor: 'rgba(255,255,255,0.9)', textAlign: 'left', borderRadius: '6px', marginTop: '12px'}}
                      primaryText={engagement.Project}
                      secondaryText={engagement.Comments}
                      leftAvatar={<Avatar src={this.state.user.Picture} />}
                    />

                  ))}
                </List>

              </SwipeableViews>
                <div>

                </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
