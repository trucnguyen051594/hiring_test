import { of } from "rxjs";
import { take } from "rxjs/operators";
import { Task } from "src/app/services/backend.service";
import { TaskStore } from "./task.store";

const TEST_CREATE_TASK: Task = {
    id: 2,
    description: 'aaa',
    assigneeId: 111,
    completed: false,
}

describe('Task Store', () => {

    let beServiceSpy: any;
    let taskStore: TaskStore;

    beforeEach(() => {
        beServiceSpy = {
            newTask: (data) => of(data),
            getTasks: () => of([TEST_CREATE_TASK]),
            delete: (id) => of([])
        };
        taskStore = new TaskStore(beServiceSpy);
    })

    it('create task', async () => {
        taskStore.createTask(TEST_CREATE_TASK)
        taskStore.selectTasksState.pipe(take(1)).subscribe(tasks => {
            expect(tasks[0].id).toEqual(TEST_CREATE_TASK.id);
        })
    })

    it('get tasks', async () => {
        taskStore.getTasks(null);
        taskStore.selectTasksState.pipe(take(1)).subscribe(tasks => {
            expect(tasks.length).toBeGreaterThanOrEqual(0);
        })
    })

    it('delete tasks', async () => {
        taskStore.deleteTask(2);
        taskStore.selectTasksState.pipe(take(1)).subscribe((tasks: Task[]) => {
            let ok = !tasks.find(task => task.id !== 2)
            expect(ok).toBeTruthy();
        })
    })
})



