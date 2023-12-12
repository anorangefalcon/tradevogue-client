import { Component, OnInit } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/backend-urls';


// import io from 'socket.io-client';
import { Subject, debounceTime } from 'rxjs';
import { SocketService } from 'src/app/shared/services/socket.service';
import { set } from 'lodash';

// const socket = io('http://localhost:3000/chat', {
//   transports: ['websocket']
// });

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string = '';
  id: string = '';
  textMessage: string = '';
  name: any;
  email: any;
  userData: any = [];
  senderId: any;
  selectedUser: any; 
  messages: any;
  userMessage: any;
  oldChats: any;
  adminOldChat: any;
  loading: boolean = true;
  theme: Boolean = false;
  messageList: any = [];
  adminMessageList: any = [];
  userMessages: any[] = [];
adminMessages: any[] = [];
replyUserMessage: any[] = [];
private sendMessageSubject = new Subject<string>();

mergedMessages: any[] = [];

  private selectedFile: File | undefined;
  constructor(private fetchDataService: FetchDataService,
    private socketService: SocketService,
    private utilsModule: UtilsModule) {
      
      this.getUsers();
      const socket = this.socketService.getChatSocket();
      socket.on('getChatDetail', (data: any) => {
        if(data) {
          this.getUsers();
        }
      });

    //     socket.on('saveadminMessage', (data: { message: any[]; }) => {
    //   console.log('Received coming message:', data);
    //   const body = {
    //     message: data.message,
    //   }
    //     // this.replyUserMessage = data.message;
    //     // this.messages.push({ content: this.replyUserMessage, sender: 'user' });
      
    // });
      

   }

   getUsers() {
      this.fetchDataService.HTTPGET(this.utilsModule.URLs.getChatDetails).subscribe((res: any) => {
          this.userData = res;
          if(this.userData.length > 0) {
            this.loading = false;
          }
        console.log(res);
      });
   }

   selectUser(user: any): void {
    console.log(user, "comign user");
    const socket = this.socketService.getChatSocket();
    this.selectedUser = user;
    this.loading = false;
    const senderId = this.selectedUser._id;
    socket.emit('existChat', senderId);
  }

sendMessage(): void {
  const socket = this.socketService.getChatSocket();
  if (this.textMessage) {

    this.adminMessages.push(
      {adminMessage: this.textMessage , createdAt: new Date() }
    );
    
    console.log(this.userData, "selected user");
    // setTimeout(() => {
    //   socket.emit('existChat', this.userData[0]._id);
    //   // this.selectUser(this.userData[0]);
    // }, 1000);
    this.mergeAndSortMessages();
    this.sendMessageSubject.next(this.textMessage);
    this.textMessage = '';
  }
}


  ngOnInit() {
    const socket = this.socketService.getChatSocket();
    // You can use 'socket' here for your socket-related operations.
    socket.on('connect', () => {
      console.log('Connected to server');
    });

  this.sendMessageSubject.pipe(debounceTime(1000)).subscribe((message: string) => {
    const body = {
      message,
      sender: this.selectedUser._id
    };
    socket.emit('replyMessage', body);
  });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });

    socket.on('message', (res: string) => {
      console.log(res);
      this.message = res;
    })

    socket.on('userMessage', (res: any) => {
      console.log(res, "res");
      this.messages = res;
    })

socket.on('loadNewChat', (data: any) => {
  if (data.sender === this.selectedUser._id) {
    this.userMessage = data.message;

    // Check if the message already exists in userMessages
    const isMessageExisting = this.userMessages.some(
      msg => msg.message === this.userMessage && msg.sender === this.selectedUser._id
    );

    // Add the message only if it's not already present
    if (!isMessageExisting) {
      this.userMessages.push({
        message: this.userMessage,
        sender: this.selectedUser._id,
        createdAt: new Date()
      });

      this.mergeAndSortMessages();
    }
  }
});



      // load old chats 

      // socket.on('loadExistChat' , (data: any) => {
      //   console.log(data);
      //   this.oldChats = data;

      //   this.oldChats.forEach((element: any) => { 
      //     if(element.sender == this.selectedUser._id) {
      //       this.messageList.push(element.message);
      //     }
      //   });
      // });

      // socket.on('loadadminExistChat', (data: any) => {
      //   console.log(data);
      //   this.adminOldChat = data;

      //   console.log(this.adminOldChat, "admin old chats ");

      //   // return;

      //   this.adminOldChat.forEach((element: any) => {
      //     if(element.sender == '652b9c1480dd9b13abd5ee3a') {
      //       this.adminMessageList.push(element.adminMessage);
      //     }
      //   });
      // });


  socket.on('loadExistChat', (data: any) => {
    console.log(data);
    this.oldChats = data;

    this.oldChats.forEach((element: any) => {
      if (element.sender === this.selectedUser._id) {
        this.userMessages.push(element); 
      } else {
        this.adminMessages.push(element); 
      }
    });
      this.mergeAndSortMessages();
  });

  // socket.on('loadadminNewChat', (data: any) => {
  //   console.log(data);
  //   this.adminOldChat = data;

  //   console.log(this.adminOldChat, "admin old chats 2");

  //   this.adminOldChat.forEach((element: any) => {
  //     if (element.sender == '652b9c1480dd9b13abd5ee3a') {
  //       this.adminMessages.push(element); 
  //     } else {
  //       this.userMessages.push(element); 
  //     }
  //   });

  //   this.mergeAndSortMessages();
  // });

  socket.on('loadadminExistChat', (data: any) => {
  this.adminOldChat = data;

  console.log(this.adminOldChat, "admin old chats ");

  this.adminOldChat.forEach((element: any) => {
    if (element.sender == '652b9c1480dd9b13abd5ee3a') {
      this.adminMessages.push(element); 
    }
  });

  this.mergeAndSortMessages();
});

    socket.on('receivedUserMessage', (data: { message: any[]; }) => {
      console.log('Received user message:', data);
      const body = {
        message: data.message,
      }
        this.replyUserMessage = data.message;
        this.messages.push({ content: this.replyUserMessage, sender: 'user' });
      
    });


  }


mergeAndSortMessages(): void {
  const mergedMessages = [...this.userMessages, ...this.adminMessages];

  mergedMessages.sort((a, b) => {
    const timestampA = new Date(a.createdAt).getTime();
    const timestampB = new Date(b.createdAt).getTime();
    return timestampA - timestampB; 
  });

  this.mergedMessages = mergedMessages;
  console.log(this.mergedMessages, "merges messages are --")
}





  upload(files: any) {
    const socket = this.socketService.getChatSocket();
    socket.emit("upload", files[0], (status: any) => {
      console.log(status);
    });
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  uploadFile() {
    const socket = this.socketService.getChatSocket();
    if (!this.selectedFile) {
      console.log('No file selected');
      return;
    }

    socket.emit('upload', this.selectedFile, (status: any) => {
      console.log(status);
      // Handle the status response from the server
    });
  }


}




