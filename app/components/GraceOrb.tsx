import { memo, type FC, type ReactNode, Fragment } from "react"
import { View, StyleSheet, Animated } from "react-native"
import Svg, { Circle, Path, Defs, RadialGradient, Stop, G } from "react-native-svg"
import { colors } from "../theme"
import { observer } from "mobx-react-lite"
import { useStores } from "../models"
import { useOrbAnimations } from "../hooks/useOrbAnimations"
import styled from "styled-components/native"

interface GraceOrbProps {
  size?: number
  onPress?: () => void
}

// --- Sub-components (for code splitting) ---

interface OrbWaveProps {
  d: Animated.AnimatedInterpolation<string>
  ringColor: string
  opacity: number
}

const AnimatedPath = Animated.createAnimatedComponent(Path)

const OrbWave: FC<OrbWaveProps> = memo(({ d, ringColor, opacity }) => (
  <AnimatedPath d={d} fill="none" stroke={ringColor} strokeWidth={1} opacity={opacity} />
))
OrbWave.displayName = "OrbWave"

const OrbGradient: FC<{ primaryColor: string; secondaryColor: string }> = memo(
  ({ primaryColor, secondaryColor }) => (
    <Defs>
      <RadialGradient id="orbGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
        <Stop offset="70%" stopColor={secondaryColor} stopOpacity="0.2" />
        <Stop offset="100%" stopColor={colors.background} stopOpacity="0.1" />
      </RadialGradient>
    </Defs>
  ),
)
OrbGradient.displayName = "OrbGradient"

interface OrbRingsProps {
  center: number
  orbSize: number
  ringThickness: number
  ringColor: string
}

const OrbRings: FC<OrbRingsProps> = memo(({ center, orbSize, ringThickness, ringColor }) => (
  <Fragment>
    <Circle
      cx={center}
      cy={center}
      r={orbSize / 2 - ringThickness / 2}
      fill="none"
      stroke={ringColor}
      strokeWidth={ringThickness}
      opacity={0.9}
    />
    <Circle
      cx={center}
      cy={center}
      r={orbSize / 2 - ringThickness * 3}
      fill="none"
      stroke={ringColor}
      strokeWidth={ringThickness}
      opacity={0.7}
    />
  </Fragment>
))
OrbRings.displayName = "OrbRings"

interface OrbContainerProps {
  children: ReactNode
  orbSize: number
  opacityAnim: Animated.Value
  scale: Animated.AnimatedInterpolation<number>
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const OrbContainer = styled(View)`
  align-items: center;
  justify-content: center;
`

OrbContainer.displayName = "OrbContainer"

// --- Main GraceOrb Component ---

export const GraceOrb = observer(function GraceOrb(props: GraceOrbProps) {
  const { size = 200 } = props // Unused onPress removed
  // Note: We're assuming voiceStore will be added to the RootStore type
  const { voiceStore } = useStores() as any
  const voiceState = voiceStore.voiceState

  // Use the custom hook for animations
  const { pulseAnim, rotateAnim, waveAnim, opacityAnim } = useOrbAnimations(voiceState)

  // Get colors based on state
  const getStateColors = () => {
    switch (voiceState) {
      case "listening":
        return {
          primaryColor: colors.palette.primary300, // Replace with appropriate color
          secondaryColor: colors.palette.primary300, // Replace with appropriate color
          ringColor: colors.palette.neutral100,
        }
      case "speaking":
        return {
          primaryColor: colors.palette.secondary300, // Replace with appropriate color
          secondaryColor: colors.palette.secondary300, // Replace with appropriate color
          ringColor: colors.palette.neutral100,
        }
      case "connecting":
        return {
          primaryColor: colors.palette.accent300, // Replace with appropriate color
          secondaryColor: colors.palette.accent300, // Replace with appropriate color
          ringColor: colors.palette.neutral400,
        }
      default:
        return {
          primaryColor: colors.palette.neutral500,
          secondaryColor: colors.palette.neutral500,
          ringColor: colors.palette.neutral400,
        }
    }
  }

  const { primaryColor, secondaryColor, ringColor } = getStateColors()

  const AnimatedG = Animated.createAnimatedComponent(G)

  // Calculate sizes
  const orbSize = size
  const innerSize = orbSize * 0.8
  const center = orbSize / 2
  const ringThickness = 2

  // --- Pre-calculate Wave Paths ---
  const steps = 100
  const radius = (innerSize / 2) * 0.9

  const generateWavePath = (phase: number, amplitude: number, frequency: number) => {
    const points = []
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2
      
      const x = center + Math.cos(angle) * (radius + Math.sin(angle * frequency + phase) * amplitude)
      
      const y = center + Math.sin(angle) * (radius + Math.sin(angle * frequency + phase) * amplitude)
      
      points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)
    }
    return points.join(" ") + " Z"
  }

  // Create an array of pre-calculated paths
  const precalculatedPaths1 = []
  const precalculatedPaths2 = []
  const numPrecalculatedPaths = 20 // Adjust as needed

  for (let i = 0; i < numPrecalculatedPaths; i++) {
    const phase1 = (i / numPrecalculatedPaths) * Math.PI * 2
    const phase2 = (i / numPrecalculatedPaths) * Math.PI * 2 + Math.PI / 2
    precalculatedPaths1.push(generateWavePath(phase1, 5, 4))
    precalculatedPaths2.push(generateWavePath(phase2, 6, 5))
  }

  // Interpolate wave animations using precalculated paths
  const wavePath1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [precalculatedPaths1[0], precalculatedPaths1[numPrecalculatedPaths - 1]],
  })

  const wavePath2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [precalculatedPaths2[0], precalculatedPaths2[numPrecalculatedPaths - 1]],
  })

  // Rotation interpolation - Marked as unused with underscore
  const _spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // Pulse interpolation
  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, voiceState === "listening" ? 1.05 : 1.03],
  })

  // Define the glow opacity once to avoid inline style linter warning
  const glowOpacity = 0.2

  return (
    <View style={styles.container}>
      {/* Glow effect background */}
      <Animated.View
        style={[
          styles.glowBackground,
          {
            backgroundColor: primaryColor,
            opacity: glowOpacity,
            transform: [{ scale }],
          },
        ]}
      />

      {/* Main orb visualization */}
      <OrbContainer orbSize={orbSize} opacityAnim={opacityAnim} scale={scale}>
        <OrbGradient primaryColor={primaryColor} secondaryColor={secondaryColor} />
        {/* Background circle */}
        <Circle cx={center} cy={center} r={innerSize / 2} fill="url(#orbGradient)" />

        {/* Wave patterns - using custom attributes for AnimatedG */}
        <AnimatedG opacity={0.7}>
          <OrbWave d={wavePath1} ringColor={ringColor} opacity={0.7} />
          <OrbWave d={wavePath2} ringColor={ringColor} opacity={0.4} />
        </AnimatedG>

        {/* Outer and Inner Rings */}
        <OrbRings
          center={center}
          orbSize={orbSize}
          ringThickness={ringThickness}
          ringColor={ringColor}
        />
      </OrbContainer>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowBackground: {
    borderRadius: 120,
    height: 240,
    position: "absolute",
    transform: [{ scale: 1.2 }],
    width: 240, //Consider making this dynamic with props.size
  },
  orbContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
})
