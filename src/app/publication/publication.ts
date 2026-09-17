import { Component } from '@angular/core';

type PublicationBook = {
  title: string;
  price: string;
  image: string;
  description: string;
  accent: string;
};

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [],
  templateUrl: './publication.html',
  styleUrl: './publication.css',
})
export class Publication {
  readonly publicationBooks: PublicationBook[] = [
    {
      title: 'Yoga For Adolescents',
      price: '₹1,200',
      image: 'https://www.yogamdniy.nic.in/uploads/YogaAdolescents.jpg',
      description: 'A practical guide for youth wellness, posture, breathwork, and mindful routines.',
      accent: '#b64f3a',
    },
    {
      title: 'Yoga for Geriatric Population',
      price: '₹540',
      image: 'https://www.yogamdniy.nic.in/uploads/YogaforGeriatricPopulation.jpg',
      description: 'Gentle movement and breathing practices designed for healthy ageing.',
      accent: '#8b6d3b',
    },
    {
      title: 'Yoga For Children',
      price: '₹100',
      image: 'https://www.yogamdniy.nic.in/uploads/YogaChildren.jpg',
      description: 'Simple yoga practices to support concentration, flexibility, and confidence.',
      accent: '#2f4858',
    },
    {
      title: 'BIOSTATISTICS Basics to Advances',
      price: '₹312',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Biostatistics-Basics-to-Advances.jpeg',
      description: 'Foundational to advanced statistical methods for clinical and research settings.',
      accent: '#5a7c33',
    },
    {
      title: 'Evidence-based safety of Ayurvedic Herbo-Mineral Formulations',
      price: '₹110',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Evidence-based-safety-of-Ayurvedic-Herbo-Mineral-Formulations-E.jpeg',
      description: 'A clinically informed resource on safe use, evidence, and formulation review.',
      accent: '#7f4c3a',
    },
    {
      title: 'Clinical Safety and Efficacy of Dhatri Lauha',
      price: '₹200',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Clinical-Safety-and-Efficacy-of-Dhatri-Lauha-in-Iron-Deficiency-Anaemia-Pandu-Roga-2.jpeg',
      description: 'A focused study on therapeutic use in iron deficiency anaemia.',
      accent: '#3d5d77',
    },
  ];
}
