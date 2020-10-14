/**
 * API key required to access the nytimes API
 */
var apiKey = {
	get: () => {
		return 'SyErnieYe7Blm7UEQhS5kPap3Zkr1Yy0'
	}
};

var latestEntries = [];
/**
 * Variables for enabling paging of Featured Content
 */
var pageSize = 3;
var noOfPages = 1;
var featuredEntries = [];
var currentPage = 1;

/**
 * Function to fetch entries of 'Featured' section
 */
fetch('https://api.nytimes.com/svc/topstories/v2/world.json?api-key=' + apiKey.get())
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
        noOfPages = data.results.length / pageSize;
        /**
         * Since this particular api does not support pagination,
         * implementation has been done this way. 
         *  */ 
		featuredEntries = data.results;
		loadFeaturedContent();
	})
	.catch(function (err) {
		console.log('error: ' + err);
	});

function loadFeaturedContent() {
    document.querySelector('.featured-loading').classList.add('show');

    // load more data
    setTimeout(showFeatured(featuredEntries, currentPage++), 5000);
}

/**
 * Function to show content of 'Featured' section
 */
function showFeatured(data, pageNo) {
	var mainContainer = document.getElementById('featured-data');
	mainContainer.innerHTML = '';
	for (var i = 0; i < 3 * pageNo; i++) {
		var div = document.createElement('div');
		div.classList.add('news', 'container', 'animated', 'fadeInDown');
        div.addEventListener('click', click);
        div.id = 'featured' + '-' + i;
		div.innerHTML = `
            <div class="news-title" title="${data[i].title}">${data[i].title}</div>
            <p>
                <img class="featured-image" src="${data[i].multimedia[4].url}"/>
                <div class="news-content">${data[i].abstract}</div>
            </p>
        `;
		mainContainer.appendChild(div);
	}
	document.querySelector('.featured-loading').classList.remove('show');
}

/**
 * Function to fetch entries of 'Latest' section
 */
fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + apiKey.get())
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
        document.querySelector('.latest-loading').classList.add('show');
        latestEntries = data.results;
		showLatest(latestEntries);
	})
	.catch(function (err) {
		console.log('error: ' + err);
	});

/**
 * Function to show content of 'Featured' section
 */
function showLatest(data) {
	var mainContainer = document.getElementById('latest-data');
	mainContainer.innerHTML = '';
	for (var i = 0; i < 9; i++) {
		var div = document.createElement('div');
		div.classList.add('latest-news', 'container', 'animated', 'fadeInDown');
        div.addEventListener('click', click);
        div.id = 'latest' + '-' + i;
		div.innerHTML = `
        <div class="news-title" title="${data[i].title}">${data[i].title}</div>
        <div class="news-content">${data[i].abstract}</div>
        `;
		mainContainer.appendChild(div);
	}
	document.querySelector('.latest-loading').classList.remove('show');
}

/**
 * Listener for observing scroll and showing updated 'Featured' content.
 */
window.addEventListener('scroll', () => {
	const {
		scrollTop,
		scrollHeight,
		clientHeight
	} = document.documentElement;
	if (clientHeight + scrollTop >= scrollHeight && currentPage <= noOfPages) {
		loadFeaturedContent();
	}
});

function filterContent() {
    if (!event.target.value) {
        currentPage = 1;
        loadFeaturedContent();
    } else {
        showFilteredContent(event.target.value);
    }
}

function filterContent() {
	if (!event.target.value) {
		currentPage = 1;
		loadFeaturedContent();
	} else {
		showFilteredContent(event.target.value);
	}
}

/** 
 * Function to filter the 'Featured' section
 */
function showFilteredContent(filterValue) {
	document.querySelector('.featured-loading').classList.add('show');
	var mainContainer = document.getElementById('featured-data');
	mainContainer.innerHTML = '';
	var filtered = featuredEntries.filter((entry) => {
		let titleLC = entry.title.toLowerCase();
		let filterLC = filterValue.toLowerCase();
		return titleLC.includes(filterLC);
	});
	if (!filtered.length) {
        var div = document.createElement('div');
		div.innerHTML = `
        <div class="no-records">No records found...</div>
        `;
        mainContainer.appendChild(div);
	} else {
		for (var i = 0; i < filtered.length; i++) {
            var div = document.createElement('div');
            div.classList.add('news', 'container', 'animated', 'fadeInDown');
            div.addEventListener('click', click);
            div.id = 'featured' + '-' + i;
			div.innerHTML = `
                <div class="news-title" title="${filtered[i].title}">${filtered[i].title}</div>
                <p>
                    <img class="featured-image" src="${filtered[i].multimedia[4].url}"/>
                    <div class="news-content">${filtered[i].abstract}</div>
                </p>
            `;
            mainContainer.appendChild(div);
		}
	}
	document.querySelector('.featured-loading').classList.remove('show');
}

/** 
 * Function to open overlay with details
 */
function click() {
	var element = event.currentTarget.id.split('-');
	/**
	 * Current entry will have an ID which is of the form 'featured/latest'-index
	 * eg: featured-1 means the entry at featuredEntries[1]
	 * 	   latest-3 means the entry at latestEntries[3]	
	 **/
    var type = element[0];
    var index = Number(element[1]);
    var entry = (type === 'featured') ? featuredEntries[index]: latestEntries[index];
    var mainContainer = document.getElementById('details-overlay');
    mainContainer.innerHTML = '';
    var div = document.createElement('div');
    div.innerHTML = `
    <div class="details-div">
        <h2 class="details-header">Details</h2>
        <h4 class="details-title" title="${entry.title}"><b>${entry.title}</b></h4>
        <div class="details-byline">${entry.byline}</div>
        <p>
            <img class="details-image" src="${entry.multimedia[4].url}"/>
            <div class="details-content">${entry.abstract}</div>
        </p>
    </div>
    `;
    mainContainer.appendChild(div);
	document.getElementById("details").style.width = "100%";
    document.body.style.overflow = 'hidden';
	
}

/** 
 * Function to close overlay with details
 */
function closeDetails() {
	document.body.style.overflow = 'auto';
	document.getElementById("details").style.width = "0%";
}