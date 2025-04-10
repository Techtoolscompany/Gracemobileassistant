import { ViewStyle, View, TouchableOpacity, Text, TextStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Screen } from "../components";
import { GraceOrb } from "../components/GraceOrb";
import { colors, spacing } from "../theme";
import { useStores } from "../models";
import { useElevenLabsConversation } from "../hooks/useElevenLabsConversation";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Fix for the Voice not being in AppStackParamList
// We'll make a more flexible type that works with either navigator
type VoiceScreenProps = {
  navigation?: any;
};

export const VoiceScreen = observer(function VoiceScreen(props: VoiceScreenProps) {
  const { navigation } = props;
  const router = useRouter();
  const { voiceStore } = useStores();

  // Use the custom hook
  const { conversation, startConversation, endConversation } = useElevenLabsConversation(voiceStore);

  const getStatusText = () => {
    switch (voiceStore.voiceState) {
      case "inactive":
        return "Tap microphone to start";
      case "connecting":
        return "Connecting...";
      case "listening":
        return "Go ahead, I'm listening";
      case "speaking":
        return "Speaking...";
      default:
        return "Tap microphone to start";
    }
  };

  const goBack = () => {
    if (navigation) {
      // Use React Navigation if available
      navigation.goBack();
    } else {
      // Use Expo Router
      router.back();
    }
  };

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top"]}
      style={$screenStyle}
    >
      <LinearGradient colors={[colors.background, "#0A0F1A"]} style={$backgroundGradient as ViewStyle} />

      {/* Header */}
      <View style={$header as ViewStyle}>
        <TouchableOpacity style={$headerButton as ViewStyle} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={colors.palette.neutral100} />
        </TouchableOpacity>
        <Text style={$headerTitle as TextStyle}>Speaking to Grace</Text>
        <View style={$headerButton as ViewStyle} />
      </View>

      {/* Main content */}
      <View style={$content as ViewStyle}>
        {/* Status text */}
        <Text style={$statusText as TextStyle}>{getStatusText()}</Text>

        {/* Orb visualization */}
        <View style={$orbContainer as ViewStyle}>
          <GraceOrb size={240} />
        </View>

        {/* User query display */}
        {voiceStore.currentQuery ? (
          <View style={$queryContainer as ViewStyle}>
            <Text style={$queryText as TextStyle}>{voiceStore.currentQuery}</Text>
          </View>
        ) : null}
      </View>

      {/* Control buttons */}
      <View style={$controlsContainer as ViewStyle}>
        <View style={$placeholder} />
        <TouchableOpacity
          style={[
            $micButton,
            voiceStore.voiceState !== "inactive" && $micButtonActive,
          ]}
          onPress={voiceStore.voiceState === "inactive" ? startConversation : endConversation}
          disabled={voiceStore.isProcessing}
        >
          <Icon
            name={voiceStore.voiceState === "inactive" ? "mic" : "close"}
            size={32}
            color={voiceStore.voiceState === "inactive" ? colors.background : colors.palette.neutral100}
          />
        </TouchableOpacity>
        <View style={$placeholder} />
      </View>
    </Screen>
  );
});

const $screenStyle: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
};

const $screenContentContainer: ViewStyle = {
  flex: 1,
};

const $backgroundGradient = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const $header = {
  flexDirection: "row" as const,
  justifyContent: "space-between" as const,
  alignItems: "center" as const,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  zIndex: 10,
};

const $headerButton = {
  padding: spacing.sm,
  borderRadius: 999,
};

const $headerTitle = {
  color: colors.palette.neutral100,
  fontSize: 18,
  fontWeight: "bold" as const,
};

const $content = {
  flex: 1,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  paddingHorizontal: spacing.lg,
};

const $statusText = {
  color: colors.palette.neutral400,
  fontSize: 16,
  marginBottom: spacing.xl,
  textAlign: "center" as const,
};

const $orbContainer = {
  marginVertical: spacing.xl,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const $queryContainer = {
  marginTop: spacing.xl,
  width: "100%" as const,
  paddingHorizontal: spacing.md,
};

const $queryText = {
  color: colors.palette.neutral100,
  fontSize: 18,
  textAlign: "center" as const,
};

const $controlsContainer = {
  flexDirection: "row" as const,
  justifyContent: "space-around" as const,
  alignItems: "center" as const,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.lg,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
};

const $placeholder = {
  width: 48,
  height: 48,
};

const $micButton = {
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: colors.palette.angry500,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
};

const $micButtonActive = {
  backgroundColor: colors.palette.angry500,
}; 