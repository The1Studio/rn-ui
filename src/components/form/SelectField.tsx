import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { colors } from '@repo/core';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import CloseIcon from '../icons/CloseIcon';
import BottomSheetModal from '../overlays/BottomSheetModal';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

export interface SelectFieldProps<T = string | number> {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  inputStyle?: ViewStyle;
  renderOption?: (
    option: SelectOption<T>,
    isSelected: boolean
  ) => React.ReactNode;
}

export function SelectField<T = string | number>({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
  disabled = false,
  clearable = true,
  containerStyle,
  labelStyle,
  errorStyle,
  inputStyle,
  renderOption,
}: SelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const showClearButton = clearable && selectedOption && !disabled;

  const handleSelect = useCallback(
    (option: SelectOption<T>) => {
      onChange?.(option.value);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const renderDefaultOption = useCallback(
    (option: SelectOption<T>, isSelected: boolean) => (
      <View
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
      >
        <Text
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {option.label}
        </Text>
      </View>
    ),
    []
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleOpen}
        disabled={disabled}
        style={[
          styles.inputWrapper,
          error && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
          inputStyle,
        ]}
      >
        <Text
          style={[
            styles.inputText,
            !selectedOption && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <View style={styles.iconsContainer}>
          {showClearButton && (
            <Pressable
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clearButton}
            >
              <CloseIcon size={18} color={colors.textSecondary} />
            </Pressable>
          )}
          <ArrowDownIcon
            size={20}
            color={disabled ? colors.textSecondary : colors.text}
          />
        </View>
      </TouchableOpacity>

      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}

      <BottomSheetModal
        modalVisible={isOpen}
        setModalVisible={setIsOpen}
        title={label || 'Select'}
        renderContent={() => (
          <FlatList
            data={options}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelect(item)}
                  style={styles.optionTouchable}
                >
                  {renderOption
                    ? renderOption(item, isSelected)
                    : renderDefaultOption(item, isSelected)}
                </TouchableOpacity>
              );
            }}
            style={styles.optionsList}
            contentContainerStyle={styles.optionsListContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      />
    </View>
  );
}

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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  inputWrapperDisabled: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    padding: 2,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
  optionsList: {
    flexGrow: 0,
    maxHeight: 300,
    width: '100%',
  },
  optionsListContent: {
    width: '100%',
  },
  optionTouchable: {
    width: '100%',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
  },
  optionItemSelected: {
    backgroundColor: colors.primary + '15',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
