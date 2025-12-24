import { useWindowDimensions, PixelRatio, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const useResponsive = () => {
  const { width, height, fontScale } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isLargeScreen = width >= 1024;

  // Font normalize (không scale quá tay)
  const normalizeFont = (size: number) => size / fontScale;

  return {
    // screen
    width,
    height,
    fontScale,

    // device
    isLandscape,
    isTablet,
    isLargeScreen,

    // scale helpers
    scale,
    verticalScale,
    moderateScale,

    // font
    normalizeFont,
  };
};

const { height, width } = Dimensions.get('window');

export const widthPercentageToDP = (widthPercent: number | string) => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.getFontScale() >= 1
    ? PixelRatio.roundToNearestPixel((width * elemWidth) / 100)
    : Math.round(
        ((width * elemWidth) / 100) * Math.round(PixelRatio.getFontScale())
      );
};

export const heightPercentageToDP = (heightPercent: number | string) => {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.getFontScale() >= 1
    ? PixelRatio.roundToNearestPixel((height * elemHeight) / 100)
    : Math.round(
        ((height * elemHeight) / 100) * Math.round(PixelRatio.getFontScale())
      );
};

export const responsiveFontWidth = (widthPercent: number | string) => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return (
    PixelRatio.roundToNearestPixel((width * elemWidth) / 100) /
    PixelRatio.getFontScale()
  );
};

/**
 * @New_constants
 */

const widthBaseScale = width / 430;
const heightBaseScale = height / 932;

function normalize(size: number, based = 'width') {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
/* responsive width from figma px to px */
export const widthPixel = (size: number) => {
  return normalize(size, 'width');
};
/* responsive height from figma px to px */
export const heightPixel = (size: number) => {
  return normalize(size, 'height');
};

/* responsive font from figma px to px */
export const fontPixel = (size: number) => {
  return widthPixel(size);
};
