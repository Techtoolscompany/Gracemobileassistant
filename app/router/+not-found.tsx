import { View, Text, StyleSheet } from "react-native"
import { Link, Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function NotFound() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.content}>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.description}>The page you're looking for doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  link: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#7356F1",
    borderRadius: 5,
  },
  linkText: {
    color: "#fff",
    fontWeight: "bold",
  },
}) 