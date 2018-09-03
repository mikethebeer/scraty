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
import { HTTP_BACKEND_URL } from './config';
import StoryDialog from './StoryDialog';


const styles = theme => ({
  table: {
    minWidth: 700,
  },
  card: {
    display: 'flex',
  },
});

class StoryGrid extends Component {

  state = {
    stories: [],
    open: false,
  }

  componentDidMount() {
    fetch(HTTP_BACKEND_URL + '/api/stories/')
      .then(response => response.json())
      .then(data => this.setState({stories: data.stories}))
  }

  deleteStory = (id, event) => {
    // event.preventDefault();   // avoid reload
    fetch(HTTP_BACKEND_URL + '/api/stories/' + id, {
      method: 'DELETE',
    }).then(response => console.log(response));
    this.setState({ stories: this.state.stories.filter(story => story.id !== id) });
  }

  handleEditStoryOpen = (id, event) => {
    this.setState({open: true});
  }

  handleEditStoryClose = () => {
    this.setState({open: false});
  }

  render() {
    const rows = [];
    this.state.stories.forEach(story => {
      rows.push(
          <TableRow key={story.id}>
            <TableCell component="th" scope="row">
              <Card className={this.props.card}>
                <CardContent>
                  <Typography variant="headline" component="h2">
                  {story.text}
                  </Typography>
                  <Typography component="p">
                  {story.link}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="Edit" onClick={this.handleEditStoryOpen}>
                    <EditIcon />
                  </IconButton>
                  <StoryDialog id={story.id} open={this.state.open} onClose={this.handleEditStoryClose} />
                  <IconButton aria-label="Delete" onClick={(e) => this.deleteStory(story.id, e)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </TableCell>
            <TableCell numeric></TableCell>
            <TableCell numeric>150</TableCell>
            <TableCell numeric>80</TableCell>
            <TableCell numeric>10</TableCell>
          </TableRow>
      )
    });
    return(
      <Table className={this.props.table}>
        <TableHead>
          <TableRow>
            <TableCell>Stories</TableCell>
            <TableCell numeric>To Do</TableCell>
            <TableCell numeric>In Progress</TableCell>
            <TableCell numeric>Verify</TableCell>
            <TableCell numeric>Done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }
}

export default withStyles(styles)(StoryGrid);
