/**
 * This file is for updating the various
 * interfaces and types related to the 
 * song or audio playing
 */

// when referenceing audio, may be replaced with AudioData... but AudioData references it?
export interface SongInfo {
    name: string,
    location: string | number | null
}

//in case a general audio description is needed
export interface AudioData {
  name: string,
  location: string | number | null,
  listArray: SongInfo[],
  listIndex: number
}
