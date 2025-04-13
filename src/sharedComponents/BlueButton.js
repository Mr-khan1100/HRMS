import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "@styles/theme";

export const BlueButton = ({onPress, label, buttonStyle, textStyle, containerStyle}) => {
    return (
        <View style={[styles.buttonContainer, containerStyle]}>
            <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
                <Text style={[styles.buttonText, textStyle]}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});