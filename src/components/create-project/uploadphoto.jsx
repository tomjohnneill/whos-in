import React from 'react';
import TextField from 'material-ui/TextField';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import {  browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import CircularProgress from 'material-ui/CircularProgress';
import MediaQuery from 'react-responsive';
import {Cross} from '../icons.jsx'
import IconButton from 'material-ui/IconButton';

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

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

export default class UploadPhoto extends React.Component{
  constructor(props) {
    super(props);
    this.state = {uploadComplete: false, uploading: false}
  }

  handleNext = (e) => {
    e.preventDefault()
    if (this.state.imageUrl) {
      localStorage.setItem('coverPhoto', this.state.imageUrl)
    }

    browserHistory.push('/create-project/summary/1')
  }

  handlePrevious = (e) => {
    e.preventDefault()
    browserHistory.push('/create-project/2')
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)
    this.setState({uploading: true, uploadComplete: false})
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
                this.setState({uploadComplete: true, uploading: false})
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);

      }.bind(this))
      .catch(error => this.setState({ error }));

  }

  handleRemovePicture = () => {
    this.setState({imageUrl: null})
    localStorage.removeItem('coverPhoto')
  }

  render() {
    console.log(this.state)
    var imageUrl
     if(this.state.imageUrl) {
       imageUrl = this.state.imageUrl
     } else if (localStorage.getItem('coverPhoto') === 'undefined') {
       imageUrl = null
     } else {
       imageUrl = localStorage.getItem('coverPhoto')
     }
     console.log(imageUrl)

    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{width: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div className='form' style={{textAlign: 'left', width: '100%'}}>
                <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
                  Upload a cover photo</p>
                <div style={{width: '100%', paddingBottom: '40px',
                  paddingRight: '50px', boxSizing: 'border-box'}}>
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
                <RaisedButton label='NEXT' backgroundColor='#E55749'
                  onTouchTap={this.handleNext}
                  labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
                <div style={{display: 'inline-block', width: '16px'}}/>
                  <RaisedButton label='Previous' backgroundColor='#C5C8C7'
                      onTouchTap={this.handlePrevious}
                      labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
              </div>
            </div>
            <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
              {this.state.uploading ?
              <div style={{height: '70vh', width: '100%', display: 'flex',
                alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress size={80} thickness={5} />
              </div>
              :
                localStorage.getItem('coverPhoto') && !this.state.uploadComplete ?
                <div style={{position: 'relative'}}>
                  <img src={imageUrl}
                  style={{position: 'relative', width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
                <IconButton
                  style={{padding: 0, position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}
                  onTouchTap={this.handleRemovePicture}
                  iconStyle={{position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}>
                  <Cross color={'rgb(182,48,43)'}/>
                </IconButton>
                </div>
                :
                this.state.uploadComplete  ?
                <div style={{position: 'relative'}}>
                  <img src={imageUrl}
                  style={{position: 'relative', width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
                <IconButton
                  style={{padding: 0, position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}
                  onTouchTap={this.handleRemovePicture}
                  iconStyle={{position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}>
                  <Cross color={'rgb(182,48,43)'}/>
                </IconButton>
                </div>
                :
              <div style={{height: '70vh', width: '100%', backgroundColor: '#f5f5f5', display: 'flex',
                alignItems: 'center', justifyContent: 'center'}}>
                Your image will appear here
              </div>
            }

            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>

          <div style={{width: '100%',padding: '16px', display: 'flex', boxSizing: 'border-box'
            , justifyContent: 'center'}} className='basics-container'>
            <div className='form' style={{textAlign: 'left', width: '100%'}}>
              <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
                Upload a cover photo</p>
              <div style={{width: '100%', paddingBottom: '16px',
               boxSizing: 'border-box'}}>
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
              <div style={{boxSizing: 'border-box', borderRadius: '6px', paddingBottom: '20px'}} className='basics-image'>
                {this.state.uploading ?
                <div style={{height: '70vh', width: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'}}>
                  <CircularProgress size={80} thickness={5} />
                </div>
                :
                  localStorage.getItem('coverPhoto') && !this.state.uploadComplete ?
                  <div style={{position: 'relative'}}>
                    <img src={imageUrl}
                      style={{position: 'relative', width: '100%', height: '200px',
                        objectFit: 'cover', borderRadius: '10px'}}/>
                      <IconButton
                        style={{padding: 0, position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}
                        onTouchTap={this.handleRemovePicture}
                        iconStyle={{position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}>
                        <Cross color={'rgb(182,48,43)'}/>
                      </IconButton>
                  </div>
                  :
                  this.state.uploadComplete  ?
                  <div style={{position: 'relative'}}>
                  <img src={imageUrl}
                    style={{position: 'relative', width: '100%', height: '200px',
                      objectFit: 'cover', borderRadius: '10px'}}/>
                    <IconButton
                      style={{padding: 0, position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}
                      onTouchTap={this.handleRemovePicture}
                      iconStyle={{position: 'absolute', top: 10, right: 10, height: 40, zIndex: 3}}>
                      <Cross color={'rgb(182,48,43)'}/>
                    </IconButton>
                  </div>
                  :
                <div style={{height: '200px', width: '100%', backgroundColor: '#f5f5f5', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'}}>
                  Your image will appear here
                </div>
              }

              </div>
              <RaisedButton label='NEXT' backgroundColor='#E55749'
                onTouchTap={this.handleNext}
                labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
              <div style={{display: 'inline-block', width: '16px'}}/>
                <RaisedButton label='Previous' backgroundColor='#C5C8C7'
                    onTouchTap={this.handlePrevious}
                    labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
            </div>
          </div>

        </MediaQuery>
      </div>
    )
  }
}
