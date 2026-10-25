import type { ReactNode } from 'react';

export interface CrudOption {
  value: string;
  label: string;
}

export interface CrudField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'tel' | 'time' | 'email' | 'password' | 'url' | 'select' | 'file';
  options?: readonly (string | CrudOption)[];
  accept?: string;
  required?: boolean;
}

export interface CrudColumn {
  key: string;
  header: string;
  width?: string;
  primary?: boolean;
  render?: (value: unknown) => ReactNode;
}

export interface CrudFiles {
  [key: string]: { name: string; url: string };
}

export type CrudModal = { kind: 'add' } | { kind: 'edit'; id: number } | { kind: 'delete'; id: number } | null;
