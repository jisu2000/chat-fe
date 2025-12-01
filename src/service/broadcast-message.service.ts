import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { MessageDTO } from '../dto/MessageDTO';
import { ChatApiResponse } from '../dto/MessageListResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class BroadcastMessageService {



  constructor(
    private httpClient: HttpClient
  ) { }


  getBroadcastMessages(): Observable<MessageDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.httpClient
      .get<ChatApiResponse>(environment.BE_URL + '/api/v1/message/broadcast', { headers })
      .pipe(
        map(res => {
          if (res.success) {
            return res.data;
          } else {
            return [];
          }
        })
      )

  }


}
