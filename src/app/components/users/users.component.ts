import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user';
import { UserApiService } from '../../services/user.api.service';
import { BehaviorSubject, catchError, finalize, tap } from 'rxjs';
import { UpdateUserInput } from '../../models/user/updateUserInput';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatSelectModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private userApiService = inject(UserApiService);
  private snackBar = inject(MatSnackBar);
  
  private usersSubject = new BehaviorSubject<User[]>([]);
  users = this.usersSubject.asObservable();
  

  displayedColumns: string[] = ['id', 'name', 'email', 'gender', 'status', 'actions'];
  
  loading = false;
  
  editingCell: { userId: number | null, property: string | null } = { userId: null, property: null };
  editValue: string = '';
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  
  loadUsers(): void {
    this.loading = true;
    this.userApiService.getUsers()
      .pipe(
        tap(users => this.usersSubject.next(users)),
        catchError(error => {
          this.snackBar.open('Error loading users: ' + error.message, 'Close', { duration: 5000 });
          return [];
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }
  
  startEdit(user: User, property: string): void {
    if (property === 'id') return;
    
    this.editingCell = { userId: user.id, property };
    this.editValue = String(user[property as keyof User]);
  }
  
  cancelEdit(): void {
    this.editingCell = { userId: null, property: null };
  }
  
  saveEdit(user: User): void {
    if (!this.editingCell.property) return;
    
    const prop = this.editingCell.property as keyof UpdateUserInput;
    
    if (!this.editValue.trim()) {
      this.snackBar.open('Value cannot be empty', 'Close', { duration: 3000 });
      return;
    }

    const updateData: UpdateUserInput = {
      [prop]: this.editValue
    } as unknown as UpdateUserInput;
    
    this.loading = true;
    this.userApiService.updateUser(user.id, updateData)
      .pipe(
        tap(updatedUser => {
          const currentUsers = this.usersSubject.value;
          const updatedUsers = currentUsers.map(u => 
            u.id === updatedUser.id ? updatedUser : u
          );
          this.usersSubject.next(updatedUsers);
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        }),
        catchError(error => {
          this.snackBar.open('Error updating user: ' + error.message, 'Close', { duration: 5000 });
          return [];
        }),
        finalize(() => {
          this.loading = false;
          this.cancelEdit();
        })
      )
      .subscribe();
  }
  
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      this.userApiService.deleteUser(id)
        .pipe(
          tap(() => {
            const currentUsers = this.usersSubject.value;
            const updatedUsers = currentUsers.filter(user => user.id !== id);
            this.usersSubject.next(updatedUsers);
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          }),
          catchError(error => {
            this.snackBar.open('Error deleting user: ' + error.message, 'Close', { duration: 5000 });
            return [];
          }),
          finalize(() => this.loading = false)
        )
        .subscribe();
    }
  }
}
