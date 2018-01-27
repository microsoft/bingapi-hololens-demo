const contentContainerId = 'content';
const cardTargetId = 'cardcontent';
const loadingIndicatorId = 'loading-indicator';
const baseCardHeight = 150;
const baseCardWidth = 285;

ApiAdaptiveCards.promoteFirstNonWebResult = true;

function renderAdaptiveCard(apiResponse) {
    _scaleContentToFit();
    _updateElementVisibility(false);

    var responseObj = JSON.parse(apiResponse);
    var markups = ApiAdaptiveCards.findAdaptiveCardMarkups(responseObj);

    if (markups.length) {
        let adaptiveCard = ApiAdaptiveCards.createAdaptiveCard();
        let cardContainer = document.getElementById(cardTargetId);
        let resultToShow = markups[0];

        cardContainer.className = 'showing-card';
        cardContainer.innerHTML = '';

        try {
            adaptiveCard.parse(JSON.parse(resultToShow['adaptiveCard']));
            adaptiveCard.render(cardContainer);
        }
        catch (ex) {
            showErrorMessage(ex.message);
        }

        var url = resultToShow['url'] || resultToShow['webSearchUrl'];
        return url;
    }
    else {
        showErrorMessage(_constructNoCardMessage(apiResponse));
        return null;
    }
}

function showLoading() {
    _scaleContentToFit();
    _updateElementVisibility(true);
}

function showErrorMessage(msg) {
    _scaleContentToFit();
    _updateElementVisibility(false);

    var cardContainer = document.getElementById(cardTargetId);
    cardContainer.className = 'showing-msg';
    cardContainer.innerText = msg;
}

function _updateElementVisibility(showLoading) {
    var loadingContainer = document.getElementById(loadingIndicatorId);
    loadingContainer.style.display = showLoading ? 'block' : 'none';

    var cardContainer = document.getElementById(cardTargetId);
    cardContainer.style.display = showLoading ? 'none' : 'block';
}

function _constructNoCardMessage(apiResponse) {
    var obj = JSON.parse(apiResponse);
    var query = obj['queryContext']['originalQuery'];
    return 'No card found for query ' + query + '.';
}

function _scaleContentToFit() {
    var contentContainer = document.getElementById(contentContainerId);
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;
    var sf = Math.min(height / baseCardHeight, width / baseCardWidth);
    contentContainer.style.transform = 'scale(' + sf + ', ' + sf + ')';
}

_scaleContentToFit();

document.addEventListener('click', (evt) => {
    window.external.notify('');
});
