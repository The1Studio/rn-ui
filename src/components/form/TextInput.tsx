import React, { forwardRef, ReactNode } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  Pressable,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@repo/core';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: ReactNode;
  leftIconContainerStyle?: ViewStyle;
  rightIcon?: ReactNode;
  rightIconContainerStyle?: ViewStyle;
  onRightIconPress?: () => void;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      containerStyle,
      labelStyle,
      inputStyle,
      errorStyle,
      leftIcon,
      leftIconContainerStyle,
      rightIcon,
      rightIconContainerStyle,
      onRightIconPress,
      ...props
    },
    ref
  ) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    const renderRightIcon = () => {
      if (!hasRightIcon) return null;

      const containerStyle = [styles.rightIconContainer, rightIconContainerStyle];

      if (onRightIconPress) {
        return (
          <Pressable
            onPress={onRightIconPress}
            style={containerStyle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </Pressable>
        );
      }

      return <View style={containerStyle}>{rightIcon}</View>;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
          {hasLeftIcon && (
            <View style={[styles.leftIconContainer, leftIconContainerStyle]}>
              {leftIcon}
            </View>
          )}
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              hasLeftIcon && styles.inputWithLeftIcon,
              hasRightIcon && styles.inputWithRightIcon,
              inputStyle,
            ]}
            placeholderTextColor={colors.textSecondary}
            {...props}
          />
          {renderRightIcon()}
        </View>
        {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  leftIconContainer: {
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 12,
  },
  inputWithRightIcon: {
    paddingRight: 12,
  },
  rightIconContainer: {
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
});
