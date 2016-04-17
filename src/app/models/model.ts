export class Story {
    id: string;
    link: string;
    position: number;
    text: string;
    ts: string;
}

export class User {
    id: string;
    name: string;
    color: string;
}

export class Task {
    id: string;
    story_id: number;
    user_id: number;
    text: string;
    state: number;
    ts: string;
}
