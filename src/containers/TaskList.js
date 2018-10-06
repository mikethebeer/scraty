import { connect } from "react-redux"
import { deleteTask } from "../actions/task"
import TaskGrid from "../components/TaskGrid"
import { HTTP_BACKEND_URL } from "../config/config"

const mapStateToProps = (state, ownProps) => {
  return {
    tasks: ownProps.tasks
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDelete: task => {
      fetch(HTTP_BACKEND_URL + '/api/tasks/' + task.id, {
      method: 'DELETE',
      }).then(response => {
        dispatch(deleteTask(task))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskGrid)
