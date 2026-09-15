# **UncAudioPlayer**

## uncAudioPlayer - An Unconventional Audio Player

I'm using this project explore multiplatform app development, and multiple control options for audio tracks. Current Supported controls are: BT Mouse, tap and swipe gestures, and buttons. Future controls I'm exploring are voice command, and visual(Hand) gestures using Machine Learning Models with Tensorflow js.

<p align="center">
    <img src="https://github.com/KyleTheMaker/kylethemaker.github.io/blob/main/assets/images/uncAudioPlayer-trackPlayer.jpg" width="20%" alt="Player Screen" />
    &nbsp; &nbsp; &nbsp; &nbsp;
    <img src="https://github.com/KyleTheMaker/kylethemaker.github.io/blob/main/assets/images/uncAudio-DemoHome.jpg" width="20%" alt="Home Screen" />
    &nbsp; &nbsp; &nbsp; &nbsp;
    <img src="https://github.com/KyleTheMaker/kylethemaker.github.io/blob/main/assets/images/uncAudioPlayer-Playlist.jpg" width="20%" alt="Playlist Screen" />
    &nbsp; &nbsp; &nbsp; &nbsp;
    <img src="https://github.com/KyleTheMaker/kylethemaker.github.io/blob/main/assets/images/uncAudio-Usage.gif" width="20%" alt="Using the App" />
</p>

## Roadmap

 - [] Repair Swipe Gestures after Dependancy Update
 - [] SQLite storage for selected folder hash the output of all files to compare for updates.
 - [] define and store audio tracks by ID3 tags, or file name values.

## Run the App

1. Clone the repository
2. install dependancies\
`npm install`
3. Create development build with\
`eas build --platform android --profile development`