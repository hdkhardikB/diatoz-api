import { IFilter } from './common';

export interface IImage {
  id: string;
  author: string;
  download_url: string;
  height: number;
  widht: number;
  url: string;
}

export type ImageFilter = IFilter;
