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
    margin: '5px 5px 5px 5px',
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
  },
  droptarget: {
    height: '100%',
  },
});

class TaskGrid extends Component {
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
    const { classes, tasks, onDelete } = this.props;
    const storyTasks = []
    tasks.map(task => {
      let chipColor = toMaterialStyle(task.user, 200);
      return storyTasks.push(
        <DragDropContainer key={task.id} targetKey={task.story_id} dragData={task}>
          <Card className={classes.card}>
            <CardContent className={classes.cardcontent}>
              <Typography variant="caption">
                <div>{task.text}</div>
              </Typography>
            </CardContent>
            <CardActions>
              <Chip label={task.user} style={chipColor} />
              <IconButton aria-label="Edit" onClick={this.handleClickOpen} className={classes.button}>
                <EditIcon className={classes.icon}/>
              </IconButton>
              <IconButton aria-label="Delete" onClick={() => onDelete(task)} className={classes.button}>
                <DeleteIcon className={classes.icon}/>
              </IconButton>
            </CardActions>
          </Card>
          <TaskDialog open={this.state.open} onClose={this.handleClose} task={task} story_id={task.story_id}/>
        </DragDropContainer>
      )
    })
    return(
      <div className={classes.droptarget}>
        {storyTasks}
      </div>
    );
  }
}

export default withStyles(styles)(TaskGrid);
