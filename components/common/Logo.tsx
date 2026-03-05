import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 80 }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/icon.png')} 
        style={{ 
          width: size, 
          height: size, 
          resizeMode: 'contain',
          borderRadius: size / 4 // Optional: adds a slight curve if your logo is a square
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Adds a nice subtle drop shadow to the logo
  }
});