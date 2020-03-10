import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import { CardActions, IconButton, Chip } from '@material-ui/core'
import { DragDropContainer } from 'react-drag-drop-container'
import TaskDialog from './TaskDialog'
import toMaterialStyle from 'material-color-hash'
import MarkdownRenderer from 'react-markdown-renderer';

const styles = theme => ({
  card: {
    width: 150,
    height: 'auto',
    margin: '5px 5px 5px 5px',
  },
  actions: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  userlabel: {
    bottom: 5,
  },
  cardcontent: {
    height: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: {
    fontSize: 'medium',
  },
  button: {
    padding: '0',
  },
  droptarget: {
    height: '100%',
  },
})

class TaskGrid extends Component {
  state = {
    open: false,
    open_task: null,
  }

  handleClickOpen = (task) => {
    this.setState({open: true, open_task: task})
  }

  handleClose = () => {
    this.setState({open: false, open_task: null})
  }

  render() {
    const { classes, tasks, onDelete } = this.props
    const storyTasks = []
    tasks.map(task => {
      let chipColor = toMaterialStyle(task.user, 200)
      return storyTasks.push(
        <DragDropContainer key={task.id} targetKey={task.story_id} dragData={task}>
          <Card className={classes.card}>
            <CardActions className={classes.actions}>
              <IconButton aria-label="Edit" onClick={() => this.handleClickOpen(task)} className={classes.button}>
                <EditIcon className={classes.icon}/>
              </IconButton>
              <IconButton aria-label="Delete" onClick={() => onDelete(task)} className={classes.button}>
                <DeleteIcon className={classes.icon}/>
              </IconButton>
            </CardActions>
            <CardContent className={classes.cardcontent}>
              <MarkdownRenderer markdown={task.text} />
            </CardContent>
            <CardActions className={classes.userlabel}>
              <Chip label={task.user} style={chipColor} />
            </CardActions>
          </Card>
        </DragDropContainer>
      )
    })
    return(
      <div className={classes.droptarget}>
        {storyTasks}
        <TaskDialog open={this.state.open} onClose={this.handleClose} task={this.state.open_task}/>
      </div>
    )
  }
}

export default withStyles(styles)(TaskGrid)
