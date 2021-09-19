import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupplierService} from '../services/supplier.service';
import {SupplierModel} from '../models/supplier.model';


@Injectable({
  providedIn: 'root'
})
export class SupplierState {
  suppliers = new BehaviorSubject<SupplierModel[]>([]);
  fetchSupplierProgress = new BehaviorSubject(false);

  constructor(private readonly supplierService: SupplierService,
              private readonly snack: MatSnackBar) {
  }

  private message(reason) {
    this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
      duration: 2000
    });
  }

  fetchSuppliers(): void {
    this.fetchSupplierProgress.next(true);
    this.supplierService.fetchAllSuppliers().then(value => {
      if (Array.isArray(value)) {
        this.suppliers.next(value);
      }
    }).catch(reason => {
      this.message(reason);
    }).finally(() => {
      this.fetchSupplierProgress.next(false);
    });
  }

  search(enteredName: string) {

  }
}
