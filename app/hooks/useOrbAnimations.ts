import { useRef, useEffect } from "react"
import { Animated, Easing } from "react-native"
import { VoiceState } from "../types" // Import from the types file

/**
 * A custom hook for managing orb animations
 * @param voiceState - The current voice state
 * @returns Animation utilities for orb effects
 */
export const useOrbAnimations = (voiceState: VoiceState) => {
  // Animation value for pulsing effect
  const pulseAnim = useRef(new Animated.Value(0)).current
  // Animation value for rotation effect
  const rotateAnim = useRef(new Animated.Value(0)).current
  // Animation value for wave effect
  const waveAnim = useRef(new Animated.Value(0)).current
  // Animation value for opacity
  const opacityAnim = useRef(new Animated.Value(voiceState === "inactive" ? 0.5 : 1)).current

  useEffect(() => {
    // Stop any running animations
    Animated.parallel([
      Animated.timing(pulseAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(waveAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).stop()

    // Update opacity based on state
    Animated.timing(opacityAnim, {
      toValue: voiceState === "inactive" ? 0.5 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    // Set up animations based on state
    if (voiceState !== "inactive") {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: voiceState === "listening" ? 1500 : 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: voiceState === "listening" ? 1500 : 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start()

      // Rotation animation for the wave patterns
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000, // Slow rotation
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start()

      // Wave animation for the internal pattern
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: voiceState === "speaking" ? 3000 : 5000,
          easing: Easing.linear,
          useNativeDriver: false, // This animation controls SVG paths, can't use native driver
        }),
      ).start()
    }
  }, [voiceState, pulseAnim, rotateAnim, waveAnim, opacityAnim])

  return { pulseAnim, rotateAnim, waveAnim, opacityAnim }
}
