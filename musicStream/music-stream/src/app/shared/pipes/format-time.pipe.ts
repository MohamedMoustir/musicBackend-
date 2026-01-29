import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true
})
export class FormatTimePipe implements PipeTransform {

  transform(timeInSeconds: number): unknown {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const paddingMinutes = minutes < 10 ? '0' : '';
    const paddingSeconds = seconds < 10 ? '0' : '';

    return `${paddingMinutes}${minutes}:${paddingSeconds}${seconds}`;
  }

}
