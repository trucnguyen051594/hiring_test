import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetNamePipe } from './get-name.pipe';
import { BackendService } from 'src/app/services/backend.service';



@NgModule({
  declarations: [GetNamePipe],
  exports: [GetNamePipe],
  imports: [
    CommonModule
  ],
  providers: [BackendService]
})
export class GetNameModule { }
