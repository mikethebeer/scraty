import React, { Component, Fragment } from 'react'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import StoryDialog from './StoryDialog'
import StoryList from '../containers/StoryList'
import { Typography } from '@material-ui/core'
import 'typeface-permanent-marker'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  title: {
    fontFamily: 'Permanent Marker',
  },
  subtitle: {
    fontFamily: 'Permanent Marker',
    color: "#5d99c6",
  }
})

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#f8f9f9',
    },
    secondary: {
      main: '#90caf9',
      light: '#c3fdff',
      dark: '#5d99c6',
    },
    primary: {
      main: '#e53935',
      light: '#ff6f60',
      dark: '#ab000d',
    },
  }
})

class App extends Component {

  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    return (
      <MuiThemeProvider theme={theme}>
        <Fragment>
          <Typography variant="display1" color="primary" className={classes.title} gutterBottom>Scraty</Typography>
          <Typography variant="headline" className={classes.subtitle} gutterBottom>Scrum for agile teams</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <StoryList />
              <Button variant="outlined" color="primary" aria-label="Add" onClick={this.handleClickOpen} className={classes.button}>
                <AddIcon />
              </Button>
              <StoryDialog open={this.state.open} onClose={this.handleClose} />
            </Grid>
          </Grid>
        </Fragment>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App)
