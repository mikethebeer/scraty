import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import rootReducer from './reducers'
import { HTTP_BACKEND_URL, WS_BACKEND_URL } from './config/config'
import { addStory, deleteStory, updateStory } from './actions/story'
import { addTask, deleteTask, updateTask } from './actions/task'

const store = createStore(rootReducer)

function updateStoryView(action, story) {
    switch (action) {
      case 'added':
        store.dispatch(addStory(story))
        break
      case 'deleted':
        store.dispatch(deleteStory(story))
        break
      case 'updated':
        store.dispatch(updateStory(story))
        break
      default:
        console.warn("update story - no action found")
    }
  }

function updateTaskView(action, task) {
    switch (action) {
      case 'added':
        store.dispatch(addTask(task))
        break
      case 'deleted':
        store.dispatch(deleteTask(task))
        break
      case 'updated':
        store.dispatch(updateTask(task))
        break
      default:
        console.warn("update task - no action found")
    }
  }

fetch(HTTP_BACKEND_URL + '/api/stories/')
  .then(response => response.json())
  .then(data => data.stories.map(story => store.dispatch(addStory(story))))

var ws = new WebSocket(WS_BACKEND_URL + '/websocket')
ws.onmessage = (evt) => {
  var data = JSON.parse(evt.data)
  if (data.object_type === 'story') {
    updateStoryView(data.action, data.object)
  } else {
    updateTaskView(data.action, data.object)
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
