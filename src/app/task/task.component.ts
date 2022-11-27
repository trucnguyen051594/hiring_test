import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Task } from '../services/backend.service';
import { BaseComponent } from '../shared/directives/base-component';
import { TaskStore } from '../shared/stores/task.store';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent extends BaseComponent {

  task$: Observable<Task>;

  constructor(
    public taskStore: TaskStore,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { super() }

  ngOnInit(): void {
    const id: number = +this.activatedRoute.snapshot.paramMap.get('id');
    this.task$ = this.taskStore.vm$.pipe(
      map(taskState => taskState.tasks[0]),
      tap(task => {
        if(!task){
          this.router.navigateByUrl('/');
        }
      })
    )
    this.taskStore.findbyId(id);
  }

  back() {
    this.router.navigateByUrl('/');
  }

}
