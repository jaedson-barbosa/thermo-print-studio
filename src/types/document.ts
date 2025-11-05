export type RasterizationMethod = 'threshold' | 'floyd-steinberg' | 'atkinson' | 'ordered';

export interface TextSection {
  id: string;
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  align: 'left' | 'center' | 'right';
}

export interface ImageSection {
  id: string;
  type: 'image';
  imageData: string; // base64
  width: number; // in mm
  rasterization: RasterizationMethod;
}

export type Section = TextSection | ImageSection;

export interface Document {
  id: string;
  name: string;
  width: number; // in mm
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}
