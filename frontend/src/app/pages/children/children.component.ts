import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Child, ChildService } from '../../services/child.service';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Child Profiles</h1>
        <button (click)="showForm.set(true)" class="btn-primary text-sm" [disabled]="children().length >= 5">
          + Add Child
        </button>
      </div>

      @if (showForm()) {
        <div class="card mb-6">
          <h2 class="text-lg font-semibold mb-4">{{ editing() ? 'Edit' : 'Add' }} Child</h2>
          <div class="space-y-4">
            <input type="text" [(ngModel)]="form.name" name="name" placeholder="Child's name" class="input-field">
            <div class="grid grid-cols-2 gap-4">
              <input type="number" [(ngModel)]="form.age" name="age" placeholder="Age (1-12)" class="input-field" min="1" max="12" inputmode="numeric">
              <select [(ngModel)]="form.gender" name="gender" class="input-field">
                <option value="">Gender</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
                <option value="neutral">Prefer not to say</option>
              </select>
            </div>
            <input type="text" [(ngModel)]="interestsStr" name="interests" placeholder="Interests (comma separated: dinosaurs, space, music)" class="input-field">
            <input type="text" [(ngModel)]="form.favoriteAnimal" name="animal" placeholder="Favorite animal" class="input-field">
            <div class="flex gap-3">
              <button type="button" (click)="saveChild()" class="btn-primary text-sm" [disabled]="saving()">
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" (click)="cancelForm()" class="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        </div>
      }

      @if (children().length === 0 && !showForm()) {
        <div class="card text-center py-12">
          <p class="text-4xl mb-4">&#128118;</p>
          <p class="text-navy-300 mb-4">No children added yet. Add a child profile to start creating personalized stories!</p>
          <button (click)="showForm.set(true)" class="btn-primary">Add Your First Child</button>
        </div>
      }

      <div class="space-y-4">
        @for (child of children(); track child.id) {
          <div class="card flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-lg">{{ child.name }}</h3>
              <p class="text-navy-400 text-sm">Age {{ child.age }} · {{ child.gender || 'Not specified' }}</p>
              @if (child.interests?.length) {
                <div class="flex gap-2 mt-2 flex-wrap">
                  @for (interest of child.interests; track interest) {
                    <span class="text-xs bg-navy-700 px-2 py-1 rounded-full text-navy-300">{{ interest }}</span>
                  }
                </div>
              }
              @if (child.favoriteAnimal) {
                <p class="text-navy-400 text-sm mt-1">Favorite animal: {{ child.favoriteAnimal }}</p>
              }
            </div>
            <div class="flex gap-2">
              <button (click)="editChild(child)" class="btn-secondary text-sm">Edit</button>
              <button (click)="removeChild(child.id)" class="text-red-400 hover:text-red-300 text-sm px-3 py-2">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ChildrenComponent implements OnInit {
  children = signal<Child[]>([]);
  showForm = signal(false);
  editing = signal<string | null>(null);
  saving = signal(false);
  form = { name: '', age: null as number | null, gender: '', favoriteAnimal: '' };
  interestsStr = '';

  constructor(private childService: ChildService) {}

  ngOnInit() { this.loadChildren(); }

  loadChildren() {
    this.childService.getChildren().subscribe(c => this.children.set(c));
  }

  saveChild() {
    this.saving.set(true);
    const age = Number(this.form.age);
    if (!this.form.name?.trim() || !age || age < 1 || age > 12) return this.saving.set(false);
    const data = { ...this.form, name: this.form.name.trim(), age, interests: this.interestsStr.split(',').map(s => s.trim()).filter(Boolean) };
    const obs = this.editing()
      ? this.childService.updateChild(this.editing()!, data as any)
      : this.childService.createChild(data as any);
    obs.subscribe({
      next: () => { this.cancelForm(); this.loadChildren(); this.saving.set(false); },
      error: () => this.saving.set(false),
    });
  }

  editChild(child: Child) {
    this.form = { name: child.name, age: child.age, gender: child.gender || '', favoriteAnimal: child.favoriteAnimal || '' };
    this.interestsStr = child.interests?.join(', ') || '';
    this.editing.set(child.id);
    this.showForm.set(true);
  }

  removeChild(id: string) {
    if (confirm('Delete this child profile? Their stories will also be deleted.')) {
      this.childService.deleteChild(id).subscribe(() => this.loadChildren());
    }
  }

  cancelForm() {
    this.showForm.set(false);
    this.editing.set(null);
    this.form = { name: '', age: null, gender: '', favoriteAnimal: '' };
    this.interestsStr = '';
  }
}
