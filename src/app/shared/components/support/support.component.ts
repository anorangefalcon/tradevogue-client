import { Component } from '@angular/core';
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})

export class SupportComponent {
   toggleChat() {
    const chatBtn = document.querySelector('.icon-support');
    const chatBox = document.querySelector('.messenger');

    if (chatBtn && chatBox) {
      chatBtn.classList.toggle('expanded');

      setTimeout(() => {
        chatBox.classList.toggle('expanded');
      }, 100);
    }
  }
}