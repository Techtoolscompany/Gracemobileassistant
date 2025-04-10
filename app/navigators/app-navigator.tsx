import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import Config from "../config"
import { VoiceScreen, HomeScreen } from "../screens"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "../theme"

export type AppStackParamList = {
  Home: undefined
  Voice: undefined
  // Add other screens here
}

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.palette.neutral100,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Voice" component={VoiceScreen} />
      {/* Add other screens here */}
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler(canExit)

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})

AppNavigator.displayName = "AppNavigator"

const exitRoutes = Config.exitRoutes

export const canExit = (routeName: string) => exitRoutes.includes(routeName) 