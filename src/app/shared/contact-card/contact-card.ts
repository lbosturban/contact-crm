import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../core/models/contact.model';
import { CategoryService } from '../../core/services/category.service';
import { I18nService } from '../../core/services/i18n.service';
import { FullNamePipe } from '../../core/pipes/full-name.pipe';
import { InitialsPipe } from '../../core/pipes/initials.pipe';
import { HighlightPipe } from '../../core/pipes/highlight.pipe';
import { JobLinePipe } from '../../core/pipes/job-line.pipe';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-contact-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FullNamePipe, InitialsPipe, HighlightPipe, JobLinePipe, TranslatePipe],
  template: `
    <article class="contact-card" role="listitem">
      <div class="card-head">
        <span class="avatar" aria-hidden="true">{{
          contact().firstName | initials: contact().lastName
        }}</span>
        <h3 class="card-name">
          <a [routerLink]="['/contacts', contact().id]">
            {{ contact().firstName | fullName: contact().lastName | highlight: searchTerm() }}
          </a>
        </h3>
        <button
          type="button"
          class="star"
          [class.active]="contact().favorite"
          [attr.aria-pressed]="contact().favorite"
          [attr.aria-label]="starLabel()"
          (click)="toggleFavorite.emit(contact().id)"
        >
          ★
        </button>
      </div>

      <p class="card-role">
        @if (contact().jobTitle || contact().company) {
          {{ contact().jobTitle | jobLine: contact().company }}
        }
      </p>

      <ul class="card-links">
        <li tabindex="0">{{ contact().email }}</li>
        <li tabindex="0">{{ contact().phone }}</li>
      </ul>

      @if (category(); as category) {
        <span class="badge" [style.background-color]="category.color">{{ category.name }}</span>
      } @else {
        <span class="badge badge-muted">{{ 'contacts.uncategorized' | t }}</span>
      }

      <div class="card-actions">
        <a class="btn btn-ghost" [routerLink]="['/contacts', contact().id]">{{
          'contacts.detail' | t
        }}</a>
        <a class="btn btn-ghost" [routerLink]="['/contacts', contact().id, 'edit']">{{
          'contacts.edit' | t
        }}</a>
        <button type="button" class="btn btn-danger" (click)="delete.emit(contact().id)">
          {{ 'contacts.delete' | t }}
        </button>
      </div>
    </article>
  `,
})
export class ContactCard {
  private readonly categoryService = inject(CategoryService);

  readonly contact = input.required<Contact>();
  readonly searchTerm = input<string>('');
  readonly toggleFavorite = output<string>();
  readonly delete = output<string>();

  private readonly i18n = inject(I18nService);

  readonly category = computed(() =>
    this.categoryService.categories().find((entry) => entry.id === this.contact().categoryId),
  );

  readonly starLabel = computed(() =>
    this.i18n.translate(
      this.contact().favorite ? 'contacts.removeFavorite' : 'contacts.addFavorite',
    ),
  );
}
