export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

export const updateTask = task => ({
    type: UPDATE_TASK,
    task
})

export const addTask = task => ({
    type: ADD_TASK,
    task
})

export const deleteTask = task => ({
    type: DELETE_TASK,
    task
})
