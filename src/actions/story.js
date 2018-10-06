export const ADD_STORY = 'ADD_STORY'
export const DELETE_STORY = 'DELETE_STORY'
export const UPDATE_STORY = 'UPDATE_STORY'

export const updateStory = story => ({
    type: UPDATE_STORY,
    story
})

export const addStory = story => ({
    type: ADD_STORY,
    story
})

export const deleteStory = story => ({
    type: DELETE_STORY,
    story
})
