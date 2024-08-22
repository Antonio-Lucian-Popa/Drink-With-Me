import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviateNumber',
  standalone: true
})
export class AbbreviateNumberPipe implements PipeTransform {

  transform(value: number): string {
    if (value < 1000) {
      return value.toString();
    } else if (value >= 1000 && value < 1000000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    return value.toString();
  }

}
