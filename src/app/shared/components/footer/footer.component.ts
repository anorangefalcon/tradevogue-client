import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  faqQuestions = [
    {
      title: 'Do I need to create account for buy products ?',
      content:
        'The moon is visible during the day due to its orbit around the Earth. Sometimes, the moon\'s position aligns with the sun and Earth in a way that part of the moon is illuminated and facing us. This makes it visible even in daylight.',
      isExpanded: false
    },
    {
      title: 'How can I track my order ?',
      content:
        'The blue color of the sky is due to a phenomenon called Rayleigh scattering. The Earth\'s atmosphere scatters sunlight in all directions and blue light is scattered more than other colors because it travels as shorter, smaller waves.',
      isExpanded: false
    },
        {
      title: 'How I Return back my product ?',
      content:
        'The blue color of the sky is due to a phenomenon called Rayleigh scattering. The Earth\'s atmosphere scatters sunlight in all directions and blue light is scattered more than other colors because it travels as shorter, smaller waves.',
      isExpanded: false
    },
            {
      title: 'What Payment Methods are Available ?',
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
