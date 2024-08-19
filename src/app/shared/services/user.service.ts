import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL_LINK = environment.apiUrl + '/api/v1';

  userId!: string;
  userInfo!: User;

  private avatarPreviewSource = new BehaviorSubject<string | null>(null);
  avatarPreview = this.avatarPreviewSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getUserId().then((userId) => {
      if (userId) {
        this.userId = userId;
      }
    });
  }

  getUserProfileInfo(userId: string): Observable<any> {
    return this.http.get<any>(`${this.URL_LINK}/users/${userId}`).pipe(
      tap((userInfo) => {
        if (this.userId === userInfo.id) {
          this.userInfo = userInfo;
         // this.userUpdatedInformation.emit(userInfo);
        }
      }));
  }

  getProfileImageAsBase64(userId: string): Observable<string> {
    return this.http.get(`${this.URL_LINK}/users/image/${userId}`, { responseType: 'blob' }).pipe(
      switchMap(blob => this.convertBlobToBase64(blob))
    );
  }

  getSuggestedUsers(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.URL_LINK}/users/suggested-users/${userId}`);
  }

  searchUsers(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_LINK}/users/search/users`, { params: { name: term.toLowerCase() } });
  }

  followUser(followerId: string, followingId: string): Observable<any> {
    return this.http.put(`${this.URL_LINK}/users/${followerId}/follow/${followingId}`, null);
  }

  unfollowUser(followerId: string, followingId: string): Observable<any> {
    return this.http.put(`${this.URL_LINK}/users/${followerId}/unfollow/${followingId}`, null);
  }

  updateProfile(userId: string, user: any): Observable<any> {
    return this.http.put(`${this.URL_LINK}/users/${userId}/update`, user);
  }

  updateAvatarPreview(file: File): void {
    // Revoke the previous URL to avoid memory leaks
    const currentPreview = this.avatarPreviewSource.getValue();
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    this.avatarPreviewSource.next(previewUrl);
  }

  private convertBlobToBase64(blob: Blob): Observable<string> {
    const reader = new FileReader();
    const base64Observable = new Observable<string>((observer) => {
      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
    });
    reader.readAsDataURL(blob);
    return base64Observable;
  }

}
