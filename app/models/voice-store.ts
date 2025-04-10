import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const ConversationEntryModel = types.model("ConversationEntry").props({
  id: types.identifierNumber,
  speaker: types.string,
  text: types.string,
  timestamp: types.string,
})

export const VoiceStoreModel = types
  .model("VoiceStore")
  .props({
    voiceState: types.optional(
      types.enumeration(["inactive", "connecting", "listening", "speaking"]),
      "inactive",
    ),
    conversationHistory: types.array(ConversationEntryModel),
    currentQuery: types.optional(types.string, ""),
    isProcessing: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get lastUserMessage() {
      for (let i = self.conversationHistory.length - 1; i >= 0; i--) {
        if (self.conversationHistory[i].speaker === "user") {
          return self.conversationHistory[i]
        }
      }
      return null
    },
  }))
  .actions((self) => ({
    setVoiceState(state: "inactive" | "connecting" | "listening" | "speaking") {
      self.voiceState = state
    },
    setCurrentQuery(query: string) {
      self.currentQuery = query
    },
    setIsProcessing(isProcessing: boolean) {
      self.isProcessing = isProcessing
    },
    addToHistory(speaker: string, text: string) {
      self.conversationHistory.push({
        id: Date.now(),
        speaker,
        text,
        timestamp: new Date().toISOString(),
      })

      if (speaker === "user") {
        self.currentQuery = text
      }
    },
    clearHistory() {
      self.conversationHistory.clear()
      self.currentQuery = ""
    },
  }))

export interface VoiceStore extends Instance<typeof VoiceStoreModel> {}
export interface VoiceStoreSnapshot extends SnapshotOut<typeof VoiceStoreModel> {}
