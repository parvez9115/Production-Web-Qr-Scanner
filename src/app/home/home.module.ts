import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { SafePipe } from '../services/safe.pipe';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'qr-scanner',
    component: QrScannerComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxScannerQrcodeModule,
    jqxGridModule,
    RouterModule.forChild(routes),
  ],
  providers: [BarcodeScanner, SafePipe],
  declarations: [HomePage, QrScannerComponent, QrScannerComponent],
})
export class HomePageModule {}
