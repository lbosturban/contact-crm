import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

/** Local pagination bar. Zero dependency: the page slice is computed by the parent. */
@Component({
  selector: 'app-pager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    @if (pageCount() > 1) {
      <nav class="pager" aria-label="Pagination">
        <button
          type="button"
          class="btn btn-ghost"
          [disabled]="page() === 1"
          (click)="pageChange.emit(page() - 1)"
        >
          {{ 'pagination.prev' | t }}
        </button>
        <span class="pager-status">
          {{ 'pagination.page' | t }} {{ page() }} {{ 'pagination.of' | t }} {{ pageCount() }}
        </span>
        <button
          type="button"
          class="btn btn-ghost"
          [disabled]="page() >= pageCount()"
          (click)="pageChange.emit(page() + 1)"
        >
          {{ 'pagination.next' | t }}
        </button>
      </nav>
    }
  `,
})
export class Pager {
  /** One-based current page. */
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalItems = input.required<number>();

  readonly pageChange = output<number>();

  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));
}
