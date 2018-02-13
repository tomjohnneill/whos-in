import React , {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';


import Dropzone from 'react-dropzone';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';



export default class CustomForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {loading: true, stepIndex: 0, response: {}, details: []}
  }

  fetchOption = (id, index) => {
    fetch('https://api.worktools.io/api/Option/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Question=' + id)
    .then(response => response.json())
    .then(newData => {console.log(newData);
      var options = newData;
      const details = this.state.details
      details[index].options = newData
      this.setState({details: details})})
  }

  componentDidMount(props) {
    fetch('https://api.worktools.io/api/Question/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7&Project=7p4Q7ODB5vo7w')
    .then(response => response.json())
    .then(data => {this.setState({details: data});
      for (var i = 0; i < data.length; i++) {
        if (data[i].Type === 'multipleChoice' || data[i].Type === 'checkbox') {
          var questions = data
          console.log(i)
          var number = i
          this.fetchOption(data[i].id, i)
        }
      }
    }

    )
    .then(this.setState({loading: false}))

  }

  upload = (acceptedFiles, rejectedFiles) => {


  }

  handleNext = () => {
    const stepIndex = this.state.stepIndex;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });

    var body = {
      'Question': this.state.response.id,
      'Answer': this.state.response.value,
      'Project': '7p4Q7ODB5vo7w',
      'User': 'DWERM1MqeKpM8'
    }
    if (localStorage.getItem(this.state.response.id)) {
      fetch(`https://api.worktools.io/api/Response/?api_token=9915e23e-d908-4d29-badf-d51d76cfb9bb&Question=${this.state.response.id}&User=${'DWERM1MqeKpM8'}`)
      .then(response => response.json())
      .then(data => {
        fetch(`https://api.worktools.io/api/Response/${data[0].id}/?api_token=9915e23e-d908-4d29-badf-d51d76cfb9bb`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'PATCH',
          body: JSON.stringify(body)
        })
        .catch(error => this.setState({error: error}))
      })
    } else {
      fetch('https://api.worktools.io/api/Response/?api_token=9915e23e-d908-4d29-badf-d51d76cfb9bb', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
      })
      .catch(error => this.setState({error: error}))
    }
    localStorage.setItem(this.state.response.id, this.state.response.value)
  };

  handlePrev = () => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  renderStepActions(step) {
    const stepIndex = this.state.stepIndex;

    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label={stepIndex === this.state.details.length - 1 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }

  handleTextChange (id, e, newValue) {
    this.setState({response: {id: id, value: newValue}})

  }

  getCoords(id, lat, lng, desc){
    console.log(lat, lng);
    console.log(desc)
    this.setState({response: {id: id, value:{place: desc, location: {type: "Point", coordinates : [lng, lat]}}}})
  }

  handleCheckChange (id, option, e, checked) {
    var options = this.state.response.value ? this.state.response.value : []

    if (checked) {
      options.push(option)
    } else {
      options.splice(options.indexOf(option), 1)
    }
    console.log(options)
    this.setState({response: {id: id, value: options}})
  }

  renderStep = (item, step) => {
    var allResponses, userResponse
    if (localStorage.getItem(item.id)) {
      userResponse = localStorage.getItem(item.id)
    } else {
      userResponse = {}
    }


    if (item.Type === 'text') {

      return (
        <Step>
          <StepLabel>{item.question}</StepLabel>
          <StepContent>
            <TextField onChange={this.handleTextChange.bind(this, item._id)}

              hintText={item.question}/>
            {this.renderStepActions(step)}
          </StepContent>
        </Step>

      )
    } else if (item.Type === 'checkbox') {
      var checkedOption = userResponse ? userResponse : null
      return (
        <Step>
          <StepLabel>{item.Question}</StepLabel>
          <StepContent>
            {item.options ? item.options.map((option) => (
              <Checkbox onCheck={this.handleCheckChange.bind(this, item._id, option)}
                  label={option.Text}
                  defaultChecked={checkedOption ? checkedOption.includes(option) : false}/>
              )) : null}
            {this.renderStepActions(step)}
          </StepContent>
        </Step>
      )
    } else if (item.Type === 'multipleChoice') {
      var chosenOption = userResponse ? userResponse : null
      return (
        <Step>
          <StepLabel>{item.Question}</StepLabel>
          <StepContent>
            <RadioButtonGroup
              defaultSelected={chosenOption}
              onChange={this.handleTextChange.bind(this, item._id)}
              name={item.question}>
            {item.options ? item.options.map((option) => (
              <RadioButton label={option.Text} value={option.Text}/>
            )) :null}
            </RadioButtonGroup>
            {this.renderStepActions(step)}
          </StepContent>
        </Step>
      )
    } else if (item.Type === 'location') {
      if (userResponse && userResponse.response && userResponse.response.place) {
        return (
          <Step>
            <StepLabel>{item.Question}</StepLabel>
            <StepContent>
              Put stuff in here
              {this.renderStepActions(step)}
            </StepContent>
          </Step>
        )
      } else {
        return (
          <Step>
            <StepLabel>{item.Question}</StepLabel>
            <StepContent>
              Put things in here
              {this.renderStepActions(step)}
            </StepContent>
          </Step>
        )
      }
    } else if (item.Type === 'image') {
      return (
        <Step>
          <StepLabel>{item.Question}</StepLabel>
          <StepContent>
            <Dropzone key={'photos'} onDrop={this.upload}  style={{}}>
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
            {this.renderStepActions(step)}
          </StepContent>
        </Step>
      )
    }
  }

  render() {
    console.log('Form details:')
    console.log(this.state)
    return (
      <div>
        {this.state.loading ?

          <div style={{position: 'relative'}}>

            <div style={{width: '100%', height: '400px', zIndex: 10, backgroundColor: 'rgba(238,238,238,0.4)'
              , position:'absolute', top: '0px', verticalAlign: 'bottom', textAlign: 'center',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>


              <div style={{display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(238,238,238,0.4)'}}>


                <div style={{width: '60%'}}>
                  <p style={{marginBottom: '16px'}}>Once you've joined the pledge, we might need a bit more info </p>
              <RaisedButton

                 primary={true} fullWidth={true} label="Join Now"  />

                </div>
                </div>
              </div>
            </div>
               :

          <div style={{textAlign: 'left'}}>
            <Subheader>
              Add your input
            </Subheader>

        <Stepper activeStep={this.state.stepIndex} orientation="vertical" >
          {this.state.details.map((item) => (
            this.renderStep(item, this.state.details.indexOf(item))
          ))}
        </Stepper>
        </div>

    }
    </div>
  )
  }
}
