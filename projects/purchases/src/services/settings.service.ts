import {Injectable} from '@angular/core';
import {UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  constructor(private readonly userService: UserService) {
  }

  async getCustomerProjectId(): Promise<string> {
    try {
      const activeShop = await this.userService.getCurrentShop();
      if (!activeShop) {
        throw new Error('No user in local storage');
      }
      return activeShop.projectId;
    } catch (e) {
      throw {message: 'Fails to get project id', reason: e.toString()};
    }
  }
}
