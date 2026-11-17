import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { CategoryService } from '../../../core/services/category.service';
import { Contact } from '../../../core/models/contact.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { FullNamePipe } from '../../../core/pipes/full-name.pipe';
import { InitialsPipe } from '../../../core/pipes/initials.pipe';
import { JobLinePipe } from '../../../core/pipes/job-line.pipe';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

/** Contact detail view, fed by contactResolver (route data → input binding). */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    TranslatePipe,
    FullNamePipe,
    InitialsPipe,
    JobLinePipe,
    ConfirmDialog,
  ],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetailPage {
  private readonly router = inject(Router);
  protected readonly contactService = inject(ContactService);
  protected readonly categoryService = inject(CategoryService);

  /** Resolved by contactResolver and bound thanks to withComponentInputBinding. */
  readonly contact = input.required<Contact>();

  protected readonly deleteRequested = signal(false);

  toggleFavorite(): void {
    this.contactService.toggleFavorite(this.contact().id);
  }

  requestDelete(): void {
    this.deleteRequested.set(true);
  }

  confirmDelete(): void {
    void this.contactService.remove(this.contact().id);
    this.deleteRequested.set(false);
    void this.router.navigateByUrl('/contacts');
  }

  cancelDelete(): void {
    this.deleteRequested.set(false);
  }

  category() {
    return this.categoryService
      .categories()
      .find((entry) => entry.id === this.contact().categoryId);
  }
}
