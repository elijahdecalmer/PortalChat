import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeAdmins',
  standalone: true // Add this to make the pipe standalone
})
export class ExcludeAdminsPipe implements PipeTransform {

  transform(members: any[], admins: any[]): any[] {
    if (!members || !admins) return members;

    // Filter members to exclude admins
    return members.filter(member => !admins.some(admin => admin._id === member._id));
  }
}
