import { Directive, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Directive()
export class BaseComponent implements OnDestroy {

    unsubcribe$ = new Subject();

    ngOnDestroy(): void {
        this.unsubcribe$.next(true);
        this.unsubcribe$.unsubscribe();
    }
}