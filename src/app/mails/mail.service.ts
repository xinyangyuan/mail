import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Mail } from './mail.model';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000/api/mail/';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  // Attributes
  private mails: Mail[] = [];
  private mailsUpdatedListener = new Subject<Mail[]>();

  // Constructor
  constructor(private http: HttpClient) {}

  /*
    Method: get mails from backend
  */
  // getMails() {
  //   this.http
  //     .get(BACKEND_URL)
  //     .pipe(map())
  //     .subscribe(transformedPostData => {
  //       this.posts = transformedPostData.posts;
  //       this.postsUpdated.next({ posts: [...this.posts] })
  //     }
  // }

  // Method: subscribtion to the subject
  getMailsUpdatedListner() {
    return this.mailsUpdatedListener.asObservable();
  }

  // Method: addding mail
  // addMail(title: string, description: string, content: string) {
  //   const mail: Mail = { title, description, content, read_flag: false, star_flag: false };
  //   this.mails.push(mail);
  //   // tell subscribers new mail added
  //   this.mailsUpdated.next(this.getMails());
  //   this.router.navigate(['/']);
  // }

  /*
    Helper: get mails from backend
  */
  // const mailToMail = (postData){
  //   return {
  //     posts: postData.posts.map(
  //       post => {
  //         return {
  //           title: post.title,
  //             content: post.content,
  //             id: post._id,
  //             imagePath: post.imagePath,
  //             creator: post.creator
  //         }
  //       }
  //     )
  //   }
  // }
}
