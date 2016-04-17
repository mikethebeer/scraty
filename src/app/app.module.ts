import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { StoryComponent } from './story.component';
import { TaskStateFilter } from './taskstatefilter.pipe';
import { DndModule } from 'ng2-dnd';

@NgModule({
  imports:      [ BrowserModule, HttpModule, DndModule.forRoot() ],
  declarations: [ AppComponent, StoryComponent, TaskStateFilter ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
