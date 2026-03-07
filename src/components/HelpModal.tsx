import { SetStateAction, Dispatch } from "react";
import { StyleSheet, Text, View, Pressable, Modal} from "react-native";

interface HelpModalProps {
  closeHelp: Dispatch<SetStateAction<boolean>>;
  showHelp: boolean;
}

const HelpModal = ({showHelp, closeHelp}: HelpModalProps) => {
  return(
    <Modal
      transparent
      visible={showHelp}
      animationType="fade"
      onRequestClose={() => closeHelp(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Advanced Mode</Text>
          <Text style={styles.modalFeature}>Touch features:</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Enable/Disable Advanced Mode</Text>: Double tap</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Volume Control</Text>: Swipe up or down</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Track Control</Text>: Swipe left or right</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Rewind Song</Text>: Long press</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Play or Pause</Text>: Single tap</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Go to Playlist</Text>: Pinch out (zoom in)</Text>
          <Text style={styles.modalText}></Text>
          <Text style={styles.modalFeature}>Mouse Features:</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Play/Pause</Text>: Single Click</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Next Song</Text>: Double click</Text>
          <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Previous Song</Text>: Triple Click</Text>
          <Pressable onPress={() => closeHelp(false)} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    color: "#064e3b",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#ecfdf5",       
    padding: 26,
    borderRadius: 18,
    minWidth: 260,
    alignItems: "stretch",

    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,

    borderWidth: 1,
    borderColor: "#a7f3d0", 
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#064e3b",
    marginBottom: 12,
    textAlign: "center",
  },

  modalFeature: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#065f46",
    textAlign: "center",
  },

  modalText: {
    fontSize: 15,
    color: "#065f46",
    textAlign: "left",
    marginVertical: 4,
  },

  closeButton: {
    backgroundColor: "#0f766e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,

    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: "#ecfdf5",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default HelpModal