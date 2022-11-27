import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';
import { BaseComponent } from '../../directives/base-component';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTaskComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  users$ = this.backendService.users()
  errors = {};

  @Output() submit = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) { super() }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      description: [null, Validators.required],
      assigneeId: [null]
    })
  }

  save(): void {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.submit.next(this.form.getRawValue())
  }
}
