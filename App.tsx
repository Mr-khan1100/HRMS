import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "./src/styles/theme";
import { persistor, store } from "./src/redux/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return(
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaContainer} >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppNavigator/>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaContainer : {
    flex : 1,
    backgroundColor: COLORS.background,
  },
});

