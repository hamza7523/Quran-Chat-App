import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius } from '../../lib/theme';

type ProgressBarProps = {
  progress: number;
  height?: number;
  fillColor?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
  complete?: boolean;
};

export default function ProgressBar({
  progress,
  height = 4,
  fillColor,
  trackColor,
  style,
  complete,
}: ProgressBarProps) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  const fill = fillColor ?? (complete ? colors.success : colors.gold);

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor ?? 'rgba(168,204,168,0.30)' }, style]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fill, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: radius.sm,
  },
});
