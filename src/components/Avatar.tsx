import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { colors } from '@repo/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circle' | 'rounded' | 'square';

export interface AvatarProps {
  /** Image URL */
  imageUrl?: string | null;
  /** Name to display or extract initials from */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Shape variant */
  variant?: AvatarVariant;
  /** Show full name next to avatar */
  showName?: boolean;
  /** Position of the name */
  namePosition?: 'right' | 'bottom';
  /** Custom background color for initials */
  backgroundColor?: string;
  /** Custom text color for initials */
  textColor?: string;
  /** Container style */
  style?: ViewStyle;
  /** Image style override */
  imageStyle?: ImageStyle;
  /** Name text style override */
  nameStyle?: TextStyle;
  /** Initials text style override */
  initialsStyle?: TextStyle;
}

const SIZES: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const FONT_SIZES: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 32,
};

const NAME_FONT_SIZES: Record<AvatarSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const BORDER_RADIUS: Record<AvatarVariant, (size: number) => number> = {
  circle: (size) => size / 2,
  rounded: (size) => size * 0.2,
  square: () => 0,
};

// Generate a consistent color based on name
function getColorFromName(name: string): string {
  const avatarColors = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f43f5e', // rose
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#3b82f6', // blue
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// Extract initials from name
function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({
  imageUrl,
  name = '',
  size = 'md',
  variant = 'circle',
  showName = false,
  namePosition = 'right',
  backgroundColor,
  textColor,
  style,
  imageStyle,
  nameStyle,
  initialsStyle,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const avatarSize = SIZES[size];
  const fontSize = FONT_SIZES[size];
  const nameFontSize = NAME_FONT_SIZES[size];
  const borderRadius = BORDER_RADIUS[variant](avatarSize);

  const hasValidImage = imageUrl && !imageError;
  const initials = getInitials(name);
  const bgColor = backgroundColor || getColorFromName(name);

  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius,
    backgroundColor: hasValidImage ? colors.border : bgColor,
  };

  const renderAvatar = () => (
    <View style={[styles.avatarContainer, avatarStyle]}>
      {hasValidImage ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            { width: avatarSize, height: avatarSize, borderRadius },
            imageStyle,
          ]}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.initials,
            { fontSize, color: textColor || '#ffffff' },
            initialsStyle,
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );

  if (!showName || !name) {
    return <View style={style}>{renderAvatar()}</View>;
  }

  const isHorizontal = namePosition === 'right';

  return (
    <View
      style={[
        styles.container,
        isHorizontal ? styles.containerHorizontal : styles.containerVertical,
        style,
      ]}
    >
      {renderAvatar()}
      <Text
        style={[
          styles.name,
          { fontSize: nameFontSize },
          isHorizontal ? styles.nameRight : styles.nameBottom,
          nameStyle,
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
}

// Avatar with only image (convenience component)
export function AvatarImage(props: Omit<AvatarProps, 'showName'>) {
  return <Avatar {...props} showName={false} />;
}

// Avatar with name displayed
export function AvatarWithName(
  props: Omit<AvatarProps, 'showName'> & { namePosition?: 'right' | 'bottom' }
) {
  return <Avatar {...props} showName={true} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerHorizontal: {
    flexDirection: 'row',
  },
  containerVertical: {
    flexDirection: 'column',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
  },
  name: {
    color: colors.text,
    fontWeight: '500',
  },
  nameRight: {
    marginLeft: 12,
  },
  nameBottom: {
    marginTop: 8,
    textAlign: 'center',
  },
});
