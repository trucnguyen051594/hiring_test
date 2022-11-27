import { Pipe, PipeTransform } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Pipe({
  name: 'getName',
})
export class GetNamePipe implements PipeTransform {

  constructor(private backend: BackendService){}

  transform(id: number): string {
    return this.backend.getNameById(id)
  }

}
