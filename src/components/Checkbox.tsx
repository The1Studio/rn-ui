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

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const sizeConfig = {
  small: { box: 18, check: 10, fontSize: 14 },
  medium: { box: 22, check: 12, fontSize: 16 },
  large: { box: 26, check: 14, fontSize: 18 },
};

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  error,
  size = 'medium',
  containerStyle,
  labelStyle,
  errorStyle,
}: CheckboxProps) {
  const config = sizeConfig[size];

  const handlePress = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        disabled={disabled}
        style={styles.container}
      >
        <View
          style={[
            styles.checkbox,
            {
              width: config.box,
              height: config.box,
              borderRadius: config.box / 4,
            },
            checked && styles.checkboxChecked,
            error && styles.checkboxError,
            disabled && styles.checkboxDisabled,
          ]}
        >
          {checked && (
            <Text
              style={[
                styles.checkmark,
                { fontSize: config.check },
              ]}
            >
              ✓
            </Text>
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
      {error && (
        <Text style={[styles.error, errorStyle]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkboxDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    opacity: 0.6,
  },
  checkmark: {
    color: 'white',
    fontWeight: '700',
  },
  label: {
    marginLeft: 10,
    color: colors.text,
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 32,
  },
});
