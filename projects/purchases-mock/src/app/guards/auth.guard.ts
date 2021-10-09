import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {auth, init} from 'bfast';
import {getDaasAddress, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router,
              private readonly userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      const user = await auth().currentUser();
      const shops = await this.userService.getShops(user);
      if (user && user.role) {
        init({
          applicationId: shops[0].applicationId,
          projectId: shops[0].projectId,
          databaseURL: getDaasAddress(shops[0]),
          functionsURL: getDaasAddress(shops[0])
        }, shops[0].projectId);
        resolve(true);
      } else {
        this.router.navigateByUrl('/login').catch();
        resolve(false);
      }
    });
  }

}
