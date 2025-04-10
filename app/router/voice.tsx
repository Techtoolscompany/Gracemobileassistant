import { VoiceScreen } from "../screens/VoiceScreen"
import { Stack } from "expo-router"
import { Fragment } from "react"

export default function VoiceRoute() {
  return (
    <Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <VoiceScreen />
    </Fragment>
  )
} 