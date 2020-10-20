import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {BFast} from 'bfastjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      const user = await BFast.auth().currentUser();
      if (user && user.role) {
        BFast.init({
          applicationId: user.applicationId,
          projectId: user.projectId
        }, user.projectId);
        resolve(true);
      } else {
        this.router.navigateByUrl('/login').catch();
        resolve(false);
      }
    });
  }

}
