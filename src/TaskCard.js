import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { CardActions, IconButton, Chip } from '@material-ui/core';
import { DragDropContainer } from 'react-drag-drop-container';
import TaskDialog from './TaskDialog';
import toMaterialStyle from 'material-color-hash';

const styles = theme => ({
  card: {
    width: 150,
    height: 130,
  },
  cardcontent: {
    height: 50,
  },
  icon: {
    fontSize: 'small',
  },
  button: {
    width: 'auto',
    height: 'auto',
  }
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
    let chipColor = toMaterialStyle(task.user, 200);
    return(
      <DragDropContainer targetKey={task.story_id} dragData={task}>
        <Card className={classes.card}>
          <CardContent className={classes.cardcontent}>
            <Typography variant="caption">
              <div>{task.text}</div>
            </Typography>
          </CardContent>
          <CardActions>
            <Chip label={task.user} style={chipColor} />
            <IconButton aria-label="Edit" onClick={this.handleEdit} className={classes.button}>
              <EditIcon className={classes.icon}/>
            </IconButton>
            <IconButton aria-label="Delete" onClick={() => onDelete(task.id)} className={classes.button}>
              <DeleteIcon className={classes.icon}/>
            </IconButton>
          </CardActions>
        </Card>
        <TaskDialog open={this.state.open} onClose={this.handleClose} task={task} story_id={task.story_id}/>
      </DragDropContainer>
    );
  }
}

export default withStyles(styles)(TaskCard);
