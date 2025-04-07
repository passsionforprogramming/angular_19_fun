import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UpdateUserInput } from '../models/user/updateUserInput';
import { CreateUserInput } from '../models/user/createUserInput';

const API_URL = 'https://gorest.co.in/public/v2/users';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL);
  }

  createUser(data: CreateUserInput): Observable<User> {
    console.log('Creating user with data:', data);
    return this.http.post<User>(API_URL, data);
  }

  updateUser(id: number, data: UpdateUserInput): Observable<User> {
    return this.http.put<User>(`${API_URL}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
