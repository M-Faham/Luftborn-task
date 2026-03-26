import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';
import { RequestCancelInterceptor } from './interceptors/auto-cancel.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { materialize } from 'rxjs';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { SplashScreenService } from './services/splash-screen.service';
@NgModule({
  declarations: [],
  providers: [
    providePrimeNG({
      theme: {
        preset: materialize,
      },
    }),
    provideHttpClient(
      withInterceptors([ErrorInterceptor, loadingInterceptor, RequestCancelInterceptor]),
      withFetch(),
    ),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
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
