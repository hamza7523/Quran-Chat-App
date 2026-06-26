import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconSymbolProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export function IconSymbol({ name, size = 22, color = '#000' }: IconSymbolProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

