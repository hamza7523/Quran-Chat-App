import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../../lib/theme';

type AyahCitationChipProps = {
  surah: string;
  ayah: number;
};

export default function AyahCitationChip({ surah, ayah }: AyahCitationChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>
        {surah} {ayah}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
  },
  text: {
    ...typography.label,
    fontSize: 10,
    color: colors.goldDeep,
  },
});
