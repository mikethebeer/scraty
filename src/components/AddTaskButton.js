import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TaskDialog from './TaskDialog';


class AddTaskButton extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const { id, ...other } = this.props;

    return(
      <div>
        <IconButton aria-label="AddTask" onClick={this.handleClickOpen} {...other}>
          <AddIcon />
        </IconButton>
        <TaskDialog open={this.state.open} onClose={this.handleClose} story_id={id}/>
      </div>
    );
  }
}

AddTaskButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AddTaskButton;
