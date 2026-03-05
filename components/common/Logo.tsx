import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../../constants/Colors';

export const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Aapa Capital</Text>
      <Text style={styles.tagline}>Your Investment Partner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
});
