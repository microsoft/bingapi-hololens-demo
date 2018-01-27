var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ApiAdaptiveCards;
(function (ApiAdaptiveCards) {
    /*
     * Key names for the Adaptive Card nodes in API JSON responses.
     */
    ApiAdaptiveCards.v6AdaptiveCardNodeName = 'adaptiveCards';
    ApiAdaptiveCards.v7AdaptiveCardNodeName = 'adaptiveCard';
    /*
     * Keys and values for the text style additional property.
     */
    ApiAdaptiveCards.textStylePropertyKey = 'textStyle';
    ApiAdaptiveCards.displayTextStyle = 'display';
    /*
     * Sets the font family used for display style text.
     */
    ApiAdaptiveCards.displayTextFont = "'Segoe UI Slab Semibold', 'Roboto Slab', Rockwell, Arial, sans-serif";
    /*
     * Sets whether or not the first non-WebResult card should be promoted to
     * come first when returning card markups (order is otherwise determined
     * by the API response's RankingResponse).
     */
    ApiAdaptiveCards.promoteFirstNonWebResult = false;
    /*
     * Default host config for API Adaptive Cards.
     */
    ApiAdaptiveCards.defaultHostConfig = {
        "spacing": {
            "small": 3,
            "default": 4,
            "medium": 8,
            "large": 14,
            "extraLarge": 20,
            "padding": 10
        },
        "separator": {
            "lineThickness": 1,
            "lineColor": "#EEEEEE"
        },
        "supportsInteractivity": false,
        "fontFamily": "Arial, sans-serif",
        "fontSizes": {
            "small": 12,
            "default": 13,
            "medium": 16,
            "large": 20,
            "extraLarge": 42
        },
        "fontWeights": {
            "lighter": 200,
            "default": 400,
            "bolder": 600
        },
        "containerStyles": {
            "default": {
                "backgroundColor": "#ffffff",
                "foregroundColors": {
                    "default": {
                        "default": "#ff101010",
                        "subtle": "#99101010"
                    },
                    "accent": {
                        "default": "#ff001ba0",
                        "subtle": "#b2001ba0"
                    },
                    "good": {
                        "default": "#ff006d21",
                        "subtle": "#b2006d21"
                    },
                    "warning": {
                        "default": "#ffffd700",
                        "subtle": "#b2ffd700"
                    },
                    "attention": {
                        "default": "#ffc80000",
                        "subtle": "#b2c80000"
                    }
                }
            },
            "emphasis": {
                "backgroundColor": "#ff8c00",
                "fontColors": {
                    "default": {
                        "default": "#ffffff",
                        "subtle": "#ccffffff"
                    },
                    "accent": {
                        "default": "#ff0000ff",
                        "subtle": "#b20000ff"
                    },
                    "good": {
                        "default": "#ff008000",
                        "subtle": "#b2008000"
                    },
                    "warning": {
                        "default": "#ffffd700",
                        "subtle": "#B2ffd700"
                    },
                    "attention": {
                        "default": "#ff8b0000",
                        "subtle": "#b28b0000"
                    }
                }
            }
        },
        "imageSizes": {
            "small": 12,
            "medium": 27,
            "large": 60
        },
        "actions": {
            "maxActions": 5,
            "spacing": 2,
            "buttonSpacing": 10,
            "showCard": {
                "actionMode": 0,
                "inlineTopMargin": 16
            },
            "actionsOrientation": 0,
            "actionAlignment": 0
        },
        "adaptiveCard": {
            "allowCustomStyle": true
        },
        "image": {
            "size": 3
        },
        "imageSet": {
            "imageSize": 3,
            "maxImageHeight": 100
        },
        "factSet": {
            "title": {
                "color": 0,
                "size": 1,
                "isSubtle": false,
                "weight": 2,
                "wrap": true,
                "maxWidth": 150
            },
            "value": {
                "color": 0,
                "size": 1,
                "isSubtle": false,
                "weight": 1,
                "wrap": true
            },
            "spacing": 10
        }
    };
})(ApiAdaptiveCards || (ApiAdaptiveCards = {}));
///<reference path="AdaptiveCardConfig.ts" />
///<reference path="lib\adaptivecards.d.ts" />
var ApiAdaptiveCards;
(function (ApiAdaptiveCards) {
    /*
     * Sets up our Adaptive Card extensions.
     */
    function initAdaptiveCardExtensions() {
        AdaptiveCards.AdaptiveCard.useAdvancedTextBlockTruncation = true;
        AdaptiveCards.AdaptiveCard.useAdvancedCardBottomTruncation = true;
        AdaptiveCards.AdaptiveCard.onParseElement = parseElement;
        AdaptiveCards.AdaptiveCard.elementTypeRegistry.registerType('TextBlock', function () { return new ApiAdaptiveTextBlock(); });
    }
    ApiAdaptiveCards.initAdaptiveCardExtensions = initAdaptiveCardExtensions;
    /*
     * Enables full-bleed background images for containers.
     */
    function parseElement(element, json) {
        if (element instanceof AdaptiveCards.Container) {
            element.bleed = true;
        }
        return element;
    }
    ApiAdaptiveCards.parseElement = parseElement;
    /*
     * Extends TextBlock with support for additional properties regarding
     * text style.
     */
    var ApiAdaptiveTextBlock = /** @class */ (function (_super) {
        __extends(ApiAdaptiveTextBlock, _super);
        function ApiAdaptiveTextBlock() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.textStyle = null;
            return _this;
        }
        ApiAdaptiveTextBlock.prototype.parse = function (json) {
            _super.prototype.parse.call(this, json);
            this.textStyle = json[ApiAdaptiveCards.textStylePropertyKey];
        };
        ApiAdaptiveTextBlock.prototype.render = function () {
            var element = _super.prototype.render.call(this);
            if (this.textStyle == ApiAdaptiveCards.displayTextStyle) {
                element.style.fontFamily = ApiAdaptiveCards.displayTextFont;
            }
            return element;
        };
        return ApiAdaptiveTextBlock;
    }(AdaptiveCards.TextBlock));
    ApiAdaptiveCards.ApiAdaptiveTextBlock = ApiAdaptiveTextBlock;
})(ApiAdaptiveCards || (ApiAdaptiveCards = {}));
///<reference path="AdaptiveCardConfig.ts" />
///<reference path="AdaptiveCardExtensions.ts" />
///<reference path="lib\adaptivecards.d.ts" />
var ApiAdaptiveCards;
(function (ApiAdaptiveCards) {
    /*
     * Parses an API response object and returns an array of Adaptive Card
     * markups.
     */
    function findAdaptiveCardMarkups(apiResponse) {
        var markupsById = {};
        var rankingItems = getRankingResponseItems(apiResponse);
        var rankedIdSet = gatherRankingIds(rankingItems);
        // Keep track of node ids as we go through the tree
        var stack = [[apiResponse, null]];
        while (stack.length) {
            var _a = stack.pop(), node = _a[0], id = _a[1];
            // Use the this node's id if it's included in the ranking response,
            // otherwise keep things under the parent's id
            if (node['id'] in rankedIdSet) {
                id = node['id'];
            }
            if (node[ApiAdaptiveCards.v6AdaptiveCardNodeName]) {
                // For v6, all the cards are under one node, so we're done
                return node[ApiAdaptiveCards.v6AdaptiveCardNodeName];
            }
            else if (node[ApiAdaptiveCards.v7AdaptiveCardNodeName]) {
                markupsById[id] = markupsById[id] || [];
                markupsById[id].push(node);
            }
            for (var key in node) {
                var child = node[key];
                if (child instanceof Array) {
                    // Push array items onto the stack in reverse order, so
                    // they get processed in the order they originally appear
                    // in the array
                    for (var i = child.length - 1; i >= 0; --i) {
                        stack.push([child[i], id]);
                    }
                }
                else if (child instanceof Object) {
                    stack.push([child, id]);
                }
            }
        }
        return buildMarkupsArray(markupsById, rankingItems);
    }
    ApiAdaptiveCards.findAdaptiveCardMarkups = findAdaptiveCardMarkups;
    /*
     * Creates an ApiAdaptiveCard instance.
     */
    function createAdaptiveCard(hostConfig) {
        var card = new AdaptiveCards.AdaptiveCard();
        var config = hostConfig || ApiAdaptiveCards.defaultHostConfig;
        card.hostConfig = new AdaptiveCards.HostConfig(config);
        return card;
    }
    ApiAdaptiveCards.createAdaptiveCard = createAdaptiveCard;
    ApiAdaptiveCards.initAdaptiveCardExtensions();
    /* Helper functions */
    function getRankingResponseItems(apiResponse) {
        var rankingResponse = apiResponse['rankingResponse'];
        var pole = rankingResponse && rankingResponse['pole'];
        var poleItems = pole && pole['items'] || [];
        var mainline = rankingResponse && rankingResponse['mainline'];
        var mainlineItems = mainline && mainline['items'] || [];
        var sidebar = rankingResponse && rankingResponse['sidebar'];
        var sidebarItems = sidebar && sidebar['items'] || [];
        return poleItems.concat(mainlineItems).concat(sidebarItems);
    }
    function gatherRankingIds(rankingItems) {
        var ids = {};
        // Create an object with properties set to true in order to
        // mimic a set
        for (var _i = 0, rankingItems_1 = rankingItems; _i < rankingItems_1.length; _i++) {
            var item = rankingItems_1[_i];
            var id = item['value'] && item['value']['id'];
            if (id)
                ids[id] = true;
        }
        return ids;
    }
    function buildMarkupsArray(markupsById, rankingItems) {
        var markups = [];
        var foundFirstNonWebResult = false;
        // Order the markups by ranking data if we have it
        if (rankingItems && rankingItems.length) {
            for (var _i = 0, rankingItems_2 = rankingItems; _i < rankingItems_2.length; _i++) {
                var item = rankingItems_2[_i];
                var id = item['value'] && item['value']['id'];
                var markupsForId = markupsById[id];
                if (!markupsForId)
                    continue;
                // Insert the markups at the front of the array if this is the
                // first non-WebResult response we've found, and if the option
                // to promote the first non-WebResult card is enabled
                if (ApiAdaptiveCards.promoteFirstNonWebResult && !foundFirstNonWebResult
                    && item['answerType'] !== 'WebPages') {
                    markups.unshift.apply(markups, markupsForId);
                    foundFirstNonWebResult = true;
                }
                else {
                    markups.push.apply(markups, markupsForId);
                }
            }
        }
        else {
            for (var key in markupsById) {
                markups.push.apply(markups, markupsById[key]);
            }
        }
        return markups;
    }
})(ApiAdaptiveCards || (ApiAdaptiveCards = {}));
