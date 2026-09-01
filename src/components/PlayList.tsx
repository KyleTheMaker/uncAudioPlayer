/**
 *
 * This Component is is to display the playList
 * longpressing song in playlist will enable button -
 * that button removes song from playlist (remove from playlist table)
 *
 *
 */

import { StyleSheet, Text, View, Pressable, FlatList, SectionList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect, useCallback } from "react";
import { getPlayListSongs, removeSongFromPlaylist } from "@/data/musicdb";
import { useFocusEffect } from "expo-router";
import { useSongPlayer } from "@/context/SongContext";
import { SongInfo } from "@/types/audio";
import { useThemeStyles } from "@/context/ThemeContext";

import Song from "./Song";

export interface Section {
  title: String,
  data: SongInfo[]
  
}

const PlayList = () => {
  const db = useSQLiteContext();
  const [songsList, setSongsList] = useState<SongInfo[]>([]);
  const { playNewSong } = useSongPlayer();
  const theme = useThemeStyles();

  const sectionHeaders: string[] = ["a","b","c","d","e",
    "f","g","h","i","j",
    "k","l","m","n","o",
    "p","q","r","s","t",
    "u","v","w","x","y","z"];

  const testData = [
    {
      title: '----- A -----',
      data: ["abe","alice","Andre"],
    },
    {
      title: "----- B -----",
      data: ["Barry","Ben","Biff","Bobby"],
    }
  ];

  //we're getting all songs from playlist table to display in a flatlist
  // useEffect(() => {
  //   loadSongs();
  // }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadSongs();
    }, [])
  );
  

  // for each song, check the first letter of the name
  // Song is object with properties name, and location.
  // Find index value of sections where first letter matches
  // sections object array will have properties header, and data[]
  // if letter not found, add new object with header of letter.
  const splitTrackSections = (songs: SongInfo[]) => {
    let sections: Section[] = [];
    const sectionMap = new Map<string, Section>();
    //add titles to sections
    for(const header of sectionHeaders){
      sections.push({title:header,data:[]})
    }
    // map section titles to its section
    for(const section of sections){
      sectionMap.set(section.title.charAt(0).toLowerCase(), section);
    }
    // add songs to section data
    for(const song of songs){
      const desiredHeader = song.name.charAt(0).toLowerCase();
      const desiredSection = sectionMap.get(desiredHeader);
      if(desiredSection){
        desiredSection.data.push(song);
      }
    }
    sections = sections.filter((section)=>{if(section.data.length >0){return section}});
    console.log(sections);
    return sections;
  }

  const loadSongs = async () => {
    const allSongs = await getPlayListSongs(db);
    const sortedSongs = allSongs.sort(function(a,b){
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if(x < y){return -1;}
      if(x > y){return 1;}
      return 0;
    });
    setSongsList(sortedSongs);
  };

  const handleRemoveSong = async (name: string) => {
    //remove chosen song from list
    const newList = songsList.filter((song) => song.name !== name);
    setSongsList(newList);
    try {
      await removeSongFromPlaylist(db, name);
    } catch (error) {
      console.log("Error removing song from db: ", error);
      loadSongs();
    }
  };

  const handlePlaySong = (songInfo: SongInfo, listArray: SongInfo[], listIndex: number) => {
    playNewSong({name: songInfo.name, location: songInfo.location, listArray, listIndex});
  };

  return (
    <View style={styles.playlist}>
      <Text style={[styles.title, {color: theme.colors.textPrimary}]}>Playlist</Text>
      <SectionList
        showsHorizontalScrollIndicator={true}
        stickySectionHeadersEnabled={true}
        style={{ flex: 1 }}
        sections={splitTrackSections(songsList)}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item, index}) => (
          <Song
            songInfo={item}
            actionText={"Remove Song"}
            playSong={() =>
              handlePlaySong(item, songsList, index)
            }
            actionFunction={() => handleRemoveSong(item.name)}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={[styles.header, {color: theme.colors.textSecondary, backgroundColor: theme.colors.background}]}>--- {title} ---</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  playlist: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 4,
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 20,
  },
  header: {
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
  },
  addRemove: {
    marginEnd: 2,
    backgroundColor: "#a7f3d0",
  },
});

export default PlayList;
