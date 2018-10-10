Add a board::

    >>> r = client.post('/api/boards/', data=json.dumps({'name': 'scraty board'}))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "name": "scraty board"
        },
        "status": "success"
    }

    >>> board_id = r.json()['data']['id']

    >>> refresh('boards')

Add a story::

    >>> r = client.post('/api/stories/', data=json.dumps({'text': 'story 1'}))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "link": null,
            "position": 1,
            "tasks": [],
            "text": "story 1"
        },
        "status": "success"
    }

    >>> story_id = r.json()['data']['id']

    >>> refresh('stories')

List all stories::

    >>> r = client.get('/api/stories/')
    >>> p(r.content)
    {
        "stories": [
            {
                "id": "...",
                "link": null,
                "position": 1,
                "tasks": [],
                "text": "story 1"
            }
        ]
    }

Update a story::

    >>> data = {"position": 2}
    >>> r = client.post('/api/stories/' + story_id, data=json.dumps(data))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "link": null,
            "position": 2,
            "tasks": [],
            "text": "story 1"
        },
        "status": "success"
    }

Add a task::

    >>> data = {'story_id': story_id, 'text': 'task 1', 'user': 'username'}
    >>> r = client.post('/api/tasks/', data=json.dumps(data))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "text": "task 1",
            "user": "username"
        },
        "status": "success"
    }

    >>> task_id = r.json()['data']['id']
    >>> refresh('tasks')


Update a task::

    >>> data = {'text': 'task 1.1', 'state': 1}
    >>> r = client.post('/api/tasks/' + task_id, data=json.dumps(data))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "state": 1,
            "story_id": "...",
            "text": "task 1.1",
            "user": "username"
        },
        "status": "success"
    }

    >>> refresh('tasks')

List all tasks::

    >>> r = client.get('/api/tasks/')
    >>> p(r.content)
    {
        "tasks": [
            {
                "id": "...",
                "text": "task 1.1",
                "user": "username"
            }
        ]
    }

Delete a task::

    >>> client.delete('/api/tasks/' + task_id)
    <Response [200]>

Delete a story::

    >>> client.delete('/api/stories/' + story_id)
    <Response [200]>
