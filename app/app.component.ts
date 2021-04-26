import { Component } from '@angular/core';

import { Subject, from, merge, Observable } from 'rxjs';
import { switchMap, map, windowCount, scan, take, tap } from 'rxjs/operators';

import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { ChatService } from './chat.service';

@Component({
  providers: [ ChatService ],
  selector: 'my-app',
  template: `
      <kendo-chat
        [messages]="feed | async"
        [user]="user"
        (sendMessage)="sendMessage($event)"
      >
      </kendo-chat>
    `
})
export class AppComponent {
  public feed: Observable<Message[]>;

  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0
  };

  private local: Subject<Message> = new Subject<Message>();

  constructor(private svc: ChatService) {
    const hello: Message = {
      author: this.bot,
      suggestedActions: [{
        type: 'reply',
        value: 'Request Notes'
      }, {
        type: 'reply',
        value: 'Raise a Query'
      }],
      timestamp: new Date(),
      text: 'Hey, This is AdGo Virtual Underwriter. How can I help you today ?'
    };

    // Merge local and remote messages into a single stream
    this.feed = merge(
      from([ hello ]),
      this.local,
      this.svc.responses.pipe(
        map((response:string): Message => ({
          author: this.bot,
          text: response
        })
      )
      )
    ).pipe(
      // ... and emit an array of all messages
      scan((acc: Message[], x: Message) => [...acc, x], [])
    );
  }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);

    this.local.next({
      author: this.bot,
      typing: false,
      text: 'hii'
    });

   // this.svc.submit(e.message.text);
  }
}
