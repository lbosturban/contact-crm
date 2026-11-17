import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { ContactService } from './contact.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let contactService: ContactService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    // ContactService is created first to trigger the default category seeding.
    contactService = TestBed.inject(ContactService);
    service = TestBed.inject(CategoryService);
  });

  it('seeds default categories on first launch', () => {
    expect(service.total()).toBe(3);
  });

  it('creates a category with a generated id and timestamp', () => {
    const created = service.create({ name: 'Clients', color: '#ef4444' });
    expect(created?.name).toBe('Clients');
    expect(typeof created?.id).toBe('string');
    expect(typeof created?.createdAt).toBe('string');
    expect(service.total()).toBe(4);
  });

  it('refuses duplicate names, case-insensitively and trims input', () => {
    expect(service.create({ name: 'students', color: '#000000' })).toBeNull();
    expect(service.create({ name: '  Students  ', color: '#000000' })).toBeNull();
  });

  it('renames a category but rejects a name collision', () => {
    const first = service.categories()[0];
    const renamed = service.update(first.id, { name: 'Renamed' });
    expect(renamed?.name).toBe('Renamed');
    const second = service.create({ name: 'Collide', color: '#123123' })!;
    expect(service.update(second.id, { name: 'Renamed' })).toBeNull();
  });

  it('blocks deletion of a category that still has contacts', () => {
    const categoryId = contactService.contacts()[0].categoryId;
    if (!categoryId) {
      return;
    }
    expect(service.remove(categoryId)).toBe('inUse');
    expect(service.categories().some((category) => category.id === categoryId)).toBe(true);
  });

  it('allows deleting an empty category', () => {
    const created = service.create({ name: 'Empty', color: '#0ea5e9' })!;
    expect(service.remove(created.id)).toBe('removed');
    expect(service.total()).toBe(3);
  });

  it('returns notFound when deleting an unknown id', () => {
    expect(service.remove('unknown')).toBe('notFound');
  });
});
