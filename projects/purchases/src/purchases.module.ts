import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ReactiveFormsModule} from '@angular/forms';
import {PurchasePageComponent} from './pages/purchase.page';
import {PurchaseDetailsComponent} from './components/details.component';
import {CreatePageComponent} from './pages/create.page';
import {LibModule} from '@smartstocktz/core-libs';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {DialogDeleteComponent, StockDetailsComponent} from './components/stock.component';
import {DialogSupplierDeleteComponent, DialogSupplierNewComponent, SuppliersComponent} from './components/suppliers.component';
import {VerifyEMailDialogComponent} from './components/verify-dialog.component';
import {RouterModule, ROUTES, Routes} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {IndexPage} from './pages/index.page';
import {MatDialogModule} from '@angular/material/dialog';
import {ProductDetailComponent} from './components/product-details-component';
import {ProductSearchDialogComponent} from './components/product-search-dialog.component';
import {CdkTableModule} from '@angular/cdk/table';
import {PurchaseDetailsModalComponent} from './components/purchase-details.component';
import {IncompletePurchasesTableComponent} from './components/incomplete-purchases-list.component';
import {AddReturnSheetComponent} from './components/add-returns-sheet.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatListModule} from '@angular/material/list';
import {PurchaseNavigationService} from './services/purchase-navigation.service';

const routes: Routes = [
  {path: '', component: IndexPage},
  {path: 'reference', component: PurchasePageComponent},
  {path: 'create', component: CreatePageComponent},
];

@NgModule({
  declarations: [
    PurchaseDetailsModalComponent,
    IncompletePurchasesTableComponent,
    AddReturnSheetComponent,
    ProductSearchDialogComponent,
    ProductDetailComponent,
    PurchasePageComponent,
    PurchaseDetailsComponent,
    CreatePageComponent,
    DialogDeleteComponent,
    SuppliersComponent,
    DialogSupplierNewComponent,
    StockDetailsComponent,
    DialogSupplierDeleteComponent,
    VerifyEMailDialogComponent,
    IndexPage,
  ],
  imports: [
    CommonModule,
    {
      ngModule: RouterModule,
      providers: [
        {
          provide: ROUTES,
          multi: true,
          useValue: routes,
        },
      ],
    },
    CdkTableModule,
    ScrollingModule,
    MatSidenavModule,
    LibModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    HttpClientModule,
    MatNativeDateModule,
    MatDialogModule,
    MatRippleModule,
    MatProgressBarModule,
    MatSortModule,
    MatListModule
  ],
})
export class PurchasesModule {
  constructor(private readonly purchaseNavigation: PurchaseNavigationService) {
    this.purchaseNavigation.init();
    this.purchaseNavigation.selected();
  }
}
