// src/data/mockData.jsx
// Central mock data mirroring the MongoDB schemas (with JSX support for SVGs)
import React from 'react';

export const mockUser = {
  _id: 'usr_001',
  fullName: 'GHOST PROTOCOL',
  email: 'ghost@rockeryxprints.io',
  role: 'admin',
  avatar: '',
  isEmailVerified: true,
  addresses: [
    {
      street: '44 BRUTALIST LANE',
      city: 'NEW DELHI',
      state: 'DELHI',
      zipCode: 110001,
      country: 'INDIA',
    },
  ],
};

export const mockProducts = [
  {
    _id: 'prod_001',
    name: 'SHINIGAMI // 01',
    slug: 'shinigami-01',
    description:
      'Heavyweight 300gsm archival paper. Raw inkjet monochrome print. Encased in 20mm industrial black frame with gallery-grade 3mm glass. Zero color. Pure obsession.',
    mrp: 1599,
    sellingPrice: 1299,
    category: { _id: 'cat_001', name: 'ANIME FANDOM' },
    sku: 'RXP-ANI-001',
    stock: 87,
    deliveryDays: 5,
    rating: 4.8,
    salesCount: 312,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['anime', 'shinigami', 'monochrome', 'limited'],
  },
  {
    _id: 'prod_002',
    name: 'NEO-TOKYO // 07',
    slug: 'neo-tokyo-07',
    description:
      'Cyberpunk surveillance eye. Ultra-high contrast pigment print on museum-grade stock. Hand-numbered in silver ink. The city watches back.',
    mrp: 1599,
    sellingPrice: 1299,
    category: { _id: 'cat_002', name: 'CYBERPUNK FANDOM' },
    sku: 'RXP-CYB-007',
    stock: 43,
    deliveryDays: 5,
    rating: 4.9,
    salesCount: 178,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['cyberpunk', 'neo-tokyo', 'eye', 'monochrome'],
  },
  {
    _id: 'prod_003',
    name: 'RUNESMITH // 12',
    slug: 'runesmith-12',
    description:
      'Geometric runic circle. Built for brutalist walls and empty spaces that demand attention. Mathematical precision in monochrome.',
    mrp: 1799,
    sellingPrice: 1499,
    category: { _id: 'cat_003', name: 'GAMING FANDOM' },
    sku: 'RXP-GAM-012',
    stock: 5,
    deliveryDays: 7,
    rating: 4.7,
    salesCount: 91,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['gaming', 'rune', 'geometric', 'monochrome'],
  },
  {
    _id: 'prod_004',
    name: 'DARK KNIGHT // 03',
    slug: 'dark-knight-03',
    description:
      'The silhouette that owns the night. Comics-grade icon stripped to its purest monochrome form. Industrial frame. Gallery presence.',
    mrp: 1999,
    sellingPrice: 1699,
    category: { _id: 'cat_004', name: 'COMICS FANDOM' },
    sku: 'RXP-COM-003',
    stock: 3,
    deliveryDays: 5,
    rating: 4.9,
    salesCount: 244,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['comics', 'batman', 'dark knight', 'monochrome'],
  },
  {
    _id: 'prod_005',
    name: 'VOID WALKER // 04',
    slug: 'void-walker-04',
    description: 'A lone wanderer navigates the infinite dark. Zero gravity. Zero compromise.',
    mrp: 1799,
    sellingPrice: 1499,
    category: { _id: 'cat_005', name: 'SCI-FI FANDOM' },
    sku: 'RXP-SCI-004',
    stock: 22,
    deliveryDays: 5,
    rating: 4.6,
    salesCount: 133,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['sci-fi', 'space', 'astronaut', 'monochrome'],
  },
  {
    _id: 'prod_006',
    name: 'CRIMSON MASK // 09',
    slug: 'crimson-mask-09',
    description: 'The terror behind the mask. Stripped to its starkest silhouette.',
    mrp: 1599,
    sellingPrice: 1299,
    category: { _id: 'cat_006', name: 'HORROR FANDOM' },
    sku: 'RXP-HOR-009',
    stock: 8,
    deliveryDays: 5,
    rating: 4.8,
    salesCount: 207,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['horror', 'mask', 'slasher', 'monochrome'],
  },
  {
    _id: 'prod_007',
    name: 'CIRCUIT GHOST // 02',
    slug: 'circuit-ghost-02',
    description: 'A ghost in the machine. Circuits and skull. Monochrome perfection.',
    mrp: 1599,
    sellingPrice: 1199,
    category: { _id: 'cat_002', name: 'CYBERPUNK FANDOM' },
    sku: 'RXP-CYB-002',
    stock: 55,
    deliveryDays: 5,
    rating: 4.7,
    salesCount: 88,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'LIMITED // 100 PRINTS' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['cyberpunk', 'ghost', 'circuit', 'monochrome'],
  },
  {
    _id: 'prod_008',
    name: 'TITAN FALL // 06',
    slug: 'titan-fall-06',
    description: 'The colossus descends. Epic scale distilled to raw black-and-white geometry.',
    mrp: 1999,
    sellingPrice: 1699,
    category: { _id: 'cat_003', name: 'GAMING FANDOM' },
    sku: 'RXP-GAM-006',
    stock: 0,
    deliveryDays: 7,
    rating: 5.0,
    salesCount: 400,
    features: [
      { key: 'PAPER', value: '300 GSM ARCHIVAL MATTE' },
      { key: 'FRAME', value: '20MM SOLID WOOD — BLACK' },
      { key: 'GLASS', value: '3MM GALLERY-GRADE' },
      { key: 'PRINT', value: 'PIGMENT INKJET MONOCHROME' },
      { key: 'EDITION', value: 'SOLD OUT' },
      { key: 'DIMENSIONS', value: '12\" × 16\"' },
    ],
    images: [],
    searchTags: ['gaming', 'titan', 'colossus', 'monochrome'],
  },
];

export const mockOrders = [
  {
    _id: 'ord_001',
    orderId: 'RXP-2026-0001',
    orderItems: [
      {
        product: 'prod_001',
        name: 'SHINIGAMI // 01',
        image: '',
        quantity: 1,
        priceAtPurchase: 1299,
      },
    ],
    totalMRP: 1599,
    totalSellingPrice: 1299,
    tax: 234,
    shippingFee: 0,
    finalTotal: 1533,
    shippingAddress: {
      street: '44 BRUTALIST LANE',
      city: 'NEW DELHI',
      state: 'DELHI',
      zipCode: '110001',
      country: 'INDIA',
      phone: '+91 98765 43210',
    },
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    transactionID: 'TXN-84920XP',
    createdAt: '2026-07-10T08:32:00Z',
    deliveredAt: null,
  },
  {
    _id: 'ord_002',
    orderId: 'RXP-2026-0002',
    orderItems: [
      {
        product: 'prod_003',
        name: 'RUNESMITH // 12',
        image: '',
        quantity: 2,
        priceAtPurchase: 1499,
      },
    ],
    totalMRP: 3598,
    totalSellingPrice: 2998,
    tax: 540,
    shippingFee: 0,
    finalTotal: 3538,
    shippingAddress: {
      street: '44 BRUTALIST LANE',
      city: 'NEW DELHI',
      state: 'DELHI',
      zipCode: '110001',
      country: 'INDIA',
      phone: '+91 98765 43210',
    },
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    transactionID: 'TXN-94831XQ',
    createdAt: '2026-07-01T14:10:00Z',
    deliveredAt: '2026-07-06T10:00:00Z',
  },
];

export const mockCategories = [
  {
    _id: 'cat_001',
    name: 'ANIME FANDOM',
    slug: 'anime-fandom',
    coverImage: '',
    productCount: 24,
    totalSalesCount: 1840,
    description: 'Monochrome icons from the world of anime — ink and obsession.',
  },
  {
    _id: 'cat_002',
    name: 'CYBERPUNK FANDOM',
    slug: 'cyberpunk-fandom',
    coverImage: '',
    productCount: 18,
    totalSalesCount: 1120,
    description: 'Neon-free futures. High contrast. Pure signal.',
  },
  {
    _id: 'cat_003',
    name: 'GAMING FANDOM',
    slug: 'gaming-fandom',
    coverImage: '',
    productCount: 31,
    totalSalesCount: 2430,
    description: 'From pixel gods to runic titans. Every frame a legend.',
  },
  {
    _id: 'cat_004',
    name: 'COMICS FANDOM',
    slug: 'comics-fandom',
    coverImage: '',
    productCount: 15,
    totalSalesCount: 980,
    description: 'Panel art stripped to its raw brutalist core.',
  },
  {
    _id: 'cat_005',
    name: 'SCI-FI FANDOM',
    slug: 'sci-fi-fandom',
    coverImage: '',
    productCount: 22,
    totalSalesCount: 1650,
    description: 'Deep space, hard edges. The cosmos rendered in black.',
  },
  {
    _id: 'cat_006',
    name: 'HORROR FANDOM',
    slug: 'horror-fandom',
    coverImage: '',
    productCount: 12,
    totalSalesCount: 740,
    description: 'Dark iconography for darker walls.',
  },
];

// Helper to return consistent vector SVG for product designs based on slug or index
export const getProductSvg = (slug, index = 0) => {
  const mapping = {
    'shinigami-01': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
        <path d="M8 14s1.5-2 4-2 4 2 4 2" stroke="black" strokeWidth="2" />
        <circle cx="9" cy="9" r="1.5" fill="black" />
        <circle cx="15" cy="9" r="1.5" fill="black" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="black" strokeWidth="2" />
      </svg>
    ),
    'neo-tokyo-07': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="black" stroke="black" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.5" fill="white" stroke="black" strokeWidth="2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" />
      </svg>
    ),
    'runesmith-12': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" stroke="black" strokeWidth="3" fill="none" />
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none" />
        <path d="M12 2v20M2 12h20" stroke="black" strokeWidth="2" />
      </svg>
    ),
    'dark-knight-03': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 10c2 2 4 4 10 0 6 4 8 2 10 0 0-4-3-6-10-6S2 6 2 10Z" fill="black" stroke="black" strokeWidth="2" />
        <path d="M12 4v16" stroke="black" strokeWidth="2" />
        <path d="M8 8s2-1 4-1 4 1 4 1" stroke="black" strokeWidth="1.5" />
      </svg>
    ),
    'void-walker-04': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="6" stroke="black" strokeWidth="2.5" />
        <ellipse cx="12" cy="12" rx="11" ry="4" stroke="black" strokeWidth="2" />
        <path d="M12 2v4M12 18v4" stroke="black" strokeWidth="2" />
      </svg>
    ),
    'crimson-mask-09': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="5" width="14" height="14" stroke="black" strokeWidth="2.5" />
        <path d="M5 5l14 14M19 5L5 19" stroke="black" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="black" />
      </svg>
    ),
    'circuit-ghost-02': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" stroke="black" strokeWidth="2.5" />
        <path d="M12 4v16M4 12h16" stroke="black" strokeWidth="1.5" />
      </svg>
    ),
    'titan-fall-06': (
      <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_0_#000]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 22h20Z" stroke="black" strokeWidth="2.5" />
        <circle cx="12" cy="14" r="3" fill="black" />
      </svg>
    )
  };

  if (mapping[slug]) return mapping[slug];
  const keys = Object.keys(mapping);
  return mapping[keys[index % keys.length]];
};
