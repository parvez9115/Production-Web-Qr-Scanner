import {
  Component,
  OnInit,
  Type,
  ViewChild,
  enableProdMode,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { AjaxService } from '../services/ajax.service';
import { CommonService } from '../services/common.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Router } from '@angular/router';
import {
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeService,
  ScannerQRCodeConfig,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';

import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ServerUrl } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('myGrid', { static: false }) myGrid: jqxGridComponent;
  columns: any;
  source: { localdata: any };
  dataAdapter: any;
  renderer: (row: number, column: any, value: string) => string;
  myPlatform: any;

  scanData: any;
  tableData = [];
  button: boolean;
  productionForm: FormGroup;
  serial: number;
  devicemodellist: any;
  imeidetail: any;
  isshow = false;
  Qty: number;
  scanActive: boolean = false;

  encodedData: '';
  encodeData: any;
  inputData: any;
  barcodeData: any;
  serialdis: boolean = true;
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action') action: NgxScannerQrcodeComponent;
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth, // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      },
    },
    // canvasStyles: {
    //   font: '17px serif',
    //   lineWidth: 1,
    //   fillStyle: '#ff001854',
    //   strokeStyle: '#ff0018c7',
    // } as any // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
  };
  static QrScannerComponent: any[] | Type<any>;
  value: any;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private ajaxService: AjaxService,
    private commonService: CommonService,
    private barcodeScanner: BarcodeScanner,
    private menu: MenuController,
    private qrcode: NgxScannerQrcodeService,

    private router: Router
  ) {}

  cancelBtn() {
    this.modalController.dismiss();
  }

  createForm() {
    this.productionForm = this.formBuilder.group({
      devicemodel: ['', Validators.required],
      SerialNo: [''],
    });
  }

  reset() {
    this.productionForm.patchValue({
      devicemodel: '',
      SerialNo: this.serial,
    });
    this.isshow = false;
    this.tableData = [];
    this.Qty = undefined;
    this.source = { localdata: this.tableData };
    this.dataAdapter = new jqx.dataAdapter(this.source);
  }

  startScan() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        console.log('Barcode data', barcodeData);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  getModellist() {
    var url = ServerUrl.live + '/esim/getModel';
    this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
      this.devicemodellist = res;
    });
  }

  getdata() {
    let show = true;
    this.scanData = this.value.split(',');
    var qrValue = {
      imei: this.scanData[0],
      iccidno: this.scanData[1],
      vltdsno: this.scanData[2],
    };
    if (this.myGrid)
      this.myGrid['attrSource']['originaldata'].map((res) => {
        if (res.iccidno1 == this.scanData[1]) {
          this.commonService.presentToast('Iccidno No Already Assigned');
          show = false;
        } else if (res.vltdsno == this.scanData[2]) {
          this.commonService.presentToast('VLTD No Already Assigned');
          show = false;
        } else if (res.imei == this.scanData[0]) {
          this.commonService.presentToast('Imei No Already Assigned');
          show = false;
        }
      });

    if (show) {
      {
        const url =
          ServerUrl.live +
          '/esim/getSingleEsimManufactureByImei?companyid=apm' +
          '&iccidno=' +
          this.scanData[1] +
          '&imei=' +
          this.scanData[0] +
          '&vltdsno=' +
          this.scanData[2];

        this.ajaxService.ajaxGetPerference(url).subscribe((res) => {
          this.imeidetail = res;
          if (res.message == 'Invalid ICCID') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'ICCID Already Exists') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'Invalid VLTD No') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'VLTD No Already Exists') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'Invalid IMEI') {
            this.commonService.presentToast(res.message);
          } else if (res.message == 'IMEI Already Exists') {
            this.commonService.presentToast(res.message);
          } else {
            var detailValue = {
              imei: this.imeidetail.imei,
              iccidno1: this.imeidetail.iccidno1,
              iccidno2: this.imeidetail.iccidno2,
              vltdsno: this.imeidetail.vltdsno,
            };
            this.isshow = true;
            this.tableData.push(detailValue);
            this.Qty = this.tableData.length;
            this.renderer = (row: number, column: any, value: string) => {
              if (value == '' || null || undefined || value == ',') {
                return '--';
              } else {
                return (
                  '<span  style="line-height:32px;font-size:11px;color:darkblue;margin:auto;">' +
                  value +
                  '</span>'
                );
              }
            };
            this.source = { localdata: this.tableData };
            this.dataAdapter = new jqx.dataAdapter(this.source);
            this.columns = [
              {
                text: 'Iccid Number',
                datafield: 'iccidno1',
                cellsrenderer: this.renderer,
                cellsalign: 'center',
                align: 'center',
                width: 150,
              },
              {
                text: 'Imei Number',
                datafield: 'imei',
                cellsrenderer: this.renderer,
                cellsalign: 'center',
                align: 'center',
                width: 130,
              },
              {
                text: 'VLTD No',
                datafield: 'vltdsno',
                cellsrenderer: this.renderer,
                cellsalign: 'center',
                align: 'center',
                width: 140,
              },
              {
                text: 'Delete',
                datafield: 'Delete',
                columntype: 'button',
                cellsalign: 'center',
                align: 'center',
                width: 90,
                cellsrenderer: (): string => {
                  return this.myPlatform == 'desktop'
                    ? 'Delete'
                    : '<button>Delete</button>';
                },
                buttonclick: (row): void => {
                  this.deleteAnalogRow(row);
                },
              },
            ];
          }
        });
      }
    }
  }

  deleteAnalogRow(row: any) {
    console.log('hsh');
    this.tableData.splice(row, 1);
    this.source = { localdata: this.tableData };
    this.Qty = this.tableData.length;
    this.dataAdapter = new jqx.dataAdapter(this.source);
  }

  async qrscan() {
    const modal = await this.modalController.create({
      component: QrScannerComponent,
      cssClass: 'validityform',
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      this.value = data.data.data;
      this.getdata();
      this.value = '';
    });
    return await modal.present();
  }

  submitBtn() {
    this.button = true;
    var data;
    data = {
      companyid: 'apm',
      branchid: 'apm',
      serialno: this.serial,
      quantity: this.Qty,
      createdby: 'apm-sa',
      salesdetail: this.tableData,
      devicemodel: this.productionForm.value.devicemodel,
    };
    const url =
      ServerUrl.live +
      '/esim/saveEsimProduction?companyid=' +
      localStorage.getItem('corpId') +
      '&branchid=' +
      localStorage.getItem('corpId');
    this.ajaxService.ajaxPostWithBody(url, data).subscribe((res) => {
      if (res.message == 'Production Saved Successfully') {
        this.commonService.presentToast('Box Detail Added Succesfully');
        this.modalController.dismiss({ data: 'Box Detail Added Succesfully' });
        this.reset();
        this.button = false;
      } else {
        this.button = false;
        this.commonService.presentToast(res.message);
      }
    });
  }

  ngOnInit() {
    this.startScan();
    this.myPlatform = this.platform.platforms()[0];
    if (this.myPlatform == 'tablet') {
      this.myPlatform = 'desktop';
    }
    const url =
      ServerUrl.live +
      '/esim/generateSerialno?companyid=' +
      localStorage.getItem('corpId');
    this.ajaxService.ajaxGet(url).subscribe((res) => {
      this.serial = res;
    });
    this.createForm();
    this.getModellist();
  }
}
