import { ADD_STORY, DELETE_STORY, UPDATE_STORY } from "../actions/story"
import { ADD_TASK, DELETE_TASK, UPDATE_TASK } from "../actions/task"

function removeTaskFromStory(story, task_to_remove) {
  story.tasks = story.tasks
      .filter(t => t.id !== task_to_remove.id)
  return story
}

function addTaskToStory(story, task_to_add) {
  story.tasks = story.tasks
    .filter(t => t.id !== task_to_add.id)
  story.tasks.push(task_to_add)
  return story
}

/**
 * Accepts a list of stories (=state) and updates it according to its action
 * using Reducer Composition pattern
 */
const stories = (state = [], action) => {
  let index = -1
  let tmp_stories = []
  let story = {}
  switch (action.type) {
    case ADD_STORY:
      return state.concat(action.story)
    case DELETE_STORY:
      return state.filter(s => s.id !== action.story.id)
    case UPDATE_STORY:
      index = state.findIndex(s => s.id === action.story.id)
      tmp_stories = state.filter(s => s.id !== action.story.id)
      tmp_stories.splice(index, 0, action.story)
      return tmp_stories
    case DELETE_TASK:
      index = state.findIndex(s => s.id === action.task.story_id)
      tmp_stories = state.filter(s => s.id !== action.task.story_id)
      story = state.filter(s => s.id === action.task.story_id)[0]
      let filtered_story = removeTaskFromStory(story, action.task)
      tmp_stories.splice(index, 0, filtered_story)
      return tmp_stories
    case ADD_TASK:
    case UPDATE_TASK:
      index = state.findIndex(s => s.id === action.task.story_id)
      tmp_stories = state.filter(s => s.id !== action.task.story_id)
      story = state.filter(s => s.id === action.task.story_id)[0]
      let add_story = addTaskToStory(story, action.task)
      tmp_stories.splice(index, 0, add_story)
      return tmp_stories
    default:
      return state
  }
}

export default stories
