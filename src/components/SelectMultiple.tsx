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
import ArrowDownIcon from './icons/ArrowDownIcon';
import CloseIcon from './icons/CloseIcon';
import BottomSheetModal from './BottomSheetModal';

export interface SelectMultipleOption<T = string | number> {
  label: string;
  value: T;
}

export interface SelectMultipleProps<T = string | number> {
  label?: string;
  placeholder?: string;
  options: SelectMultipleOption<T>[];
  value?: T[];
  onChange?: (value: T[]) => void;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  maxSelected?: number;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  inputStyle?: ViewStyle;
  renderOption?: (
    option: SelectMultipleOption<T>,
    isSelected: boolean
  ) => React.ReactNode;
}

export function SelectMultiple<T = string | number>({
  label,
  placeholder = 'Select options',
  options,
  value = [],
  onChange,
  error,
  disabled = false,
  clearable = true,
  maxSelected,
  containerStyle,
  labelStyle,
  errorStyle,
  inputStyle,
  renderOption,
}: SelectMultipleProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const hasSelection = selectedOptions.length > 0;
  const showClearButton = clearable && hasSelection && !disabled;

  const handleToggle = useCallback(
    (option: SelectMultipleOption<T>) => {
      const isSelected = value.includes(option.value);
      let newValue: T[];

      if (isSelected) {
        newValue = value.filter((v) => v !== option.value);
      } else {
        if (maxSelected && value.length >= maxSelected) {
          return;
        }
        newValue = [...value, option.value];
      }

      onChange?.(newValue);
    },
    [onChange, value, maxSelected]
  );

  const handleRemoveItem = useCallback(
    (itemValue: T) => {
      const newValue = value.filter((v) => v !== itemValue);
      onChange?.(newValue);
    },
    [onChange, value]
  );

  const handleClearAll = useCallback(() => {
    onChange?.([]);
  }, [onChange]);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const renderDefaultOption = useCallback(
    (option: SelectMultipleOption<T>, isSelected: boolean) => (
      <View
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {option.label}
        </Text>
      </View>
    ),
    []
  );

  const renderChip = useCallback(
    (option: SelectMultipleOption<T>) => (
      <View key={String(option.value)} style={styles.chip}>
        <Text style={styles.chipText} numberOfLines={1}>
          {option.label}
        </Text>
        {!disabled && (
          <Pressable
            onPress={() => handleRemoveItem(option.value)}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <CloseIcon size={14} color={colors.primary} />
          </Pressable>
        )}
      </View>
    ),
    [disabled, handleRemoveItem]
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
        <View style={styles.inputContent}>
          {hasSelection ? (
            <View style={styles.chipsContainer}>
              {selectedOptions.map(renderChip)}
            </View>
          ) : (
            <Text
              style={[styles.inputText, styles.placeholderText]}
              numberOfLines={1}
            >
              {placeholder}
            </Text>
          )}
        </View>
        <View style={styles.iconsContainer}>
          {showClearButton && (
            <Pressable
              onPress={handleClearAll}
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
          <View style={styles.bottomSheetContent}>
            {hasSelection && (
              <View style={styles.selectedCount}>
                <Text style={styles.selectedCountText}>
                  {selectedOptions.length} selected
                  {maxSelected ? ` (max ${maxSelected})` : ''}
                </Text>
              </View>
            )}
            <FlatList
              data={options}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              renderItem={({ item }) => {
                const isSelected = value.includes(item.value);
                const isDisabled =
                  !isSelected && maxSelected
                    ? value.length >= maxSelected
                    : false;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleToggle(item)}
                    style={[
                      styles.optionTouchable,
                      isDisabled && styles.optionDisabled,
                    ]}
                    disabled={isDisabled}
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
          </View>
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
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  inputContent: {
    flex: 1,
    justifyContent: 'center',
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    maxWidth: 100,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
    paddingTop: 4,
  },
  clearButton: {
    padding: 2,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
  bottomSheetContent: {
    width: '100%',
  },
  selectedCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedCountText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  optionDisabled: {
    opacity: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
    gap: 12,
  },
  optionItemSelected: {
    backgroundColor: colors.primary + '15',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
