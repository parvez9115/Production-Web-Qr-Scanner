import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qr.app',
  appName: 'qr scanner',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
