import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@repo/core';

export interface RadioOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface RadioButtonProps<T = string> {
  selected?: boolean;
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const sizeConfig = {
  small: { outer: 18, inner: 8, fontSize: 14 },
  medium: { outer: 22, inner: 10, fontSize: 16 },
  large: { outer: 26, inner: 12, fontSize: 18 },
};

export function RadioButton<T = string>({
  selected = false,
  onPress,
  label,
  disabled = false,
  size = 'medium',
  style,
  labelStyle,
}: RadioButtonProps<T>) {
  const config = sizeConfig[size];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.radio,
          {
            width: config.outer,
            height: config.outer,
            borderRadius: config.outer / 2,
          },
          selected && styles.radioSelected,
          disabled && styles.radioDisabled,
        ]}
      >
        {selected && (
          <View
            style={[
              styles.radioInner,
              {
                width: config.inner,
                height: config.inner,
                borderRadius: config.inner / 2,
              },
              disabled && styles.radioInnerDisabled,
            ]}
          />
        )}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            { fontSize: config.fontSize },
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// RadioGroup component
export interface RadioGroupProps<T = string> {
  options: RadioOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  direction?: 'vertical' | 'horizontal';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  optionStyle?: ViewStyle;
}

export function RadioGroup<T = string>({
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  size = 'medium',
  direction = 'vertical',
  containerStyle,
  labelStyle,
  errorStyle,
  optionStyle,
}: RadioGroupProps<T>) {
  return (
    <View style={[styles.groupContainer, containerStyle]}>
      {label && <Text style={[styles.groupLabel, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.optionsContainer,
          direction === 'horizontal' && styles.optionsHorizontal,
        ]}
      >
        {options.map((option, index) => (
          <RadioButton
            key={String(option.value)}
            selected={value === option.value}
            onPress={() => onChange?.(option.value)}
            label={option.label}
            disabled={disabled || option.disabled}
            size={size}
            style={[
              optionStyle,
              direction === 'vertical' && index < options.length - 1
                ? styles.optionMarginBottom
                : undefined,
              direction === 'horizontal' && index < options.length - 1
                ? styles.optionMarginRight
                : undefined,
            ]}
          />
        ))}
      </View>

      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDisabled: {
    borderColor: colors.border,
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  radioInner: {
    backgroundColor: colors.primary,
  },
  radioInnerDisabled: {
    backgroundColor: colors.textSecondary,
  },
  label: {
    marginLeft: 10,
    color: colors.text,
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
  groupContainer: {
    gap: 6,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  optionsHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionMarginBottom: {
    marginBottom: 12,
  },
  optionMarginRight: {
    marginRight: 20,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});
