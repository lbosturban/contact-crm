import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { Language } from '../services/i18n.service';

/**
 * Translate pipe for the minimal FR/EN i18n layer.
 * Updates automatically when the active language changes.
 */
@Pipe({ name: 't' })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string): string {
    return this.i18n.translate(key);
  }
}

export type { Language };
