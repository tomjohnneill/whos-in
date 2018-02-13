import React from 'react';
import Home from './components/home.jsx';
import Navigation from './components/navigation.jsx';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#E55749',
    primary2Color:  '#FF9800',
    accent1Color: '#0068B2',
  },
  appBar: {
    height: 50,
  },
  datePicker: {
    headerColor: '#0068B2',
  },
  timePicker: {
    headerColor: '#0068B2',
  },
  fontFamily: 'Open Sans'
});



const App = ( { children } ) => (

      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <Navigation />
            { children }

          </div>
        </MuiThemeProvider>
      </div>


)

export default App
