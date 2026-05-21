import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Child, ChildService } from '../../services/child.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  template: `
    <app-confirm-modal
      [visible]="modal().visible"
      [title]="modal().title"
      [message]="modal().message"
      [icon]="modal().icon"
      [confirmLabel]="modal().confirmLabel"
      [confirmDanger]="modal().danger"
      (confirmed)="onModalConfirm()"
      (cancelled)="modal.set({visible:false,title:'',message:'',icon:'',confirmLabel:'Yes',danger:false,action:null})">
    </app-confirm-modal>

    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Child Profiles</h1>
        <button (click)="startAdd()" class="btn-primary text-sm" [disabled]="children().length >= 5 || addingNew()">
          + Add Child
        </button>
      </div>

      <!-- Add new child form -->
      @if (addingNew()) {
        <div class="card mb-4 border border-story-purple/40">
          <h2 class="text-lg font-semibold mb-4">New Child</h2>
          <div class="space-y-4">
            <input type="text" [(ngModel)]="form.name" placeholder="Child's name" class="input-field">
            <div class="grid grid-cols-2 gap-4">
              <input type="number" [(ngModel)]="form.age" placeholder="Age (1-12)" class="input-field" min="1" max="12" inputmode="numeric">
              <select [(ngModel)]="form.gender" class="input-field">
                <option value="">Gender</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
                <option value="neutral">Prefer not to say</option>
              </select>
            </div>
            <input type="text" [(ngModel)]="interestsStr" placeholder="Interests (comma separated: dinosaurs, space, music)" class="input-field">
            <input type="text" [(ngModel)]="form.favoriteAnimal" placeholder="Favorite animal" class="input-field">
            <div class="flex gap-3">
              <button (click)="saveChild()" class="btn-primary text-sm" [disabled]="saving()">
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <button (click)="cancelAdd()" class="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        </div>
      }

      <!-- Empty state -->
      @if (children().length === 0 && !addingNew()) {
        <div class="card text-center py-12">
          <p class="text-4xl mb-4">&#128118;</p>
          <p class="text-navy-300 mb-4">No children added yet. Add a child profile to start creating personalized stories!</p>
          <button (click)="startAdd()" class="btn-primary">Add Your First Child</button>
        </div>
      }

      <!-- Children list -->
      <div class="space-y-3">
        @for (child of children(); track child.id) {
          <div class="card cursor-pointer transition-all duration-200"
               [class.border]="expandedId() === child.id"
               [class.border-story-purple]="expandedId() === child.id"
               (click)="toggleExpand(child, $event)">

            <!-- Collapsed view -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-10 h-10 rounded-full bg-story-purple/20 flex items-center justify-center text-lg flex-shrink-0">
                  {{ child.gender === 'girl' ? '&#128103;' : child.gender === 'boy' ? '&#128102;' : '&#128100;' }}
                </div>
                <div class="min-w-0">
                  <h3 class="font-semibold text-base">{{ child.name }}</h3>
                  <p class="text-navy-400 text-sm">Age {{ child.age }}
                    @if (child.gender && child.gender !== 'neutral') { · {{ child.gender }} }
                    @if (child.favoriteAnimal) { · &#128062; {{ child.favoriteAnimal }} }
                  </p>
                  @if (child.interests?.length) {
                    <div class="flex gap-1.5 mt-1.5 flex-wrap">
                      @for (interest of child.interests; track interest) {
                        <span class="text-xs bg-navy-700 px-2 py-0.5 rounded-full text-navy-300">{{ interest }}</span>
                      }
                    </div>
                  }
                </div>
              </div>
              <span class="text-navy-500 text-xs ml-3 flex-shrink-0 transition-transform duration-200"
                    [style.transform]="expandedId() === child.id ? 'rotate(180deg)' : 'rotate(0deg)'">
                &#9660;
              </span>
            </div>

            <!-- Inline edit form (expanded) -->
            @if (expandedId() === child.id) {
              <div class="mt-4 pt-4 border-t border-navy-700/50 space-y-3" (click)="$event.stopPropagation()">
                <input type="text" [(ngModel)]="form.name" placeholder="Child's name" class="input-field">
                <div class="grid grid-cols-2 gap-3">
                  <input type="number" [(ngModel)]="form.age" placeholder="Age (1-12)" class="input-field" min="1" max="12" inputmode="numeric">
                  <select [(ngModel)]="form.gender" class="input-field">
                    <option value="">Gender</option>
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                    <option value="neutral">Prefer not to say</option>
                  </select>
                </div>
                <input type="text" [(ngModel)]="interestsStr" placeholder="Interests (comma separated)" class="input-field">
                <input type="text" [(ngModel)]="form.favoriteAnimal" placeholder="Favorite animal" class="input-field">
                <div class="flex items-center justify-between">
                  <div class="flex gap-2">
                    <button (click)="saveChild()" class="btn-primary text-sm" [disabled]="saving()">
                      {{ saving() ? 'Saving...' : 'Save changes' }}
                    </button>
                    <button (click)="collapse()" class="btn-secondary text-sm">Cancel</button>
                  </div>
                  <button (click)="removeChild(child.id)" class="text-red-400 hover:text-red-300 text-sm px-3 py-2 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ChildrenComponent implements OnInit {
  children = signal<Child[]>([]);
  expandedId = signal<string | null>(null);
  addingNew = signal(false);
  saving = signal(false);
  form = { name: '', age: null as number | null, gender: '', favoriteAnimal: '' };
  interestsStr = '';
  modal = signal<{visible:boolean,title:string,message:string,icon:string,confirmLabel:string,danger:boolean,action:(() => void)|null}>({
    visible: false, title: '', message: '', icon: '', confirmLabel: 'Yes', danger: false, action: null
  });

  constructor(private childService: ChildService, private router: Router) {}

  ngOnInit() { this.loadChildren(); }

  loadChildren() {
    this.childService.getChildren().subscribe(c => this.children.set(c));
  }

  startAdd() {
    this.expandedId.set(null);
    this.resetForm();
    this.addingNew.set(true);
  }

  cancelAdd() {
    this.addingNew.set(false);
    this.resetForm();
  }

  toggleExpand(child: Child, event: Event) {
    if (this.expandedId() === child.id) {
      this.collapse();
    } else {
      this.addingNew.set(false);
      this.expandedId.set(child.id);
      this.form = {
        name: child.name,
        age: child.age,
        gender: child.gender || '',
        favoriteAnimal: child.favoriteAnimal || '',
      };
      this.interestsStr = (child.interests || []).join(', ');
    }
  }

  collapse() {
    this.expandedId.set(null);
    this.resetForm();
  }

  resetForm() {
    this.form = { name: '', age: null, gender: '', favoriteAnimal: '' };
    this.interestsStr = '';
  }

  saveChild() {
    this.saving.set(true);
    const age = Number(this.form.age);
    if (!this.form.name?.trim() || !age || age < 1 || age > 12) {
      this.saving.set(false);
      return;
    }
    const data = {
      ...this.form,
      name: this.form.name.trim(),
      age,
      interests: this.interestsStr.split(',').map(s => s.trim()).filter(Boolean)
    };
    const editingId = this.expandedId();
    const obs = editingId
      ? this.childService.updateChild(editingId, data as any)
      : this.childService.createChild(data as any);

    obs.subscribe({
      next: () => {
        this.collapse();
        this.cancelAdd();
        this.loadChildren();
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  removeChild(id: string) {
    this.modal.set({
      visible: true,
      title: 'Delete child profile?',
      message: 'This will permanently remove the child profile.',
      icon: '🗑️',
      confirmLabel: 'Delete',
      danger: true,
      action: () => {
        this.childService.deleteChild(id).subscribe(() => {
          this.collapse();
          this.loadChildren();
        });
      }
    });
  }

  onModalConfirm() {
    this.modal().action?.();
    this.modal.set({ visible: false, title: '', message: '', icon: '', confirmLabel: 'Yes', danger: false, action: null });
  }
}
