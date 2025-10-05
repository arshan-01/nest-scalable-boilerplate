import { Transform } from 'class-transformer';

export const Trim = () => Transform(({ value }) => value?.trim());
export const ToLowerCase = () => Transform(({ value }) => value?.toLowerCase());
export const ToUpperCase = () => Transform(({ value }) => value?.toUpperCase());
export const ToInt = () => Transform(({ value }) => parseInt(value, 10));
export const ToFloat = () => Transform(({ value }) => parseFloat(value));
export const ToBoolean = () => Transform(({ value }) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
});
export const ToDate = () => Transform(({ value }) => new Date(value));
export const ToArray = () => Transform(({ value }) => {
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim());
  }
  return value;
});
