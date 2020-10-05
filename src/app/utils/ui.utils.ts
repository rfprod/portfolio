import { SimpleChange } from '@angular/core';

const maxColorHexLength = 7;
const maxNumericColorValue = 256;
const radix = 16;

/**
 * Returns random color hex segment.
 */
function randomColorHexSegment() {
  return Math.floor(Math.random() * maxNumericColorValue).toString(radix);
}

/**
 * Returns random color value as hex.
 */
export function getRandomColor() {
  let colorHEX = `#${randomColorHexSegment()}${randomColorHexSegment()}${randomColorHexSegment()}`;
  if (colorHEX.length < maxColorHexLength) {
    colorHEX = `${colorHEX}c`;
  }
  return colorHEX;
}

export interface ITypedSimpleChange<T> extends SimpleChange {
  previousValue: T | null;
  currentValue: T | null;
}
