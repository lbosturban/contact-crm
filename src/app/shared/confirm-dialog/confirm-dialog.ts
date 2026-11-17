import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

/**
 * Accessible confirmation dialog. Rendered by parent pages when a signal
 * state is set; emits `confirmed` or `cancelled` according to the user
 * choice. Focus is trapped by the modal CSS overlay, escapable via Escape.
 */
@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div
      class="dialog-overlay"
      role="presentation"
      (click)="cancelled.emit()"
      (keydown.escape)="cancelled.emit()"
    >
      <div
        class="dialog"
        role="alertdialog"
        aria-modal="true"
        [attr.aria-label]="title()"
        (click)="$event.stopPropagation()"
      >
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" (click)="cancelled.emit()">
            {{ 'confirm.no' | t }}
          </button>
          <button type="button" class="btn btn-danger" (click)="confirmed.emit()">
            {{ 'confirm.yes' | t }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
