import { Routes } from '@angular/router';
import { canDeactivateGuard } from './core/guards/can-deactivate.guard';
import { contactResolver, categoryResolver } from './core/resolvers/entity.resolver';

/**
 * Application shell routes. Feature pages are lazy-loaded via
 * loadComponent; detail and edit routes are backed by resolvers that
 * preload the entity and redirect when the id is unknown.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Contact CRM — Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardPage),
  },
  {
    path: 'contacts',
    title: 'Contact CRM — Contacts',
    loadComponent: () =>
      import('./features/contacts/contact-list/contact-list').then((m) => m.ContactListPage),
  },
  {
    path: 'contacts/new',
    title: 'Contact CRM — New contact',
    loadComponent: () =>
      import('./features/contacts/contact-form/contact-form').then((m) => m.ContactFormPage),
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: 'contacts/:id',
    title: 'Contact CRM — Contact detail',
    loadComponent: () =>
      import('./features/contacts/contact-detail/contact-detail').then((m) => m.ContactDetailPage),
    resolve: { contact: contactResolver },
  },
  {
    path: 'contacts/:id/edit',
    title: 'Contact CRM — Edit contact',
    loadComponent: () =>
      import('./features/contacts/contact-form/contact-form').then((m) => m.ContactFormPage),
    resolve: { contact: contactResolver },
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: 'categories',
    title: 'Contact CRM — Categories',
    loadComponent: () =>
      import('./features/categories/category-list/category-list').then((m) => m.CategoryListPage),
  },
  {
    path: 'categories/new',
    title: 'Contact CRM — New category',
    loadComponent: () =>
      import('./features/categories/category-form/category-form').then((m) => m.CategoryFormPage),
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: 'categories/:id',
    title: 'Contact CRM — Category',
    loadComponent: () =>
      import('./features/categories/category-detail/category-detail').then(
        (m) => m.CategoryDetailPage,
      ),
    resolve: { category: categoryResolver },
  },
  {
    path: 'categories/:id/edit',
    title: 'Contact CRM — Edit category',
    loadComponent: () =>
      import('./features/categories/category-form/category-form').then((m) => m.CategoryFormPage),
    resolve: { category: categoryResolver },
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: 'favorites',
    title: 'Contact CRM — Favorites',
    loadComponent: () => import('./features/favorites/favorites').then((m) => m.FavoritesPage),
  },
  { path: '**', redirectTo: '' },
];
