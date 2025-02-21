declare module 'react-color' {
    import * as React from 'react';
  
    export interface Color {
      hex: string;
      rgb: { r: number; g: number; b: number; a?: number };
      hsl: { h: number; s: number; l: number; a?: number };
    }
  
    export type ColorChangeHandler = (color: Color) => void;
  
    export const TwitterPicker: React.FC<{
      color: string;
      onChange: ColorChangeHandler;
    }>;
  }
  