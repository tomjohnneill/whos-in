import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {changeImageAddress} from './desktopproject.jsx';
import LinearProgress from 'material-ui/LinearProgress';
import { Link } from 'react-router';

const styles = {
  button : {
    fontFamily: 'Permanent Marker',
    fontSize: '20px',
    lineHeight: '36px'
  }
}

export default class AllProjects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount(props) {
    fetch('https://api.worktools.io/api/Project/?api_token=05a797cd-8b31-4abe-b63b-adbf0952e2c7')
      .then(response => response.json())
      .then(data => this.setState({ projects: data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  }

  render() {
    return (
      <div>
        <div style={{position: 'sticky', top: '0px', display: 'flex', paddingLeft: 100, zIndex: 10, paddingRight: 100
          , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #DDDDDD'}}>
          <RaisedButton style={{marginRight: '20px', height: '36px'}} label='Dates' secondary={true} labelStyle={styles.button}/>
          <RaisedButton  style={{marginRight: '20px', height: '36px'}} label='Type' secondary={true} labelStyle={styles.button}/>
          <TextField/>
        </div>
        <div>
          <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', paddingLeft: '100px'}}>
            All Projects</h1>
          {this.state.loading ?
            <div>
              Loading...
            </div>
            :

            <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px',
            textAlign: 'left'}}>
              {this.state.projects.map((project) => (
                <Link to={`/projects/${project['Name']}/${project._id}`}>
                  <div style={{width: '230px', height: '250px', margin: 20}}>
                    <img src={changeImageAddress(project['Featured Image'], '250xauto')}
                      style={{width: '100%', height: '180px',objectFit: 'cover', borderRadius: '4px'}}/>
                    <span style={{display: 'inline-block',fontWeight: 100, textTransform: 'uppercase'}}>
                      {project.Location ? project.Location.replace(/(([^\s]+\s\s*){3})(.*)/,"$1…") : null}
                    </span>
                    <LinearProgress
                      min={0}
                      mode={'determinate'}
                      max={10}
                      value={Math.random()*10}
                      color={'#65A1e7'}
                      style={{marginTop: 6, marginBottom: 6}}
                      />
                    <span style={{fontWeight: 600, display: 'inline-block'}}>
                      {project.Name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          }
        </div>
      </div>
    )
  }
}
