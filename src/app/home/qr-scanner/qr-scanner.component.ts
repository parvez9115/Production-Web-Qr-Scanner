import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeService,
  ScannerQRCodeConfig,
  ScannerQRCodeDevice,
  ScannerQRCodeResult,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import { delay } from 'rxjs';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {
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

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action') action: NgxScannerQrcodeComponent;
  constructor(
    private qrcode: NgxScannerQrcodeService,
    private modalController: ModalController
  ) {}

  ngAfterViewInit(): void {
    this.action.isReady.pipe(delay(1000)).subscribe(() => {
      this.handle(this.action, 'start');
    });
  }

  cancelBtn() {
    this.modalController.dismiss();
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    e?.length && action && action.pause(); // Detect once and pause scan!

    this.modalController.dismiss({
      data: e[0].value,
    });
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: ScannerQRCodeDevice[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      ); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onSelects(files: any): void {
    this.qrcode
      .loadFiles(files)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
  }

  public onSelects2(files: any): void {
    this.qrcode
      .loadFilesToScan(files, this.config)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        console.log(res);
        this.qrCodeResult2 = res;
      });
  }

  ngOnInit() {}
}
