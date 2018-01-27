using System;
using System.Collections.Generic;

namespace BingApiCards.JsonSchemas
{
    class ImageAnalysisResponse
    {
        public Description Description { get; set; }
    }

    class Description
    {
        public List<String> Tags { get; set; }
        public List<Caption> Captions { get; set; }
    }

    class Caption
    {
        public string Text { get; set; }
        public float Confidence { get; set; }
    }
}
