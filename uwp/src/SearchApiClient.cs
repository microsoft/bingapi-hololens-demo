using BingApiCards.JsonSchemas;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Storage.Streams;

namespace BingApiCards
{
    static class SearchApiClient
    {
        // Add your Azure Computer Vision & Bing Search subscription key to your environment variables.
        private const string VisionApiKey = Environment.GetEnvironmentVariable("COMPUTER_VISION_SUBSCRIPTION_KEY");
        private const string SearchApiKey = Environment.GetEnvironmentVariable("BING_SEARCH_V7_SUBSCRIPTION_KEY");
        // Add your Azure Computer Vision & Bing Search endpoint to your environment variables.
        private const string VisionBaseUrl = Environment.GetEnvironmentVariable("COMPUTER_VISION_ENDPOINT");
        private const string SearchBaseUrl = Environment.GetEnvironmentVariable("BING_SEARCH_V7_ENDPOINT");

        public static async Task<string> DoSearch(SoftwareBitmap image)
        {
            byte[] imageBytes = await GetImageAsByteArray(image);

            var imageResult = await MakeOcrRequest(imageBytes);
            if (string.IsNullOrWhiteSpace(imageResult))
            {
                imageResult = await MakeImageAnalysisRequest(imageBytes);
            }

            if (!string.IsNullOrWhiteSpace(imageResult))
            {
                return await MakeBingApiRequest(imageResult);
            }

            return null;
        }

        private static async Task<string> MakeOcrRequest(byte[] image)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", VisionApiKey);

            var url = VisionBaseUrl + "/ocr";

            using (var postBody = new ByteArrayContent(image))
            {
                postBody.Headers.ContentType = new MediaTypeHeaderValue(
                    "application/octet-stream");

                var httpResponse = await client.PostAsync(url, postBody);
                var response = await httpResponse.Content.ReadAsStringAsync();
                return ProcessOcrResponse(response);
            }
        }

        private static async Task<string> MakeImageAnalysisRequest(byte[] image)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", VisionApiKey);

            var queryParams = "?visualFeatures=Description&language=en";
            var url = VisionBaseUrl + "/analyze" + queryParams;

            using (var postBody = new ByteArrayContent(image))
            {
                postBody.Headers.ContentType = new MediaTypeHeaderValue(
                    "application/octet-stream");

                var httpResponse = await client.PostAsync(url, postBody);
                var response = await httpResponse.Content.ReadAsStringAsync();
                return ProcessAnalysisResponse(response);
            }
        }

        private static async Task<string> MakeBingApiRequest(string query)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", SearchApiKey);

            var queryParams = $"?q={query}&adaptivecard=true&screenshotstyle=small";
            var url = SearchBaseUrl + queryParams;

            var httpResponse = await client.GetAsync(url);
            return await httpResponse.Content.ReadAsStringAsync();
        }

        private static async Task<byte[]> GetImageAsByteArray(SoftwareBitmap image)
        {
            using (var stream = new InMemoryRandomAccessStream())
            {
                var encoder = await BitmapEncoder.CreateAsync(
                    BitmapEncoder.JpegEncoderId, stream);

                encoder.SetSoftwareBitmap(image);

                // Scale the image to 720p to make sure we don't exceed API size limits
                var maxDimension = Math.Max(image.PixelHeight, image.PixelWidth);
                var sf = 1280f / maxDimension;
                encoder.BitmapTransform.ScaledWidth = (uint)(image.PixelHeight * sf);
                encoder.BitmapTransform.ScaledHeight = (uint)(image.PixelWidth * sf);

                await encoder.FlushAsync();

                var reader = new DataReader(stream.GetInputStreamAt(0));
                var byteArr = new byte[stream.Size];
                await reader.LoadAsync((uint)stream.Size);

                reader.ReadBytes(byteArr);
                return byteArr;
            }
        }

        private static string ProcessOcrResponse(string response)
        {
            Debug.WriteLine(response);
            var responseObj  = JsonConvert.DeserializeObject<OcrResponse>(response);

            if (responseObj.Regions != null && responseObj.Regions.Count > 0)
            {
                var words = new List<string>();

                // Only take the first region for now
                foreach (var line in responseObj.Regions[0].Lines)
                {
                    foreach (var word in line.Words)
                    {
                        words.Add(word.Text);
                    }
                }

                return string.Join(" ", words);
            }

            return null;
        }

        private static string ProcessAnalysisResponse(string response)
        {
            Debug.WriteLine(response);
            var responseObj = JsonConvert.DeserializeObject<ImageAnalysisResponse>(response);
            var description = responseObj.Description;

            if (description?.Captions?.Count > 0)
            {
                // Use the first caption (should have the highest confidence)
                return description.Captions[0].Text;
            }
            else if (description?.Tags?.Count > 0)
            {
                var maxCount = Math.Max(description.Tags.Count, 5);
                return string.Join(" ", description.Tags.GetRange(0, maxCount));
            }

            return null;
        }
    }
}
