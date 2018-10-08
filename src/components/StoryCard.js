import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Card, CardContent, CardActions, IconButton, withStyles, Button } from '@material-ui/core'
import StoryDialog from './StoryDialog'
import AddTaskButton from './AddTaskButton'

const styles = theme => ({
  card: {
    width: 180,
    padding: 0,
  },
})

class StoryCard extends Component {
  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  render() {
    const { classes, story, onDelete } = this.props
    return(
      <Card className={classes.card}>
        <CardContent>
          <Button variant="contained" size="small" color="primary" href={story.link}>{story.text}</Button>
        </CardContent>
        <CardActions>
          <IconButton aria-label="Edit" onClick={this.handleClickOpen}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => onDelete(story)}>
            <DeleteIcon />
          </IconButton>
          <AddTaskButton id={story.id} />
        </CardActions>
        <StoryDialog story={story} open={this.state.open} onClose={this.handleClose} />
      </Card>
    )
  }
}

StoryCard.propTypes = {
  story: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default withStyles(styles)(StoryCard)
