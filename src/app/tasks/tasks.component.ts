import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../shared/directives/base-component';
import { Task } from '../services/backend.service'
import { Observable, Subject } from 'rxjs';
import { TaskStore } from '../shared/stores/task.store';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BackendService]
})
export class TasksComponent extends BaseComponent implements OnInit, AfterViewInit {

  tasks$: Observable<Task[]>;
  users$ = this.backend.users()
  form: FormGroup;
  showCreateTask = false;
  inputValue$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    public taskStore: TaskStore,
    private router: Router,
    private backend: BackendService
  ) { super() }

  ngAfterViewInit(): void {
    this.tasks$ = this.taskStore.select<Task[]>(state => state.tasks)
  }

  ngOnInit(): void {
    this.initForm();
    this.onSearch();
  }

  initForm(): void {
    this.form = this.formBuilder.group(
      {
        search: this.formBuilder.control(''),
      }
    )
  }

  onSearch(): void {
    this.form.controls.search.valueChanges.
      pipe(
        startWith(''),
        debounceTime(200),
        takeUntil(this.unsubcribe$),
      )
      .subscribe(text => {
        this.taskStore.searchTasks(text);
      })
  }

  delete(id): void {
    this.taskStore.deleteTask(id);
  }

  createTask(type: number, task?: Task): void {
    if (type === 0) {
      this.showCreateTask = true;
      this.form.controls.search.patchValue('', { emitEvent: false });
      return;
    }
    this.showCreateTask = false;
    this.taskStore.createTask(task);
  }

  selectAssignee(taskId: number, userId: number): void {
    this.taskStore.updateAssignee({ id: +taskId, assigneeId: +userId });
  }

  updateCompleted(taskId: number, value: any): void {
    this.taskStore.updateCompleted({ id: +taskId, completed: value.checked });
  }

  navigateTo(id: number): void {
    this.router.navigate(['task/', id]);
  }

}
