import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import {Link, browserHistory} from 'react-router'
import DatePicker from 'material-ui/DatePicker';
import Dropzone from 'react-dropzone';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Loadable from 'react-loadable';
import Chip from 'material-ui/Chip';
import TimePicker from 'material-ui/TimePicker';



const Loading = () => (
  <div>
    Hi
  </div>
)


const LoadableComponent = Loadable({
  loader: () => import('./texteditor.jsx'),
  loading: Loading
});

const styles = {
  box: {
    backgroundColor: grey200,
    marginTop: '10px',
    marginBottom: '10px',
    padding: '10px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '800px'
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
  flexWrapTitle: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '10px',
    padding: '5px'
  },
  bigTitle: {
    width: '50%',
    fontStyle: 'italic',
    color: grey500
  },
  bigWrapTitle: {
    width: '50%',
    fontStyle: 'italic',
    minWidth: '250px',
    color: grey500,
    boxSizing: 'border-box'
  },
  currentCommitments: {
    textAlign: 'center',

  },
  targetCommitments: {
    textAlign: 'center'
  },
  explanation: {
    fontSize: '8pt',
    color: grey500
  }

}

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

export default class NewProject extends React.Component{
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {open: false, renderMessenger: false, tags: [], tagText: '', loading: true}
  }




componentDidMount(props) {
    window.addEventListener('scroll', this.handleScroll);
    this.setState({ loading: true });

    fetch('https://api.worktools.io/api/Project/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Name=' + this.props.params.Name)
      .then(response => response.json())
      .then(data => this.setState({ project: data[0] ? data[0] : {}, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
}

componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }


  handleScroll = () => {
    var scrollHeight = document.documentElement.scrollHeight
      var pageYOffset = window.pageYOffset
      var innerHeight = window.innerHeight
      console.log(this.state.renderMessenger)
      console.log(scrollHeight - innerHeight - pageYOffset)
      if (scrollHeight - innerHeight - pageYOffset < 150 && !this.state.renderMessenger) {
        this.setState({renderMessenger :true})
      }
  }

generateSlug = (event) => {
  var title = event.target.value
  this.setState({Name: title})
  console.log(this.state)
}

changeContent = (event) => {
  var content = event.target.value
  this.setState({content: content})
}

handleDuration = (event, index, obj) => {
  var duration = obj
  this.setState({duration: duration})
}



handleTarget = (event) => {
  var target = event.target.value
  this.setState({target: target})
}

handleImpact = (event) => {
  var impact = event.target.value
  this.setState({impact: impact})
}

handleSummary = (event) => {
  var summary = event.target.value
  this.setState({summary: summary})
}

handleDeadline = (event, date) => {
  var deadline = date.toISOString()
  console.log(date)
  this.setState({deadline: date})
}

handleEventDate = (event, date) => {
  var deadline = date.toISOString()
  console.log(date)
  this.setState({eventDate: date})
}


handleEventTime = (event, date) => {

  console.log(date)
  this.setState({eventTime: date})

}



submitPledge = (event) => {
  var title = this.state.Name ? this.state.Name: this.state.project.Name
  var target = this.state.target ? this.state.target: this.state.project.target
  var deadline = this.state.deadline ? this.state.deadline.toISOString() : this.state.project.deadline
  var description = this.state.description ? this.state.description : this.state.project.Description
  var summary = this.state.summary ? this.state.summary: this.state.project.summary ? this.state.project.summary : ''
  var facebookURL = this.state.facebookURL ? this.state.facebookURL : this.state.project.facebookURL
  var tags = this.state.tags ? this.state.tags : this.state.project.tags

  var eventDate = this.state.eventDate ? this.state.eventDate : this.state.project.eventDate
  var eventTime = this.state.eventTime ? this.state.eventTime : this.state.project.eventTime
  var location = this.state.location ? this.state.location : this.state.project.location

  var eventDate
  if (this.state.hours) {
    let tempDate = this.state.eventDate
    tempDate.setHours(this.state.hours)
    tempDate.setMinutes(this.state.minutes)
    console.log(tempDate)
    eventDate = tempDate
  } else {
    let tempDate = this.state.eventDate
    eventDate = tempDate
  }


    var body = {
      'Name' : title,
      'Description' : description,
      'Summary': summary,
      'FacebookURL' : facebookURL ? facebookURL : null,
      'Target People': target ? target : null ,
      'Start Date': eventDate ? eventDate : null,
      'Featured Image' : this.state.imageUrl ? this.state.imageUrl : null
    }
    console.log(body)

    if (this.props.params._id) {
      fetch('https://api.worktools.io/api/Project/' + this.props.params._id + '/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => this.setState({ error, loading: false }));
    } else {
      fetch('https://api.worktools.io/api/Project/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => this.setState({ error, loading: false }));
    }

}

getCoords = (lat, lng, desc) => {
  console.log(lat, lng);
  console.log(desc)
  this.setState({location:{place: desc, location: {type: "Point", coordinates : [lng, lat]}}})
}

getTags() {
  let project = this.state.project;

  if ( project && project.tags ) {
    return project.tags.join( ', ' );
  }
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

/*
upload(acceptedFiles, rejectedFiles){
  var metaContext = {pledgeId: this.props.pledge._id};
  console.log(metaContext)
  this.setState({loader: true})
  var uploader = new Slingshot.Upload("UsersAvatar", metaContext);
  uploader.send(acceptedFiles[0], function (error, downloadUrl) { // you can use refs if you like
    if (error) {
      // Log service detailed response
      //console.error('Error uploading', uploader.xhr.response);
      Bert.alert(error, 'danger'); // you may want to fancy this up when you're ready instead of a popup.
    }
    else {
    Meteor.call('addPictureToPledge', downloadUrl, this.props.pledge._id)
    // you will need this in the event the user hit the update button because it will remove the avatar url
    this.setState({loader: false})
  }
  }.bind(this));
}
*/


handleSubmit( event ) {
  event.preventDefault();
}

handleDelete = (e) => {
  e.preventDefault()
  this.setState({open: true})
}

handleClose = (e) => {
  e.preventDefault()
  this.setState({open: false})
}

deletePledge = (e) => {
  e.preventDefault()


}

handleFacebookURL = (e, newValue) => {
  this.setState({facebookURL: newValue})
}



handleOnChange = (string) => {
  this.setState({description: string})
}

handleTagSubmit = (e) => {
  e.preventDefault()
  if (e.key == ',' || e.key == 'Enter') {
    this.setState({tags: this.state.tags.concat([this.state.tagText])})
  this.setState({tagText: ''})
}
else {
  var tagText = this.state.tagText
  this.setState({tagText: tagText + e.key})
}

}

handleTagType = (event, newValue) => {
  this.setState({tagText: newValue})
}

handleRemoveTag (tag, e)  {
  var i = this.state.tags.indexOf(tag)
  var newArray = this.state.tags.splice(i, 1)
  var newnewArray = this.state.tags.filter(function(i) {
      return i != tag
    })
  this.setState({
    tags: newnewArray
  })

}

render() {

  console.log(this.state)


  return(
    <div>
      {!this.state.loading ?

  <div style={{display: 'flex', justifyContent: 'center', backgroundColor: grey200}}>
      <div style={styles.box}>
        <Card>
          <CardHeader
              title="My project application"
              subtitle={"me"}
              avatar={"picture"}
            />
          <CardMedia
            overlay={
              <CardTitle title={<TextField name='title' multiLine={true}
                defaultValue={this.state.Name ? this.state.Name : this.state.project.Name}
                onChange={this.generateSlug}
                style={{color: 'white'}}
                hintText='Enter pledge title'
                textareaStyle={{color: 'white'}}
                inputStyle={{color: 'white'}}/>
              }


           />}

          >
          <img src={this.state.imageUrl ? changeImageAddress(this.state.imageUrl, 'autox500') : this.state.project['Featured Image'] === undefined ? '/images/white.png' :  this.state.project['Featured Image']}/>
          </CardMedia>
          <CardTitle children={
              <div>
                <div style={styles.cardTitle}>
                  <div style={styles.bigTitle}>
                    Target:
                  <div style={styles.smallTitle}>
                    <TextField name='target' style={{width: '50%'}}
                      defaultValue={this.state.target ? this.state.target: this.state.project.target}
                      onChange={this.handleTarget}/> people
                  </div>
                  </div>
                  <div style={styles.bigTitle}>
                    Deadline:
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                         <DatePicker value={this.state.deadline ? this.state.deadline : this.state.project.deadline} onChange={this.handleDeadline} style={{width: 'auto'}} hintText="Deadline" textFieldStyle={{width: 'auto'}}/>
                    </div>
                  </div>
                </div>
              </div>
            }/>
        </Card>
          <Card style={{marginTop: '20px'}}>

            <CardTitle
              title='Event details'
              children={
                <div>
                  <div style={styles.explanation}>
                    If your pledge has a physical event, set the time, date and location here. This section is optional.
                  </div>
                  <div style={styles.flexWrapTitle}>
                    <div style={styles.bigWrapTitle}>
                      Event Date:
                    <div style={styles.smallTitle}>
                      <DatePicker value={this.state.eventDate ? this.state.eventDate : this.state.project.eventDate}
                        onChange={this.handleEventDate} style={{width: 'auto'}}



                         hintText="Event Date" textFieldStyle={{width: 'auto'}}/>
                      <TimePicker value={this.state.eventTime ? this.state.eventTime : this.state.project.eventTime}
                          onChange={this.handleEventTime} style={{width: 'auto'}} hintText="Event Time" textFieldStyle={{width: 'auto'}}/>
                    </div>
                    </div>
                    <div style={styles.bigWrapTitle}>
                      <div>
                      Location:
                      </div>
                      <div style={{ alignItems: 'center', justifyContent: 'center', width: '100%'}}>

                      </div>
                    </div>
                  </div>
                </div>
              }/>
          </Card>
            <Card style={{marginTop: '20px'}}>

            <CardTitle
              title = "Pledge blurb"
              children={
            <div>
              <div style={styles.explanation}>
                Give people an idea of what you’re doing. Skip “Help me” and focus on your plan.
              </div>
              <TextField name='summary'
                fullWidth={true}
                multiLine={true}
                hintText='An overall summary'
                defaultValue={this.state.summary ? this.state.summary: this.state.project.summary }
                onChange={this.handleSummary}/>

            </div>
          }/>
      </Card>

        <Card style={{marginTop: '20px'}}>
          <CardTitle style={{marginBottom: '10px'}} title='Pledge description'
            children={
              <div>
          <div style={styles.explanation}>
            Use your pledge description to share more about what you’re finding people to do and how you plan to pull it off. It’s up to you to make the case for your pledge.
          </div>
          <div style={{height: '16px'}}/>
          <LoadableComponent styles={{fontFamily: 'Open Sans', padding: '10px', marginTop: '10px'}}
            returnableValue={this.state.project.returnableValue}
            description={this.state.project.description}
            onChange={this.handleOnChange}/>
          </div>
          }/>
      </Card>

      <Card style={{marginTop: '20px'}}>
        <CardTitle style={{marginBottom: '10px'}} title='Add social media accounts'
          children={
            <div>
        <div style={styles.explanation}>
          Add your social media accounts and we'll give people the option to like your Facebook page just under the story. Add the whole url, not the just the account name.
        </div>
        <div style={{height: '16px'}}/>
          <TextField hintText='Facebook Page URL' value={this.state.facebookURL ? this.state.facebookURL: this.state.project.facebookURL} onChange={this.handleFacebookURL}/>
        </div>
        }/>
    </Card>

    <Card style={{marginTop: '20px'}}>
      <CardTitle style={{marginBottom: '10px'}} title='Add subject tags'
        children={
          <div>
        <div style={styles.explanation}>
          Add some subject tags to this pledge so we can show it to people who might be interested. Type each tag separated by a comma, or hit Enter after each one.
        </div>
        <div style={{marginTop: '10px'}}>
          {this.state.tags ? this.state.tags.map(
            (tag) => (
              <div style={{float: 'left', marginBottom: '5px'}}>
              <Chip

                onRequestDelete={this.handleRemoveTag.bind(this, tag)}
                >
                {tag}
              </Chip>
              </div>
            )
          ) : null}
          </div>
          <div >
          <TextField
            hintText='Type each tag separated by a comma'
            fullWidth={true}
            multiLine={true}
            onChange={this.handleTagType}
            onKeyPress={this.handleTagSubmit}
            value={this.state.tagText}

      /></div>
    </div>}
    />
</Card>


      <Card style={{marginTop: '20px'}}>

          />
        <CardTitle title='Add a cover photo'
          children={
            <div style={styles.explanation}>
              This is the first thing that people will see when they come across your pledge, both on Who's In and on social media. Choose an image that’s crisp and text-free.
            </div>
          }
        />

        <div style={{padding: '16px'}}>
          <Dropzone key={'photos'} onDrop={this.upload.bind(this)}  style={{}}>
                {({ isDragActive, isDragReject }) => {
                  let styles = {
                    width: 'auto',
                    height: 100,
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: grey500,
                    borderStyle: 'dashed',
                    borderRadius: 5,
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
      </Card>
        <Card style={{marginTop: '20px'}}>
        <CardTitle title='Submit Application' children={
          <div style={styles.explanation}>
            Before your pledge appears on the front page of Who's In, we will get in contact with you to talk through your pledge, and work out how best we can work together to make it happen.
          </div>
          }/>


        <RaisedButton label='Submit Application'

          onTouchTap={this.submitPledge} secondary={true} fullWidth={true}/>
        <div style={{height: '20px'}}/>
        <FlatButton label='Delete Pledge' onTouchTap={this.handleDelete} fullWidth={true}/>
        </Card>
      </div>
      <Dialog

          actions={[
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deletePledge}
      />,
    ]}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        Are you sure you want to delete this pledge?
        </Dialog>

    </div>
      :
      <div/>
      }
    </div>
    );
  }

}
