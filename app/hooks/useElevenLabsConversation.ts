import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { Conversation } from "@11labs/client";
import { elevenLabsApi } from "../services/api/elevenlabs-api";
import { VoiceStore } from "../models/voice-store"; // Import the VoiceStore type
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

export const useElevenLabsConversation = (voiceStore: VoiceStore) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const navigation = useNavigation(); //For n8n navigation

  const requestMicrophonePermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      return false;
    }
  };

  const startConversation = useCallback(async () => {
    if (voiceStore.isProcessing) return;
    voiceStore.setIsProcessing(true);
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert("Permission Required", "Grace needs microphone access to hear you.");
      voiceStore.setIsProcessing(false);
      return;
    }

    try {
      voiceStore.setVoiceState("connecting");
      const signedUrl = await elevenLabsApi.getSignedUrl();
      const convInstance = await Conversation.startSession({
        signedUrl: signedUrl,
        onConnect: () => {
          voiceStore.setVoiceState("speaking");
          voiceStore.setIsProcessing(false);
          voiceStore.addToHistory("assistant", "Go ahead, I'm listening. How can I help you today?");
        },
        onDisconnect: () => {
          voiceStore.setVoiceState("inactive");
          voiceStore.setIsProcessing(false);
          // Process with n8n
          if (voiceStore.conversationHistory.length > 0) {
            elevenLabsApi.processWithN8n(voiceStore.conversationHistory)
              .then(result => {
                if (result.success && result.data?.actions) {
                  handleN8nActions(result.data.actions);
                }
              })
              .catch(err => console.error("n8n processing error:", err));
          }
        },
        onError: (error) => {
          console.error("Conversation error:", error);
          Alert.alert("Connection Error", "There was a problem connecting to Grace.");
          voiceStore.setVoiceState("inactive");
          voiceStore.setIsProcessing(false);
        },
        onModeChange: ({ mode }) => {
          if (mode === "speaking") {
            voiceStore.setVoiceState("speaking");
          } else if (mode === "listening") {
            voiceStore.setVoiceState("listening");
          }
        },
        onUserMessage: (message) => {
          voiceStore.addToHistory("user", message.text);
        },
        onAssistantMessage: (message) => {
          voiceStore.addToHistory("assistant", message.text);
        },
      });
      setConversation(convInstance);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      Alert.alert("Connection Error", "Unable to connect to Grace.");
      voiceStore.setVoiceState("inactive");
      voiceStore.setIsProcessing(false);
    }
  }, [voiceStore, navigation]); // Include navigation in dependencies

    const endConversation = useCallback(async () => {
        if (!conversation || voiceStore.isProcessing) return;
        voiceStore.setIsProcessing(true);
        try {
            await conversation.endSession();
            setConversation(null);
            voiceStore.setVoiceState("inactive");
        } catch (error) {
            console.error("Error ending conversation:", error);
        } finally {
            voiceStore.setIsProcessing(false);
        }
    }, [conversation, voiceStore]);

  // Handle n8n actions (moved here from VoiceScreen)
    const handleN8nActions = (actions) => {
        if (!actions || !Array.isArray(actions)) return;
        actions.forEach((action) => {
            switch (action.type) {
                case "navigate":
                    navigation.navigate(action.screen, action.params);
                    break;
                case "showMessage":
                    Alert.alert("Message", action.message);
                    break;
                default:
                    console.log("Unknown action type:", action.type);
            }
        });
    };
    useEffect(() => {
        return () => {
            if(conversation){
                endConversation();
            }
        }
    }, [conversation, endConversation]) // Add endConversation as a dependency.

  return { conversation, startConversation, endConversation };
}; 