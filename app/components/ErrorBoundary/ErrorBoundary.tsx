import { Component, ErrorInfo, ReactNode } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { colors } from "../../theme"

interface Props {
  children: ReactNode
  catchErrors?: boolean
  onReset?: () => void
}

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary component to catch JavaScript errors anywhere in child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  static defaultProps = {
    catchErrors: true,
  }

  state: State = {
    error: null,
    errorInfo: null,
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.catchErrors) {
      // Update state with error details
      this.setState({
        error,
        errorInfo,
      })
      
      // Log the error to an error reporting service
      console.error("Error caught by ErrorBoundary:", error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({
      error: null,
      errorInfo: null,
    })
    
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error.toString()}</Text>
          <TouchableOpacity style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.palette.primary500,
    borderRadius: 8,
    marginTop: 20,
    padding: 12,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  title: {
    color: colors.error,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
}) 