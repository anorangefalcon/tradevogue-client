import { Component, OnInit } from '@angular/core';
import { FetchDataService } from 'src/app/shared/services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';


import io from 'socket.io-client';

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
  loading: boolean = true;
  theme: Boolean = false;
  messageList: any = [];
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

      socket.on('loadExistChat' , (data: any) => {
        console.log(data);
        this.oldChats = data;

        this.oldChats.forEach((element: any) => { 
          if(element.sender == this.selectedUser._id) {
            this.messageList.push(element.message);
          }
        });
      });

    // socket.on('userMessage', (res) => {
    //   console.log(res);
    //   this.userMessage = res;
    // })

  }

  sendMessage() {
    if (this.selectedUser) {
      // Access this.selectedUser._id to get the selected user's ID
      // console.log('Selected User ID:', this.selectedUser._id);
      // socket.emit('newMessage', this.textMessage);
      const body = {
        message: this.textMessage,
        sender: this.selectedUser._id,
      }
      socket.emit('replyMessage', body);
    }
  }

}
