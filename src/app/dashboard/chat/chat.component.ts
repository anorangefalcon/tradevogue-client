import { Component, OnInit } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';


import io from 'socket.io-client';
import { Subject, debounceTime } from 'rxjs';

const socket = io('http://localhost:3000/chat', {
  transports: ['websocket']
});

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
private sendMessageSubject = new Subject<string>();

mergedMessages: any[] = [];

  private selectedFile: File | undefined;
  constructor(private fetchDataService: FetchDataService,
    private utilsModule: UtilsModule) {
      this.getUsers();
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
    this.selectedUser = user;
    this.loading = false;
    const senderId = this.selectedUser._id;
    socket.emit('existChat', senderId);
  }

  ngOnInit() {

  this.sendMessageSubject.pipe(debounceTime(1000)).subscribe((message: string) => {
    // Send the message after a debounce time of 1000ms (1 second)
    const body = {
      message,
      sender: this.selectedUser._id
    };
    socket.emit('replyMessage', body);
  });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error); 
    });

    socket.on('message', (res) => {
      console.log(res);
      this.message = res;
    })

    socket.on('userMessage', (res) => {
      console.log(res);
      this.messages = res;
    })

    socket.on('loadNewChat',  (data: any) => {
      if(data.sender == this.selectedUser._id) {
        this.userMessage = data.message;
        console.log(data);
      };
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
  console.log(data);
  this.adminOldChat = data;

  console.log(this.adminOldChat, "admin old chats ");

  this.adminOldChat.forEach((element: any) => {
    if (element.sender == '652b9c1480dd9b13abd5ee3a') {
      this.adminMessages.push(element); // Store the entire message object
    } else {
      this.userMessages.push(element); // Store user messages
    }
  });

  this.mergeAndSortMessages();
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
}





  upload(files: any) {
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
    if (!this.selectedFile) {
      console.log('No file selected');
      return;
    }

    socket.emit('upload', this.selectedFile, (status: any) => {
      console.log(status);
      // Handle the status response from the server
    });
  }

sendMessage() {
  if (this.selectedUser && this.textMessage) {
    // Emit the message to the Subject
    this.sendMessageSubject.next(this.textMessage);
    this.textMessage = ''; // Clear the message input after emitting
  }
}

}




