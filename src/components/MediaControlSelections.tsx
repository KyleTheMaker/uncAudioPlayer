/**
 * Provides users a way to choose how they control the Audio Player
 */
import { Text, View } from "react-native";
import { useMediaControls } from "@/context/MediaControlContext";
import { Picker } from "@react-native-picker/picker";
import { useThemeStyles } from "@/context/ThemeContext";


export const MediaControlSelections = () => {
    const {mediaControls, setMediaControls} = useMediaControls();
    const theme = useThemeStyles();

    const getSelectedControl = () => {
        if(mediaControls.GestureControl) return "swipe";
        if(mediaControls.MouseControl) return "mouse"
    }

    const handleValueChange = (itemValue: string) => {
        if(itemValue === "button"){
            setMediaControls({ButtonControl: true, GestureControl: false, MouseControl: false});
        }else if(itemValue === "swipe"){
            setMediaControls({ButtonControl: false, GestureControl: true, MouseControl: false});
        }else if(itemValue === "mouse"){
            setMediaControls({ButtonControl: false, GestureControl: false, MouseControl: true});
        }
    }

    return (
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{flex:1, fontSize:16, color: theme.colors.textPrimary}}> Media Controls </Text>
            <Picker
                selectedValue={getSelectedControl()}
                style={{color: theme.colors.textPrimary, flex: 1}}
                dropdownIconColor={theme.colors.textPrimary}
                onValueChange={handleValueChange}>
                <Picker.Item label="Button" value="button" />
                <Picker.Item label="Swipe" value="swipe" />
                <Picker.Item label="Mouse" value="mouse" />
            </Picker>
        </View>
    );
}