import { connect } from "react-redux"
import StoryCard from "../components/StoryCard"
import { deleteStory } from "../actions/story"
import { HTTP_BACKEND_URL } from "../config/config"

const mapStateToProps = (state, ownProps) => {
  return {
    story: ownProps.story
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDelete: story => {
      fetch(HTTP_BACKEND_URL + '/api/stories/' + story.id, {
      method: 'DELETE',
      }).then(response => {
        dispatch(deleteStory(story))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoryCard)
