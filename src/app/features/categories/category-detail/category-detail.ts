import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { ContactService } from '../../../core/services/contact.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { ContactCard } from '../../../shared/contact-card/contact-card';

/** Lists every contact belonging to one category (resolved by categoryResolver). */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, ContactCard],
  template: `
    <section class="page">
      <nav class="breadcrumb">
        <a routerLink="/categories">{{ 'categories.title' | t }}</a>
        <span aria-hidden="true">/</span>
        <span>{{ category().name }}</span>
      </nav>

      <header class="page-header">
        <div>
          <h1>
            <span class="dot dot-lg" [style.background-color]="category().color"></span>
            {{ 'categories.contactsIn' | t }} {{ category().name }}
          </h1>
          <p class="page-subtitle">{{ contacts().length }} {{ 'contacts.count' | t }}</p>
        </div>
      </header>

      @if (contacts().length === 0) {
        <p class="empty-state">{{ 'categories.emptyDetail' | t }}</p>
      } @else {
        <div class="card-grid" role="list">
          @for (contact of contacts(); track contact.id) {
            <app-contact-card [contact]="contact" />
          }
        </div>
      }
    </section>
  `,
  styles: `
    .dot-lg {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 6px;
    }

    .empty-state {
      text-align: center;
      color: var(--text-muted);
      padding: var(--space-8) 0;
    }
  `,
})
export class CategoryDetailPage {
  protected readonly contactService = inject(ContactService);

  /** Resolved by categoryResolver and bound via withComponentInputBinding. */
  readonly category = input.required<Category>();

  protected readonly contacts = computed(() =>
    this.contactService.getByCategory(this.category().id),
  );
}
