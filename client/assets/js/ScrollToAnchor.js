var scrollableElement = document.getElementsByTagName('main')[0];
var sectionElements = document.getElementsByTagName('section');
var elementIds = [];
for(var idx = 0; idx < sectionElements.length; idx++){
    elementIds.push(sectionElements[idx].id);
}
var currentElement = elementIds[0];
var touchStart;
var eventComplete = true;
const nextScrollDelay = 1100;
var scrollFunctionLocked = false;
var mobileMenuElement = document.getElementById('menu-hamburger');

// Original code for scrollFunction() found on StackOverflow solution by Em Seven 
// https://stackoverflow.com/questions/25020582/scrolling-to-an-anchor-using-transition-css3
// added a variable to check for events already in progress to keep events from overlapping.

function scrollFunction(scrollToLocation, duration) {
    eventComplete = false;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;   
    if (scrollTop == scrollToLocation) {
        eventComplete = true;
        return;
    }
    const intervalLength = 10;
    const diff = scrollToLocation - scrollTop;
    const scrollStep = Math.PI / (duration / intervalLength);
    var count = 0;
    var start = window.pageYOffset;
    var currPos;
    scrollInterval = setInterval(function(){
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        // Note: on high-DPI machines, scrollTop is set slightly lower (less than one pixel) than expected
        if (Math.ceil(scrollTop) != scrollToLocation) {
            count += 1;
            currPos = easeInOutStep(start, diff, count, scrollStep);
            document.body.scrollTop = currPos;
            document.documentElement.scrollTop = currPos;
        }
        else { 
            clearInterval(scrollInterval);
            eventComplete = true;
        }
    },intervalLength);
}

function easeInOutStep(start, diff, count, scrollStep){
    var easing = start + diff * (0.5 - (0.5 * Math.cos(count * scrollStep)));
    return easing;
}

function scrollToElement(elementId){
    if(eventComplete === false){
        return;
    }
    var nextElement = document.getElementById(elementId);
    const duration = 500;
    currentElement = elementId;
    scrollFunction(nextElement.offsetTop, duration);
}

// Function executes scrolling and closes the mobile navigation menu.

// function onMobileMenuClick(elementId) {
//     scrollToElement(elementId);
//     closeMobileMenu();
// }

// function closeMobileMenu() {
//     mobileMenuElement.checked = false;    
// }

scrollableElement.addEventListener('wheel', 
    function(event) {
        event.preventDefault();
        if(!scrollFunctionLocked) {
            findWheelDirectionAndScroll(event);
        }
    },
    {passive: false}
);
scrollableElement.addEventListener('touchstart',  
    function(event) {
        event.preventDefault();
        // console.log('in event listener');
        // code below is only nessesary if utilizing checkbox menu system
        // if(mobileMenuElement && mobileMenuElement.checked){
        //     mobileMenuElement.checked = false;
        // }
        if(event.target.classList[0] == "touch-btn") {
            var parentElementHash = event.target.parentElement.hash;
            var elementID = parentElementHash.slice(1);
            scrollToElement(elementID);
        }
        else {
            findTouchStart(event);
        }
    }, 
    {passive: false}
);
scrollableElement.addEventListener('touchend',  
    function(event) {
        event.preventDefault();
        if(event.target.classList[0] == "touch-btn") {
            return;
        }
        else {
            findTouchDirectionAndScroll(event);
        }
    }, 
    {passive: false}
);

function findTouchStart(event) {
    touchStart = event.changedTouches[0].screenY
    console.log(touchStart)
}

// Function used to find the direction of the end of a touch event to determine which direction to 
// scroll the element.

function findTouchDirectionAndScroll(event) {
    var touchEnd = event.changedTouches[0].screenY;

    if(touchStart < touchEnd) {
        scrollUp();
    }
    else if (touchStart > touchEnd) {
        scrollDown();
    }
}

// Function used to find the direction of the wheel event to determine which direction to 
// scroll the element.


function releaseLock(){
    scrollFunctionLocked = false;
}

function findWheelDirectionAndScroll(event){
    var delta;
    scrollFunctionLocked = true;
    if (event.wheelDelta) {
        delta = event.wheelDelta;
    } else {
        delta = -1 * event.deltaY;
    }
    var scrollFunction = (delta < 0) ? scrollDown : scrollUp;
    scrollFunction();
    window.setTimeout('releaseLock()', nextScrollDelay);
}
function scrollDown(){
    nextElementIndex = elementIds.indexOf(currentElement) + 1;
    if(nextElementIndex > elementIds.length-1 || !eventComplete) {
        return;
    }
    scrollToElement(elementIds[nextElementIndex]);
    currentElement = elementIds[nextElementIndex];
}
function scrollUp(){
    previousElementIndex = elementIds.indexOf(currentElement) - 1;
    if(previousElementIndex < 0 || !eventComplete) {
        return;
    }
    scrollToElement(elementIds[previousElementIndex]);
    currentElement = elementIds[previousElementIndex];
}

function activeLinkColoring(currentLink, nextLink){
    currentSelectedLink = document.getElementsByName(currentLink)[0]
    nextSelectedLink = document.getElementsByName(nextLink)[0];
    currentSelectedLink.className = null;
    nextSelectedLink.className = "active";
}