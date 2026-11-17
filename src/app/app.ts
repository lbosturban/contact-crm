import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { TranslatePipe } from './core/pipes/translate.pipe';

/** Application shell: header with navigation, router outlet and footer. */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly themeService = inject(ThemeService);
  protected readonly i18n = inject(I18nService);
}
