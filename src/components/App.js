import React, { Component, Fragment } from 'react'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import StoryDialog from './StoryDialog'
import StoryList from '../containers/StoryList'
import { CssBaseline, Typography } from '@material-ui/core'
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
    color: '#fff',
  }
})

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    background: {
      default: '#303030',
    },
    secondary: {
      dark: '#8a1c1c',
      main: '#c62828',
      light: '#d15353',
    },
    primary: {
      dark: '#212121',
      main: '#303030',
      light: '#424242',
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
          <CssBaseline />
          <Typography variant="display1" color="secondary" className={classes.title} gutterBottom>Scraty</Typography>
          <Typography variant="headline" className={classes.subtitle} gutterBottom>Scrum for Craties</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <StoryList />
              <Button variant="fab" color="secondary" aria-label="Add" onClick={this.handleClickOpen} className={classes.button}>
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
