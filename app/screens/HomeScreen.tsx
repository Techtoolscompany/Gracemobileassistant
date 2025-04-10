import { ViewStyle, View, TouchableOpacity, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "../navigators"
import { Screen } from "../components"
import { colors, spacing } from "../theme"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"

interface HomeScreenProps extends Partial<AppStackScreenProps<"Home">> {}

export const HomeScreen = observer(function HomeScreen(props: HomeScreenProps) {
  const { navigation } = props
  const router = useRouter()

  // Function to handle navigation to the Voice screen
  const goToVoiceScreen = () => {
    if (navigation) {
      // Use React Navigation if available
      navigation.navigate("Voice")
    } else {
      // Use Expo Router if React Navigation is not available
      router.push("/voice")
    }
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top"]}
      style={$screenStyle}
    >
      <LinearGradient colors={[colors.background, "#0A0F1A"]} style={$backgroundGradient} />

      {/* Header */}
      <View style={$header}>
        <Text style={$headerTitle}>Grace</Text>
      </View>

      {/* Main content */}
      <View style={$content}>
        <View style={$cardContainer}>
          <TouchableOpacity
            style={$card}
            onPress={goToVoiceScreen}
          >
            <Icon name="mic" size={40} color={colors.palette.neutral100} />
            <Text style={$cardTitle}>Talk to Grace</Text>
            <Text style={$cardDescription}>Start a voice conversation with Grace</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})

const $screenStyle: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $backgroundGradient = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const $header = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.lg,
  zIndex: 10,
}

const $headerTitle = {
  color: colors.palette.neutral100,
  fontSize: 28,
  fontWeight: "bold",
}

const $content = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
}

const $cardContainer = {
  width: "100%",
  maxWidth: 500,
}

const $card = {
  backgroundColor: colors.purple,
  borderRadius: 16,
  padding: spacing.lg,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
}

const $cardTitle = {
  color: colors.palette.neutral100,
  fontSize: 22,
  fontWeight: "bold",
  marginTop: spacing.md,
}

const $cardDescription = {
  color: colors.palette.neutral200,
  fontSize: 16,
  marginTop: spacing.sm,
  textAlign: "center",
} 