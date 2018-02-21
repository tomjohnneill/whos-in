import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';
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

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

class StoryForm extends React.Component {
  constructor(props) {
    super(props);
    var story = JSON.parse(localStorage.getItem('story'))
    if (story) {
      this.state = {
        title: story.title,
        story: story.story
      }
    } else {
      this.state = {
        title: null,
        story: null
      }
    }
  }

  handleNext = (e) => {
    e.preventDefault()

    var story = {title: this.state.title, story: this.state.story}
    var storyString = JSON.stringify(story)
    localStorage.setItem('story', storyString)
    browserHistory.push('/create-project/4')
  }


  handlePrevious = (e) => {
    e.preventDefault()
    browserHistory.push('/create-project/2')
  }

  handleSetTitle = (e) => {
    this.setState({title: e.target.value})
  }

  handleSetStory = (e) => {
    this.setState({story: e.target.value})
  }

  render() {
    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <p style={{marginTop: '0px',fontFamily: 'Permanent Marker', fontSize: '32px', textAlign: 'left'}}>
          Tell your story</p>
        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <p style={styles.header}>What is the title of your project?</p>
          <TextField fullWidth={true}
            inputStyle={{borderRadius: '6px', border: '1px solid #858987',
              paddingLeft: '12px',  boxSizing: 'border-box'}}
            underlineShow={false}
            hintText={'Project Title'}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            key='location'
            value={this.state.title}
            onChange={this.handleSetTitle}
            style={styles.textfield}/>
        </div>

        <div style={{width: '100%',  paddingBottom: '32px', boxSizing: 'border-box'}}>
          <p style={styles.header}>
            Why are you running this project?
          </p>
          <TextField fullWidth={true}
            inputStyle={{borderRadius: '6px', border: '1px solid #858987',
              paddingLeft: '12px',  boxSizing: 'border-box'}}
            underlineShow={false}
            hintText={'Tell your story'}
            multiLine={true}
            value={this.state.story}
            onChange={this.handleSetStory}
            rows={5}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            key='date'/>
        </div>
        <RaisedButton label='NEXT' backgroundColor='#E55749'
          onTouchTap={this.handleNext}
          labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
        <div style={{width: '16px', display: 'inline-block'}}/>
        <RaisedButton label='Previous' backgroundColor='#C5C8C7'
            onTouchTap={this.handlePrevious}
            labelStyle={{ color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}/>
      </div>
    )
  }
}

export default class Story extends React.Component{


  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{width: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <StoryForm/>
            </div>
            <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
              <img src={changeImageAddress('https://s3.eu-west-2.amazonaws.com/idle-photos/foodbank.jpg', '1000xauto')}
                style={{width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: '16px'}}>
            <StoryForm/>
          </div>
        </MediaQuery>
      </div>
    )
  }
}
