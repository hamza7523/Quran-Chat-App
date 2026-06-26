import { View, StyleSheet } from 'react-native';
import { colors } from '../../lib/theme';

// Lightweight decorative pattern — no SVG dependency needed
export default function StarPattern() {
  const dots = Array.from({ length: 24 });
  return (
    <View style={styles.container} pointerEvents="none">
      {dots.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              top: `${Math.sin(i * 2.6) * 40 + 50}%`,
              left: `${(i / 24) * 100}%`,
              opacity: 0.04 + (i % 4) * 0.015,
              transform: [{ scale: 0.6 + (i % 3) * 0.4 }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sage600,
  },
});