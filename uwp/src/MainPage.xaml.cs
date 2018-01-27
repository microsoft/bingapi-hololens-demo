using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Capture;
using Windows.Media.MediaProperties;
using Windows.Media.SpeechRecognition;
using Windows.System;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace BingApiCards
{
    public sealed partial class MainPage : Page
    {
        private MediaCapture mediaCapture;
        private bool mediaCaptureReady;

        private SpeechRecognizer speechRecognizer;
        private static readonly string searchTriggerPhrase = "search";

        private bool isLoading;
        private string searchResultUrl;

        public MainPage()
        {
            this.InitializeComponent();
            this.InitializeSpeechRecognition();
            mediaCaptureReady = false;
            isLoading = false;
        }

        private async void SearchButton_Click(object sender, RoutedEventArgs e)
        {
            if (!isLoading)
            {
                isLoading = true;
                searchResultUrl = null;

                await CardWebView.InvokeScriptAsync("showLoading", new string[] { });

                var image = await this.CaptureImage();
                var result = await SearchApiClient.DoSearch(image);

                if (!string.IsNullOrWhiteSpace(result))
                {
                    searchResultUrl = await CardWebView.InvokeScriptAsync(
                        "renderAdaptiveCard", new string[] { result });
                }
                else
                {
                    var msg = "Unable to process image, please try again.";
                    await CardWebView.InvokeScriptAsync(
                        "showErrorMessage", new string[] { msg });
                }

                isLoading = false;
            }
        }

        private async void CardWebView_ScriptNotify(
            object sender, NotifyEventArgs args)
        {
            if (!string.IsNullOrWhiteSpace(searchResultUrl))
            {
                var uri = new Uri(searchResultUrl);
                await Launcher.LaunchUriAsync(uri);
            }
        }

        private async Task<SoftwareBitmap> CaptureImage()
        {
            await this.InitializeMediaCaptureIfNeeded();

            var lowLagCapture = await mediaCapture.PrepareLowLagPhotoCaptureAsync(
                ImageEncodingProperties.CreateUncompressed(MediaPixelFormat.Bgra8));

            var capturedPhoto = await lowLagCapture.CaptureAsync();
            var softwareBitmap = capturedPhoto.Frame.SoftwareBitmap;

            await lowLagCapture.FinishAsync();

            return softwareBitmap;
        }

        private async Task InitializeMediaCaptureIfNeeded()
        {
            if (!mediaCaptureReady)
            {
                mediaCapture = new MediaCapture();
                await mediaCapture.InitializeAsync();
                mediaCaptureReady = true;
            }
        }
        private async void InitializeSpeechRecognition()
        {
            speechRecognizer = new SpeechRecognizer();

            var session = speechRecognizer.ContinuousRecognitionSession;
            session.ResultGenerated += HandleSpeechResult;

            var phrases = new List<string> { searchTriggerPhrase };
            var constraint = new SpeechRecognitionListConstraint(phrases);
            speechRecognizer.Constraints.Add(constraint);

            var compilationResult = await speechRecognizer.CompileConstraintsAsync();
            if (compilationResult.Status == SpeechRecognitionResultStatus.Success)
            {
                await session.StartAsync();
            }
        }

        private async void HandleSpeechResult(
            SpeechContinuousRecognitionSession session,
            SpeechContinuousRecognitionResultGeneratedEventArgs args)
        {
            if (args.Result.Text == searchTriggerPhrase)
            {
                // Simulate a search button click on the UI thread
                await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                {
                    this.SearchButton_Click(null, null);
                });
            }
        }
    }
}
