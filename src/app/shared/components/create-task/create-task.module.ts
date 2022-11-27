import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskComponent } from './create-task.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreateTaskComponent
  ],
  exports: [CreateTaskComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CreateTaskModule { }
