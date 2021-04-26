import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';


// Mock remote service

@Injectable()
export class ChatService {
  public readonly responses: Subject<Message> = new Subject<Message>();
 public isQuery:boolean=false;
 message: Message = {
      author: {
    id: 0
  },
      suggestedActions: [{
        type: 'reply',
        value: 'Request Notes'
      }, {
        type: 'reply',
        value: 'Raise a Query'
      }],
      timestamp: new Date(),
      text: 'How can I help you today ?'
    };
  public submit(question: string): void {
    const length = question.length;
   
    let answer = "How Can I help You ?";

    if(question=="Request Notes")
    {
      answer="Sure, I Will ask Mr.Williams for that";
    }
     if(question=="Raise a Query")
    {
      answer="What is the query about ?";
      this.isQuery=true;
    }
    if(this.isQuery){
       answer="Sure I will raise it with Mr.Williams ?";
      this.isQuery=true;
    }

    setTimeout(
      () => this.responses.next(this.message),
      1000
    );
  }
}
