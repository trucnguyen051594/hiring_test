import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { RouterModule, Routes } from '@angular/router';
import { GetNamePipe } from '../shared/pipes/get-name.pipe';
import { GetNameModule } from '../shared/pipes/get-name.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tasks',
  },
  {
      path: ':id',
      component: TaskComponent
  }
]

@NgModule({
  declarations: [
    TaskComponent
  ],
  imports: [
    CommonModule,
    GetNameModule,
    RouterModule.forChild(routes)
  ]
})
export class TaskModule { }
