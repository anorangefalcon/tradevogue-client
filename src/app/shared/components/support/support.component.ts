import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})

export class SupportComponent {
    selectedTabIndex = 0;
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

   navigateTo(tab: string) {
    if (tab === 'home') {
      this.selectedTabIndex = 0;
    } else if (tab === 'chat') {
      this.selectedTabIndex = 1;
    } else if (tab === 'help') {
      this.selectedTabIndex = 2;
    }
  }
}
