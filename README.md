# Bing API Adaptive Cards on HoloLens

Sample code for an app that uses search-by-image functionality to showcase Bing API [Adaptive Cards](https://adaptivecards.io) rendered on HoloLens (or other Windows Mixed Reality devices). The app allows users to get contexual information about their surroundings, in the form of cards, by taking a picture.

## How It Works

After a user takes a picture, (1) the picture is analyzed via a computer vision API, (2) Adaptive Card markup is retrieved from the Bing Web Search API using the image analysis results as the search query, and (3) the card markup is rendered on the device and shown to the user.

Key features of the project include:

- [Bing Web Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/)
- [Microsoft Cognitive Services Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/directory/vision/)
- [Adaptive Cards](https://adaptivecards.io)
- UWP [MediaCapture](https://docs.microsoft.com/en-us/windows/uwp/audio-video-camera/basic-photo-video-and-audio-capture-with-mediacapture) and [SpeechRecognition](https://docs.microsoft.com/en-us/windows/uwp/design/input/speech-recognition) APIs

The app is built as a UWP app with UI optimized for HoloLens. While this keeps the code simple, it means that the user's experience on a Mixed Reality headset is limited to 2D, and is not as immersive as a full 3D app. You're more than welcome to explore further and develop a 3D experience based off this sample, though. Refer to the contribution guidelines below if you'd like to commit your changes to this repo.

## Developing

To get set up for development, follow the instructions in the Windows Dev Center [here](https://developer.microsoft.com/en-us/windows/mixed-reality/install_the_tools). The instructions regarding Unity can be ignored unless you wish to extend upon the sample code using 3D graphics.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
