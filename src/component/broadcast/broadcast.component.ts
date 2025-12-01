import { Component, OnInit, ElementRef, AfterViewChecked, ChangeDetectorRef, viewChild, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BroadcastMessageService } from '../../service/broadcast-message.service';
import { WebSocketService } from '../../service/web-socket.service';
import { MessageDTO } from '../../dto/MessageDTO';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../service/auth-service.service';
import { User } from '../../model/User';

import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-broadcast',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    PickerComponent
  ],
  templateUrl: './broadcast.component.html',
  styleUrl: './broadcast.component.css'
})
export class BroadcastComponent implements OnInit {

  constructor(
    private broadcastService: BroadcastMessageService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { };
  messageList: MessageDTO[] = [];
  private readonly scrollContainer = viewChild.required<ElementRef>('scrollContainer');
  isLoading: boolean = false;
  showEmojiPicker = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.broadcastService.getBroadcastMessages().subscribe((res) => {
      this.messageList = res;
      this.isLoading = false;
      this.cdRef.detectChanges();
      this.scrollToBottom();
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.webSocketService.connect(token);
      this.webSocketService.messages$.subscribe((msg) => {
        if (this.user && msg.from === this.user.id.toString()) {
          return;
        }
        this.messageList.push(msg);
        this.cdRef.detectChanges();
        this.scrollToBottom();
      });
    }
  }

  user: User | null = null;

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.scrollContainer().nativeElement.scrollTop = this.scrollContainer().nativeElement.scrollHeight;
      }, 0);
    } catch (err) { }
  }

  newMessage: string = '';

  @ViewChild('emojiPickerContainer') emojiPickerContainer: ElementRef | undefined;
  @ViewChild('emojiToggleBtn') emojiToggleBtn: ElementRef | undefined;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showEmojiPicker && this.emojiPickerContainer && this.emojiToggleBtn) {
      const clickedInsidePicker = this.emojiPickerContainer.nativeElement.contains(event.target);
      const clickedToggleBtn = this.emojiToggleBtn.nativeElement.contains(event.target);
      if (!clickedInsidePicker && !clickedToggleBtn) {
        this.showEmojiPicker = false;
      }
    }
  }

  toggleEmojiPicker(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.newMessage += event.emoji.native;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const newMsg: MessageDTO = {
        content: this.newMessage,
        you_sent: true,
        timestamp: new Date().toISOString(),
        type: 'BROADCAST',
        from: this.user?.id?.toString() || '',
        to: '-1',
        full_name: this.user?.full_name || ''
      };

      this.messageList.push(newMsg);
      this.webSocketService.sendMessage(newMsg);
      this.newMessage = '';
      this.showEmojiPicker = false;
      this.cdRef.detectChanges();
      this.scrollToBottom();
    }
  }

}
