import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';

export class TranslateServerLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const filePath = join(process.cwd(), 'src', 'assets', 'i18n', `${lang}.json`);
    try {
      const content = readFileSync(filePath, 'utf-8');
      return of(JSON.parse(content) as TranslationObject);
    } catch {
      return of({} as TranslationObject);
    }
  }
}
