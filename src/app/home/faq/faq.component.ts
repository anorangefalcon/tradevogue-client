import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqQuestions = [
    {
      title: 'Why is the moon sometimes out during the day?',
      content:
        'The moon is visible during the day due to its orbit around the Earth. Sometimes, the moon\'s position aligns with the sun and Earth in a way that part of the moon is illuminated and facing us. This makes it visible even in daylight.',
      isExpanded: false
    },
    {
      title: 'Why is the sky blue?',
      content:
        'The blue color of the sky is due to a phenomenon called Rayleigh scattering. The Earth\'s atmosphere scatters sunlight in all directions and blue light is scattered more than other colors because it travels as shorter, smaller waves.',
      isExpanded: false
    },
    // Add more FAQ questions here
  ];

  contentMaxHeight = 300; // Adjust the max height as needed
  

  toggleAccordion(index: number) {
    this.faqQuestions[index].isExpanded = !this.faqQuestions[index].isExpanded;
  }
}
