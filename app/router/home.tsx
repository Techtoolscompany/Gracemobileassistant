import { HomeScreen } from "../screens/HomeScreen"
import { Stack } from "expo-router"

export default function HomeRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  )
} 