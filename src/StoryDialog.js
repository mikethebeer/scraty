import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { HTTP_BACKEND_URL } from './config';

class StoryDialog extends Component {

  state = {
    story: '',
  }

  handleClose = () => {
    this.props.onClose()
  };

  handleSubmit = (event) => {
    // event.preventDefault();   // avoid reload
    const data = new FormData(event.target);
    let url = HTTP_BACKEND_URL + '/api/stories/';
    if (this.state.story.id) {
      // update
      url += this.state.story.id
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        "text": data.get('story-title'),
        "link": data.get('story-link')
      }),
    }).then(response => console.log(response));
    this.setState({ open: false });
  };

  render() {
    const { classes, onClose, onClick, id, ...other } = this.props;
    if (id) {
      // update
      fetch(HTTP_BACKEND_URL + '/api/stories/' + id)
        .then(response => response.json())
        .then(data => this.setState({story: data.story}))
    }
    return (
      <Dialog aria-labelledby="story-title" onClose={this.handleClose} {...other}>
        <DialogTitle id="story-title">Story</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <TextField
            autoFocus
            defaultValue={this.state.story.text}
            margin="normal"
            name="story-title"
            label="Story Title"
            placeholder="Enter story title"
            multiline
            fullWidth
            />
            <TextField
            autoFocus
            defaultValue={this.state.story.link}
            margin="normal"
            name="story-link"
            label="Link"
            placeholder="Enter link to story"
            fullWidth
            />
            <Button type="submit" color="primary">
            Save
            </Button>
            <Button onClick={this.handleClose} color="secondary">
            Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

StoryDialog.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  id: PropTypes.string,
};

export default StoryDialog;
