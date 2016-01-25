Add a story::

    >>> r = client.post('/api/story/', data=json.dumps({'text': 'story 1'}))
    >>> p(r.content)
    {
        "data": {
            "id": "...",
            "link": null,
            "text": "story 1"
        },
        "status": "success"
    }

    >>> refresh('stories')

List all stories::

    >>> r = client.get('/api/story/')
    >>> p(r.content)
    {
        "stories": [
            {
                "id": "...",
                "link": null,
                "text": "story 1"
            }
        ]
    }
