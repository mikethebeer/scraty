import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import { DropTarget } from 'react-drag-drop-container'
import TaskList from '../containers/TaskList'
import Story from '../containers/Story'

const styles = theme => ({
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontSize: 16,
    fontFamily: 'Permanent Marker',
  },
  cell: {
    borderLeft: '1px solid #303030',
    borderTop: '8px solid #303030',
  },
  table: {
    minWidth: 700,
    height: 1,
    backgroundColor: theme.palette.primary.dark,
  },
  card: {
    width: 200,
  },
  droptarget: {
    height: '100%',
  },
})

class StoryGrid extends Component {

  render() {
    const { classes, stories, onDrop } = this.props
    const rows = []
    stories.map(story => {
      return rows.push(
        <TableRow key={story.id}>
          <TableCell component="th" scope="row" className={classes.cell}>
            <Story story={story} />
          </TableCell>
          <TableCell className={classes.cell} padding='none'>
            <div className={classes.droptarget}>
              <DropTarget targetKey={story.id} onHit={(e) => onDrop(e, 0)}>
                <TaskList state={0} tasks={story.tasks.filter(t => t.state === 0)} />
              </DropTarget>
            </div>
          </TableCell>
          <TableCell className={classes.cell} padding='none'>
            <div className={classes.droptarget}>
              <DropTarget targetKey={story.id} onHit={(e) => onDrop(e, 1)}>
                <TaskList state={1} tasks={story.tasks.filter(t => t.state === 1)} />
              </DropTarget>
            </div>
          </TableCell>
          <TableCell className={classes.cell} padding='none'>
            <div className={classes.droptarget}>
              <DropTarget targetKey={story.id} onHit={(e) => onDrop(e, 2)}>
                <TaskList state={2} tasks={story.tasks.filter(t => t.state === 2)} />
              </DropTarget>
            </div>
          </TableCell>
          <TableCell className={classes.cell} padding='none'>
            <div className={classes.droptarget}>
              <DropTarget targetKey={story.id} onHit={(e) => onDrop(e, 3)}>
                <TaskList state={3} tasks={story.tasks.filter(t => t.state === 3)} />
              </DropTarget>
            </div>
          </TableCell>
        </TableRow>
      )
    })
    return(
      <Table className={classes.table}>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell className={classes.head} style={{width: 200}}>Stories</TableCell>
            <TableCell className={classes.head}>To Do</TableCell>
            <TableCell className={classes.head}>In Progress</TableCell>
            <TableCell className={classes.head}>Verify</TableCell>
            <TableCell className={classes.head}>Done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    )
  }
}

StoryGrid.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    })
  )
}

export default withStyles(styles)(StoryGrid)
