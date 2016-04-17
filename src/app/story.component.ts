import {Component} from '@angular/core';
import {Task, Story, User} from './models/model';
import {DataService} from './data.service';

@Component({
  selector: 'my-tasks',
  templateUrl: 'app/story.component.html',
  providers: [DataService]
})
export class StoryComponent {
  stories: Story[];
  tasks: Task[];
  users: User[];

  errorMessage: string;

  constructor(private _dataService: DataService) {
    _dataService.getAllStories().subscribe(
        stories => this.stories = stories,
        error => this.errorMessage = <any>error);

    _dataService.getAllTasks().subscribe(
        tasks => this.tasks = tasks,
        error => this.errorMessage = <any>error);

    _dataService.getAllUsers().subscribe(
        users => this.users = users,
        error => this.errorMessage = <any>error);
  }
}
