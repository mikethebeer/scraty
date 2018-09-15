import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { CardActions, IconButton } from '@material-ui/core';
import { DragDropContainer } from 'react-drag-drop-container';
import TaskDialog from './TaskDialog';


const styles = theme => ({
  card: {
    display: 'flex',
  },
});

class TaskCard extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleEdit = () => {
    this.setState({open: true});
    this.props.onEdit();
  }

  render() {
    const { classes, task, onDelete } = this.props;
    return(
      <DragDropContainer targetKey={task.story_id} dragData={task}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="caption">
              <div>{task.text}</div>
              <div>{task.user}</div>
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton aria-label="Edit" onClick={this.handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="Delete" onClick={() => onDelete(task.id)}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
        <TaskDialog open={this.state.open} onClose={this.handleClose} task={task} story_id={task.story_id}/>
      </DragDropContainer>
    );
  }
}

export default withStyles(styles)(TaskCard);
