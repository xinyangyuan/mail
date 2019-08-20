import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Quote {
  success: { total: number };
  contents: {
    quotes: [
      {
        quote: string;
        length: string;
        author: string;
        tags: string[];
        category: string;
        date: string;
        permalink: URL;
        title: string;
        background: URL;
        id: string;
      }
    ];
    copyright: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  // Attributes:
  private QUOTE_API_URL = 'https://theysaidso.com/api';

  constructor(private http: HttpClient) {}

  /*
     $ Method: get quote of the day
  */

  _getQoD(): Observable<Quote> {
    const query = '?category=inspire';
    return this.http.get<Quote>(this.QUOTE_API_URL + query);
  }
}
