import React, { Component, Fragment } from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import StoryDialog from './StoryDialog';
import StoryList from '../containers/StoryList';
import { CssBaseline, Typography } from '@material-ui/core';
import yellow from '@material-ui/core/colors/yellow';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: yellow,
  }
})

class App extends Component {

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Fragment>
          <CssBaseline />
          <Typography variant="display1" gutterBottom>Scraty</Typography>
          <Typography variant="headline" gutterBottom>Scrum for Craties</Typography>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <StoryList />
              <Button variant="fab" color="primary" aria-label="Add" onClick={this.handleClickOpen} className={classes.button}>
                <AddIcon />
              </Button>
              <StoryDialog open={this.state.open} onClose={this.handleClose} />
            </Grid>
          </Grid>
        </Fragment>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
