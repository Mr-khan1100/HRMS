import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {COLORS} from '@styles/theme';
import backIcon from '@assets/images/back_icon.png';

const CustomHeader = ({
  title,
  onBackPress,
  showBackIcon = false,
  containerStyle,
  titleStyle,
}) => {


  return (
    <>
      {/* <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" /> */}
      <View style={[styles.container, containerStyle]}>
        <View style={styles.sideContainer}>
          {showBackIcon && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
               <Image
                source={backIcon}
                style={styles.backArrow}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '8%',
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  sideContainer: {
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 20,
    marginLeft: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
      fontWeight: '600',
      color: COLORS.headerLabel,
      textAlign: 'center',
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  ButtonStyle: {
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextStyle: {
    color: COLORS.headerLabel,
    fontSize: 16,
  },
});

export default CustomHeader;
