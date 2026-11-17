import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { I18nService } from '../../../core/services/i18n.service';
import { Deactivatable } from '../../../core/guards/can-deactivate.guard';
import { AsyncValidatorFn } from '@angular/forms';
import { hexColorValidator } from '../../../core/validators/custom-validators';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { AutofocusDirective } from '../../../core/directives/autofocus.directive';
import { map, of } from 'rxjs';
/** Shared create/edit page for categories, with async duplicate-name check. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, AutofocusDirective],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryFormPage implements Deactivatable {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly i18n = inject(I18nService);

  /** Preloaded by categoryResolver on the /categories/:id/edit route. */
  private readonly editing = this.route.snapshot.data['category'] as
    { id: string; name: string; color: string } | undefined;

  protected readonly isEdit = this.editing !== undefined;
  private readonly saved = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.group({
    name: [
      this.editing?.name ?? '',
      [Validators.required, Validators.maxLength(40)],
      [this.uniqueNameValidator()],
    ],
    color: [this.editing?.color ?? '#2563eb', [Validators.required, hexColorValidator()]],
  });

  /** Rejects a name already used by another category. */
  private uniqueNameValidator(): AsyncValidatorFn {
    return (control) => {
      const value = String(control.value ?? '').trim();
      if (!value) {
        return of(null);
      }
      return of(null).pipe(
        map(() =>
          this.categoryService.exists(value, this.editing?.id) ? { duplicate: true } : null,
        ),
      );
    };
  }

  canDeactivate(): boolean {
    return !this.form.dirty || this.saved();
  }

  hasError(name: 'name' | 'color'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched || this.submitAttempted());
  }

  errorFor(name: 'name' | 'color'): string | null {
    const { errors } = this.form.controls[name];
    if (!errors) {
      return null;
    }
    if (errors['duplicate']) {
      return this.i18n.translate('categories.duplicate');
    }
    return this.i18n.translate('form.required');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }
    const { name, color } = this.form.getRawValue();
    const draft = { name: name.trim(), color };
    const category =
      this.isEdit && this.editing
        ? this.categoryService.update(this.editing.id, draft)
        : this.categoryService.create(draft);
    if (!category) {
      this.errorMessage.set(this.i18n.translate('categories.duplicate'));
      return;
    }
    this.saved.set(true);
    void this.router.navigateByUrl('/categories');
  }

  onCancel(): void {
    void this.router.navigateByUrl('/categories');
  }
}
