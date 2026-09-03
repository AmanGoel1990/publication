import { Component } from '@angular/core';

type Book = {
  title: string;
  price: string;
  image: string;
  description: string;
  accent: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly navItems = ['Home', 'Publications', 'Special Offers', 'About MDNIY', 'Contact'];

  readonly featuredBooks: Book[] = [
    {
      title: 'Marmacikitsa',
      price: '₹1,200',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Marmacikitsa-Basic-Tenets-in-Ayurveda-and-Therapeutic-Approaches-Second-Edition.jpg',
      description: 'Basic tenets in Ayurveda and therapeutic approaches for clinical practice.',
      accent: '#b64f3a'
    },
    {
      title: 'Panchakarma Procedures',
      price: '₹540',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/A-Practical-Handbook-of-Panchakarma-Procedures-E.jpeg',
      description: 'A practical handbook covering common Panchakarma procedures and safety guidelines.',
      accent: '#8b6d3b'
    },
    {
      title: 'Guidelines on Panchakarma',
      price: '₹100',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Guidelines-on-Basic-Training-and-Safety-in-Panchakarma.jpeg',
      description: 'Foundational training and safety measures for effective preparation and practice.',
      accent: '#2f4858'
    }
  ];

  readonly newArrivals: Book[] = [
    {
      title: 'BIOSTATISTICS Basics to Advances',
      price: '₹312',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Biostatistics-Basics-to-Advances.jpeg',
      description: 'An essential reference from fundamentals to advanced statistical applications.',
      accent: '#5a7c33'
    },
    {
      title: 'Evidence-based safety of Ayurvedic Herbo-Mineral Formulations',
      price: '₹110',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Evidence-based-safety-of-Ayurvedic-Herbo-Mineral-Formulations-E.jpeg',
      description: 'Clinical safety insights and evidence-based perspectives for herbomineral formulations.',
      accent: '#7f4c3a'
    },
    {
      title: 'Clinical Safety and Efficacy of Dhatri Lauha',
      price: '₹200',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Clinical-Safety-and-Efficacy-of-Dhatri-Lauha-in-Iron-Deficiency-Anaemia-Pandu-Roga-2.jpeg',
      description: 'A focused study on classical formulation use in iron deficiency anaemia.',
      accent: '#3d5d77'
    },
    {
      title: 'Hamari Mitra Jammu-Pradesh ki Vanaushdhiyan',
      price: '₹75',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Hamari-Mitra-Jammu-Pradesh-ki-Vanaushdhiyan-Hindi-2.jpeg',
      description: 'Regional medicinal plants and their relevance in everyday healthcare.',
      accent: '#b46b4d'
    },
    {
      title: 'Dravyaguna Satasloki',
      price: '₹160',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/DRAVYAGUNA-SATASLOKI-of-Trimalla-Bhatta-English-Translation.jpeg',
      description: 'A scholarly English translation of classical Ayurvedic pharmacology text.',
      accent: '#7c5a43'
    },
    {
      title: 'Dravyanamakaranighantuh',
      price: '₹420',
      image: 'https://publication.ccras.res.in/wp-content/uploads/2025/06/Dravyanamakaranighantuh.jpeg',
      description: 'A critically edited reference on drug nomenclature and Ayurvedic lexicon studies.',
      accent: '#4d6a53'
    }
  ];

  readonly portals = [
    { name: 'CCRAS', url: 'https://ccras.nic.in/' },
    { name: 'Ayush Research Portal', url: 'https://ayushportal.nic.in/' },
    { name: 'Ayur Prakriti Web Portal', url: 'https://ccras.nic.in/ayur-prakriti-web-portal/' },
    { name: 'PDF Scheme', url: 'https://ccras.nic.in/application-invited-for-post-doctoral-fellowship-scheme-june-2025-batch/' },
    { name: 'PG STAR', url: 'https://pgstar2.ccras.org.in/' },
    { name: 'SPARK', url: 'https://spark.ccras.org.in/' },
    { name: 'E-BOOKS', url: 'http://ccras.res.in/ccras_ebooks/' }
  ];

  readonly quickLinks = [
    'NMPB',
    'Indian Pharmacopoeia Commission',
    'Ministry of Ayush',
    'Terms and Conditions',
    'Privacy Policy',
    'Refund & Return Policy'
  ];
}
