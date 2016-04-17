import { Pipe, PipeTransform } from '@angular/core';
import {Task} from './models/model';

@Pipe({
  name: 'taskStateFilter'
})
export class TaskStateFilter implements PipeTransform {
  transform(tasks: Task[], state: number): Task[] {
    if (tasks) {
      return tasks.filter(task => task.state === state);
    }
  }
}
