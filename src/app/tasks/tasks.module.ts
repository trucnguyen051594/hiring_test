import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GetNameModule } from '../shared/pipes/get-name.module';
import { CreateTaskModule } from '../shared/components/create-task/create-task.module';


@NgModule({
  declarations: [
    TasksComponent,
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    ReactiveFormsModule,
    GetNameModule,
    CreateTaskModule
  ]
})
export class TasksModule { }
