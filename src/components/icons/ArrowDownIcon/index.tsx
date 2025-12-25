import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IArrowDownIconProps {
  size?: number;
  color?: string;
}

const ArrowDownIcon = ({ size = 24, color = '#6B7280' }: IArrowDownIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowDownIcon;
