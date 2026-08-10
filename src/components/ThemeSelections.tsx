/**
 * Provides users a way to choose how they control the Audio Player
 */
import { Text, View } from "react-native";
import { useThemeStyles } from "@/context/ThemeContext";
import { Picker } from "@react-native-picker/picker";


export const ThemeStyleSelections = () => {
    const {themeStyle, setThemeStyle} = useThemeStyles();
    const theme = useThemeStyles();

    const getSelectedTheme = () => {
        return themeStyle;
    }

    const handleValueChange = (itemValue: string) => {
        if(itemValue === "light"){
            setThemeStyle("light");
        }else if(itemValue === "dark"){
            setThemeStyle("dark");
        }else if(itemValue === "sysDefault"){
            setThemeStyle("system");
        }
    }

    return (
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{flex:1, fontSize:16, color: theme.colors.textPrimary}}> Theme Style </Text>
            <Picker
                selectedValue={getSelectedTheme()}
                style={{color: theme.colors.textPrimary, flex: 1}}
                dropdownIconColor={theme.colors.textPrimary}
                onValueChange={handleValueChange}>
                <Picker.Item label="Light" value="light" />
                <Picker.Item label="Dark" value="dark" />
                <Picker.Item label="Device Default" value="system" />
            </Picker>
        </View>
    );
}