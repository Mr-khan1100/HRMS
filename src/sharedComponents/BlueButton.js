import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "@styles/theme";

export const BlueButton = ({onPress, label, buttonStyle, textStyle, containerStyle, disabled = false }) => {
    return (
        <View style={[styles.buttonContainer, containerStyle]}>
            <TouchableOpacity style={[styles.button, buttonStyle, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled} >
                <Text style={[styles.buttonText, textStyle, disabled && styles.disabledText]}>{label}</Text>
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
  disabledButton: {
    backgroundColor: COLORS.grey,
    opacity: 0.7
  },
  disabledText: {
    color: COLORS.background,
  }
});