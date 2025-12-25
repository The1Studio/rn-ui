import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface ICalendarIconProps {
  size?: number;
  color?: string;
}

const CalendarIcon = ({ size = 24, color = '#6B7280' }: ICalendarIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={4}
      width={18}
      height={18}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M16 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M8 2V6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M3 10H21" stroke={color} strokeWidth={2} />
    <Path
      d="M8 14H8.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M12 14H12.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M16 14H16.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M8 18H8.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M12 18H12.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M16 18H16.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default CalendarIcon;
