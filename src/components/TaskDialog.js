import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { HTTP_BACKEND_URL } from '../config/config';
import { updateTask } from '../actions/task';
import { connect } from 'react-redux';

class TaskDialog extends Component {

  handleClose = () => {
    this.props.onClose()
  };

  handleSubmit = (event) => {
    event.preventDefault();   // avoid reload
    const data = new FormData(event.target);
    let url = HTTP_BACKEND_URL + '/api/tasks/';
    if (this.props.task) {
      // update
      url += this.props.task.id
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        "text": data.get('task-text'),
        "user": data.get('task-user'),
        "story_id": this.props.story_id,
      }),
    }).then(response => response.json())
    .then(data => {
      this.props.dispatch(updateTask(data.data));
      this.handleClose();
    });
  };

  render() {
    const { classes, onClose, onClick, task, story_id, dispatch, ...other } = this.props;
    return (
      <Dialog onClose={this.handleClose} {...other}>
        <DialogTitle>Task</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <TextField
            autoFocus
            defaultValue={task ? task.text : ''}
            margin="normal"
            name="task-text"
            label="Description"
            placeholder="Enter what needs to be done."
            multiline
            fullWidth
            />
            <TextField
            autoFocus
            defaultValue={task ? task.user : ''}
            margin="normal"
            name="task-user"
            label="User"
            placeholder="The user assigned to this task"
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

TaskDialog.propTypes = {
  classes: PropTypes.object,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  task: PropTypes.object,
  story_id: PropTypes.string.isRequired,
};

export default connect()(TaskDialog)
