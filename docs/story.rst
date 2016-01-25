Add a story::

    >>> r = client.post('/api/stories/', data=json.dumps({'text': 'story 1'}))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "link": null,
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
                "tasks": [],
                "text": "story 1"
            }
        ]
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

    >>> refresh('tasks')

List all tasks::

    >>> r = client.get('/api/tasks/')
    >>> p(r.content)
    {
        "tasks": [
            {
                "id": "...",
                "text": "task 1",
                "user": "username"
            }
        ]
    }
