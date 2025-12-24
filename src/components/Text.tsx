import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@repo/core';

type TextVariant = 'h1' | 'h2' | 'body' | 'caption';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: TextStyle;
  color?: string;
}

export function Text({ children, variant = 'body', style, color }: TextProps) {
  return (
    <RNText style={[styles.base, styles[variant], color && { color }, style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
