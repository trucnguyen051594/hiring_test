import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks',
    },
    {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksModule),
    },
    {
        path: 'task',
        loadChildren: () => import('./task/task.module').then((m) => m.TaskModule),
    }
]


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    providers: [],
    exports: [RouterModule],
})
export class AppRoutingModule { }