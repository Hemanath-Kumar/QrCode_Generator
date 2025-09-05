import { QRCodeType } from '../types';

export const QR_CODE_TYPES: QRCodeType[] = [
  {
    id: 'QR_Model_2',
    name: 'QR Model 2',
    description: 'Standard QR codes with high capacity',
    supports: 'Numeric, Alphanumeric, Kanji, Byte (ASCII/UTF-8)',
    maxLength: 4296,
    example: 'https://example.com or any text up to 4296 characters'
  },
  {
    id: 'Micro_QR',
    name: 'Micro QR',
    description: 'Compact QR for small data applications',
    supports: 'Numeric, Alphanumeric, Byte',
    maxLength: 35,
    example: 'Short text or numbers (max 35 chars)'
  },
  {
    id: 'QR_Model_1',
    name: 'QR Model 1',
    description: 'Legacy QR code with lower capacity',
    supports: 'Numeric, Alphanumeric, Byte',
    maxLength: 1167,
    example: 'Legacy format for older systems'
  },
  {
    id: 'Data_Matrix',
    name: 'Data Matrix',
    description: 'Excellent for small, dense data on industrial parts',
    supports: 'ASCII, Extended ASCII',
    maxLength: 2335,
    example: 'Product codes, serial numbers'
  },
  {
    id: 'PDF417',
    name: 'PDF417',
    description: 'Stacked linear barcode for documents and ID cards',
    supports: 'ASCII, Binary',
    maxLength: 1850,
    example: 'Driver licenses, boarding passes'
  },
  {
    id: 'Aztec',
    name: 'Aztec',
    description: 'Used in transport tickets and IDs, no quiet zones required',
    supports: 'Binary, ASCII',
    maxLength: 3067,
    example: 'Train tickets, event passes'
  },
  {
    id: 'MaxiCode',
    name: 'MaxiCode',
    description: 'Used in logistics (UPS, shipping labels)',
    supports: 'ASCII',
    maxLength: 93,
    example: 'Shipping labels, package tracking'
  },
  {
    id: 'DotCode',
    name: 'DotCode',
    description: 'High-speed printing barcodes',
    supports: 'ASCII, Binary',
    maxLength: 113,
    example: 'Cigarette packs, lottery tickets'
  },
  {
    id: 'Code128',
    name: 'Code128',
    description: 'Linear barcode for supply chain and packaging',
    supports: 'ASCII (all 128 characters)',
    maxLength: 48,
    example: 'Product barcodes, inventory'
  },
  {
    id: 'EAN13',
    name: 'EAN13',
    description: 'Retail product codes (European)',
    supports: '12-digit numeric (13th is checksum)',
    maxLength: 12,
    example: '123456789012'
  },
  {
    id: 'UPC',
    name: 'UPC',
    description: 'US retail product codes',
    supports: '11-digit numeric (12th is checksum)',
    maxLength: 11,
    example: '12345678901'
  },
  {
    id: 'Code39',
    name: 'Code39',
    description: 'Simple linear barcode used in logistics',
    supports: 'Uppercase letters, digits, - . $ / + % SPACE',
    maxLength: 43,
    example: 'PRODUCT-123'
  }
];