import { TextStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(40),
    fontWeight: "700",
  },
  h2: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    fontWeight: "600",
  },
  body: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
  },
  caption: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
};
