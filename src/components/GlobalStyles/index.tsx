import { ReactElement } from 'react';
import './GlobalStyles.module.scss';

export interface GlobalStylesProps {
  children: ReactElement;
}

export default function GlobalStyles({ children }: GlobalStylesProps) {
  return children;
}
