import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { cachingInterceptor } from './interceptors/caching.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { SplashScreenService } from './services/splash-screen.service';
@NgModule({
  declarations: [],
  providers: [
    provideHttpClient(
      withInterceptors([cachingInterceptor, ErrorInterceptor, loadingInterceptor]),
      withFetch(),
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: 'i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    DialogService,
    MessageService,
  ],
})
export class CoreModule {
  constructor(private readonly splashScreen: SplashScreenService) {}
}
