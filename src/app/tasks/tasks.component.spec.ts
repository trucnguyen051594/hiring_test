import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BackendService, Task } from "../services/backend.service";
import { TaskStore } from "../shared/stores/task.store";
import { TasksComponent } from "./tasks.component";
import { RouterTestingModule } from '@angular/router/testing';

describe('TasksComponent', () => {
    let component: TasksComponent;
    let fixture: ComponentFixture<TasksComponent>;

    beforeEach(waitForAsync(() =>{ 
        TestBed.configureTestingModule({
          declarations: [TasksComponent],
          imports: [ReactiveFormsModule, RouterTestingModule],
          providers: [
            { provide: TaskStore, useClass: TaskStore },
            { provide: BackendService, useClass: BackendService }
          ]
        }).compileComponents();
      })
    );

    it('init', async () => {
        fixture = TestBed.createComponent(TasksComponent);
        component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    })
})

