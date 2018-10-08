import { connect } from "react-redux"
import StoryGrid from "../components/StoryGrid"
import { HTTP_BACKEND_URL } from "../config/config"
import { updateTask } from "../actions/task"

const mapStateToProps = state => {
  return {
    stories: state.stories
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDrop: (event, state) => {
      const { dragData, } = event
      fetch(HTTP_BACKEND_URL + '/api/tasks/' + dragData.id, {
        method: 'POST',
        body: JSON.stringify({
          "state": state,
        }),
      })
      .then(response => response.json())
      .then(data => {
        dispatch(updateTask(data.data))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryGrid)
