import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import { DropTarget } from 'react-drag-drop-container';
import { HTTP_BACKEND_URL, WS_BACKEND_URL } from './config';
import StoryDialog from './StoryDialog';
import AddTaskButton from './AddTaskButton';
import TaskCard from './TaskCard';


const styles = theme => ({
  head: {
    backgroundColor: theme.palette.primary.light,
  },
  cell: {
    color: theme.palette.common.white,
  },
  table: {
    minWidth: 700,
  },
  card: {
    display: 'flex',
  },
  droptarget: {
    width: '100px',
    height: '100px',
  },
});

class StoryGrid extends Component {

  state = {
    stories: [],
    tasks: [],
    open: false,
  }

  updateStoryView(action, story) {
    switch (action) {
      case 'added':
        this.state.stories.push(story);
        break;
      case 'deleted':
        this.setState({stories: this.state.stories.filter(s => s.id !== story.id)});
        break;
      case 'updated':
        let stories = this.state.stories.filter(s => s.id !== story.id);
        stories.push(story);
        this.setState({stories: stories});
        break;
      default:
        console.warn("update story - no action found");
    }
  }

  updateTaskView(action, task) {
    switch (action) {
      case 'added':
        this.state.tasks.push(task);
        break;
      case 'deleted':
        this.setState({tasks: this.state.tasks.filter(t => t.id !== task.id)});
        break;
      case 'updated':
        let tasks = this.state.tasks.filter(t => t.id !== task.id);
        tasks.push(task);
        this.setState({tasks: tasks});
        break;
      default:
        console.warn("update task - no action found");
    }
  }

  componentDidMount() {
    fetch(HTTP_BACKEND_URL + '/api/stories/')
      .then(response => response.json())
      .then(data => this.setState({stories: data.stories}));

    fetch(HTTP_BACKEND_URL + '/api/tasks/')
      .then(response => response.json())
      .then(data => this.setState({tasks: data.tasks}));

    var ws = new WebSocket(WS_BACKEND_URL + '/websocket');
    ws.onmessage = (evt) => {
      var data = JSON.parse(evt.data);
      if (data.object_type === 'story') {
        console.warn("update story");
        this.updateStoryView(data.action, data.object);
      } else {
        console.warn("update task");
        this.updateTaskView(data.action, data.object);
      }
    };
  }

  deleteStory = (id, event) => {
    // event.preventDefault();   // avoid reload
    fetch(HTTP_BACKEND_URL + '/api/stories/' + id, {
      method: 'DELETE',
    }).then(response => console.log(response));
    this.setState({
      stories: this.state.stories.filter(story => story.id !== id),
      tasks: this.state.tasks.filter(task => task.story_id !== id)
    });
  }

  deleteTask = (id) => {
    // event.preventDefault();   // avoid reload
    fetch(HTTP_BACKEND_URL + '/api/tasks/' + id, {
      method: 'DELETE',
    }).then(response => console.log(response));
    this.setState({tasks: this.state.tasks.filter(task => task.id !== id)});
  }

  editTask = () => {
    // event.preventDefault();   // avoid reload
    fetch(HTTP_BACKEND_URL + '/api/tasks/')
      .then(response => response.json())
      .then(data => this.setState({tasks: data.tasks}));
  }

  handleEditStoryOpen = () => {
    this.setState({open: true});
  }

  handleEditStoryClose = () => {
    this.setState({open: false});
  }

  dropped = (event, state) => {
    const { dragData } = event;
    fetch(HTTP_BACKEND_URL + '/api/tasks/' + dragData.id, {
      method: 'POST',
      body: JSON.stringify({
        "state": state,
      }),
    })
      .then(response => response.json())
      .then(data => {
        let tasks = this.state.tasks;
        tasks = tasks.filter(task => task.id !== dragData.id);
        tasks.push(data.data);
        this.setState({tasks: tasks});
      });
  }

  render() {
    const { classes } = this.props;
    const rows = [];
    this.state.stories.forEach(story => {
      let tasks = this.state.tasks.filter(task => task.story_id === story.id);
      rows.push(
        <TableRow key={story.id}>
          <TableCell component="th" scope="row">
            <Card className={this.props.card}>
              <CardContent>
                <Typography variant="title">
                  {story.text}
                </Typography>
                <a href={story.link}>{story.link}</a>
              </CardContent>
              <CardActions>
                <IconButton aria-label="Edit" onClick={this.handleEditStoryOpen}>
                  <EditIcon />
                </IconButton>
                <StoryDialog story={story} open={this.state.open} onClose={this.handleEditStoryClose} />
                <IconButton aria-label="Delete" onClick={(e) => this.deleteStory(story.id, e)}>
                  <DeleteIcon />
                </IconButton>
                <AddTaskButton id={story.id} />
              </CardActions>
            </Card>
          </TableCell>
          <TableCell style={{borderLeft: '1px solid rgba(224, 224, 224, 1)'}}>
            <DropTarget targetKey={story.id} onHit={(e) => this.dropped(e, 0)}>
              <div style={{minHeight: 100}}>
                {tasks.filter(task => task.state === 0)
                  .map(task => {
                    return (<TaskCard key={task.id} task={task} onDelete={this.deleteTask} onEdit={this.editTask}/>)
                  })
                }
              </div>
            </DropTarget>
          </TableCell>
          <TableCell style={{borderLeft: '1px solid rgba(224, 224, 224, 1)'}}>
            <DropTarget targetKey={story.id} onHit={(e) => this.dropped(e, 1)}>
              <div style={{minHeight: 100}}>
                {tasks.filter(task => task.state === 1)
                  .map(task => {
                    return (<TaskCard key={task.id} task={task} onDelete={this.deleteTask} onEdit={this.editTask}/>)
                  })
                }
              </div>
            </DropTarget>
          </TableCell>
          <TableCell style={{borderLeft: '1px solid rgba(224, 224, 224, 1)'}}>
            <DropTarget targetKey={story.id} onHit={(e) => this.dropped(e, 2)}>
              <div style={{minHeight: 100}}>
                {tasks.filter(task => task.state === 2)
                  .map(task => {
                    return (<TaskCard key={task.id} task={task} onDelete={this.deleteTask} onEdit={this.editTask}/>)
                  })
                }
              </div>
            </DropTarget>
          </TableCell>
          <TableCell style={{borderLeft: '1px solid rgba(224, 224, 224, 1)'}}>
            <DropTarget targetKey={story.id} onHit={(e) => this.dropped(e, 3)}>
              <div style={{minHeight: 100}}>
                {tasks.filter(task => task.state === 3)
                  .map(task => {
                    return (<TaskCard key={task.id} task={task} onDelete={this.deleteTask} onEdit={this.editTask}/>)
                  })
                }
              </div>
            </DropTarget>
          </TableCell>
        </TableRow>
      );
    });
    return(
      <Table className={classes.table}>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell className={classes.cell}>Stories</TableCell>
            <TableCell className={classes.cell}>To Do</TableCell>
            <TableCell className={classes.cell}>In Progress</TableCell>
            <TableCell className={classes.cell}>Verify</TableCell>
            <TableCell className={classes.cell}>Done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(StoryGrid);
