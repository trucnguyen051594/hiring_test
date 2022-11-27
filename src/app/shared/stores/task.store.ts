import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concat, EMPTY, Observable, of } from 'rxjs';
import { catchError, concatMap, mergeMap, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BackendService, Task } from 'src/app/services/backend.service';

export const enum LoadingState {
    INIT = "INIT",
    LOADING = "LOADING",
    LOADED = "LOADED"
}

export interface ErrorState {
    errorMsg: string;
}

export type CallState = LoadingState | ErrorState;

export interface ITasks {
    tasks: Task[];
    callState: CallState;
}

@Injectable({
    providedIn: 'root'
})
export class TaskStore extends ComponentStore<ITasks> {

    constructor(
        private backend: BackendService
    ) {
        super({
            tasks: [],
            callState: LoadingState.INIT
        });
    }

    private readonly tasks$: Observable<Task[]> = this.select(state => state.tasks);
    private readonly loading$: Observable<boolean> = this.select(
        state => state.callState === LoadingState.LOADING
    );
    private readonly error$: Observable<string> = this.select(state =>
        getError(state.callState)
    );

    // VIEW MODEL
    readonly vm$ = this.select(
        this.tasks$,
        this.loading$,
        this.error$,
        (tasks, loading, error) => ({
            tasks,
            loading,
            error
        })
    );

    // UPDATE
    readonly updateError = this.updater((state: ITasks, error: string) => {
        return {
            ...state,
            callState: {
                errorMsg: error
            }
        };
    });

    readonly setLoading = this.updater((state: ITasks) => {
        return {
            ...state,
            callState: LoadingState.LOADING
        };
    });

    readonly setLoaded = this.updater((state: ITasks) => {
        return {
            ...state,
            callState: LoadingState.LOADED
        };
    });

    readonly updateCreateTask = this.updater((state: ITasks, task: Task) => {
        return {
            ...state,
            callState: LoadingState.LOADED,
            tasks: [...state.tasks, task]
        };
    });

    readonly updateTasks = this.updater((state: ITasks, tasks: Task[]) => {
        return {
            ...state,
            callState: LoadingState.LOADED,
            tasks
        };
    });

    readonly updateDeleteTask = this.updater((state: ITasks, id: number) => {
        return {
            ...state,
            callState: LoadingState.LOADED,
            tasks: state.tasks.filter(task => task.id !== id)
        };
    });

    readonly findTaskById = this.updater((state: ITasks, task: Task) => {
        return {
            ...state,
            callState: LoadingState.LOADED,
            tasks: [task]
        };
    });

    readonly updateAssigneeTask = this.updater((state: ITasks, info: { id: number, assigneeId: number }) => {
        const index: number = state.tasks.findIndex(task => task.id === info.id);
        state.tasks[index].assigneeId = info.assigneeId
        return {
            ...state,
            callState: LoadingState.LOADED,
            tasks: [...state.tasks]
        };
    });

    readonly updateCompletedTask = this.updater((state: ITasks, info: { id: number, completed: boolean }) => {
        const index: number = state.tasks.findIndex(task => task.id === info.id);
        state.tasks[index].completed = info.completed
        return {
            ...state,
            callState: LoadingState.LOADED,
            tasks: [...state.tasks]
        };
    });



    // EFFECT
    readonly findbyId = this.effect((id$: Observable<number>) => {
        return id$.pipe(
            switchMap((id: number) => {
                this.setLoading();
                return this.backend.findTaskById$(id).pipe(
                    tapResponse(
                        task => {
                            this.setLoaded();
                            this.findTaskById(task)
                        },
                        (err: string) => this.updateError(err)
                    ),
                    catchError(() => EMPTY)
                )
            }),
        )
    })


    readonly searchTasks = this.effect((textSearch$: Observable<string>) => {
        return textSearch$.pipe(
            switchMap((text: string) => {
                this.setLoading();
                return this.backend.filterTasks(text).pipe(
                    tapResponse(
                        tasks => {
                            this.setLoaded();
                            this.updateTasks(tasks)
                        },
                        (err: string) => this.updateError(err)
                    ),
                    catchError(() => EMPTY)
                )
            })
        )
    })

    readonly getTasks = this.effect((tasks$: Observable<Task | null>) => {
        return tasks$.pipe(
            switchMap(tasks => {
                this.setLoading();
                return this.backend.getTasks().pipe(
                    tapResponse(
                        tasks => {
                            this.setLoaded();
                            this.updateTasks(tasks)
                        },
                        (err: string) => this.updateError(err)
                    ),
                    shareReplay(1),
                    catchError(() => EMPTY)
                )
            })
        )
    })

    readonly createTask = this.effect((task$: Observable<Task>) => {
        return task$.pipe(
            switchMap((task: Task) => {
                this.setLoading();
                return this.backend.newTask(task).pipe(
                    tapResponse(
                        tasks => {
                            this.setLoaded();
                            this.updateCreateTask(tasks);
                        },
                        (err: string) => this.updateError(err)
                    ),
                    catchError(() => EMPTY)
                )
            })
        )
    })

    readonly deleteTask = this.effect((id$: Observable<number>) => {
        return id$.pipe(
            switchMap((id: number) => {
                this.setLoading();
                return this.backend.delete(id).pipe(
                    tapResponse(
                        tasks => {
                            this.setLoaded();
                            this.updateDeleteTask(id);
                        },
                        (err: string) => this.updateError(err)
                    ),
                    catchError(() => EMPTY)
                )
            })
        )
    })

    readonly updateCompleted = this.effect((info$: Observable<{ id: number, completed: boolean }>) => {
        return info$.pipe(
            switchMap((info: { id: number, completed: boolean }) => {
                this.setLoading();
                return this.backend.complete(info.id, info.completed).pipe(
                    tapResponse(
                        tasks => {
                            this.setLoaded();
                            this.updateCompletedTask({ id: info.id, completed: info.completed });
                        },
                        (err: string) => this.updateError(err)
                    ),
                    catchError(() => EMPTY)
                )
            })
        )
    })

    readonly updateAssignee = this.effect((info$: Observable<{ id: number, assigneeId: number }>) => {
        return info$.pipe(
            switchMap((info: { id: number, assigneeId: number }) => {
                this.setLoading();
                return this.backend.assign(info.id, info.assigneeId).pipe(
                    tapResponse(
                        tasks => {
                            this.setLoaded();
                            this.updateAssigneeTask({ id: info.id, assigneeId: info.assigneeId });
                        },
                        (err: string) => this.updateError(err)
                    ),
                    catchError(() => EMPTY)
                )
            })
        )
    })

    readonly selectTasksState = this.select(state => state.tasks)
}



// Utility function to extract the error from the state
function getError(callState: CallState): LoadingState | string | null {
    if ((callState as ErrorState).errorMsg !== undefined) {
        return (callState as ErrorState).errorMsg;
    }
    return null;
}