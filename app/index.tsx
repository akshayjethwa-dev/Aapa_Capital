import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function Index() {
  // Routing logic is completely handled by _layout.tsx based on Auth state.
  // This screen is just an empty placeholder to prevent flickering while the layout decides where to route.
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});