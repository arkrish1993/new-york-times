/**
 * API key required to access the nytimes API
 */
var apiKey = {
	get: () => {
		return 'SyErnieYe7Blm7UEQhS5kPap3Zkr1Yy0'
	}
};

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
		div.classList.add('news', 'container');
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
		showLatest(data);
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
		div.classList.add('latest-news', 'container');
		div.innerHTML = `
        <div class="news-title" title="${data.results[i].title}">${data.results[i].title}</div>
        <div class="news-content">${data.results[i].abstract}</div>
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

function showFilteredContent(filterValue) {
	document.querySelector('.featured-loading').classList.add('show');
	var mainContainer = document.getElementById('featured-data');
	mainContainer.innerHTML = '';
	var filtered = featuredEntries.filter((val) => {
		return val.title.includes(filterValue);
	});
	var div = document.createElement('div');
	if (!filtered.length) {
		div.innerHTML = `
        <div class="no-records">No records found...</div>
        `;
	} else {
		div.classList.add('news', 'container');
		for (var i = 0; i < filtered.length; i++) {
			div.innerHTML = `
                <div class="news-title" title="${filtered[i].title}">${filtered[i].title}</div>
                <p>
                    <img class="featured-image" src="${filtered[i].multimedia[4].url}"/>
                    <div class="news-content">${filtered[i].abstract}</div>
                </p>
            `;
		}
	}
	mainContainer.appendChild(div);
	document.querySelector('.featured-loading').classList.remove('show');
}