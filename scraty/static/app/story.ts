import {Task} from './task';

export interface Story {
    id?: string;
    link?: string;
    position?: number;
    text?: string;
    tasks?: Task[];
}
