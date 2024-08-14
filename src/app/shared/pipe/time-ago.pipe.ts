import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    const currentDate = new Date();
    const inputDate = new Date(value);
    const elapsedMilliseconds = currentDate.getTime() - inputDate.getTime();
    const seconds = Math.floor(elapsedMilliseconds / 1000);

    if (seconds === 0) {
      return 'Just now';
    }
    else if (seconds < 60) {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (seconds < 31536000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (seconds < 31536000 * 2) {
      const years = Math.floor(seconds / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else {
      // If it's more than 2 years, return a simple date
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return inputDate.toLocaleDateString(undefined, options);
    }
  }

}
