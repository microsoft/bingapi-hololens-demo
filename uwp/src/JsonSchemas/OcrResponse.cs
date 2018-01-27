using System.Collections.Generic;

namespace BingApiCards.JsonSchemas
{
    class OcrResponse
    {
        public List<Region> Regions { get; set; }
    }

    class Region
    {
        public string BoundingBox { get; set; }
        public List<Line> Lines { get; set; }
    }

    class Line
    {
        public string BoundingBox { get; set; }
        public List<Word> Words { get; set; }
    }

    class Word
    {
        public string BoundingBox { get; set; }
        public string Text { get; set; }
    }
}
