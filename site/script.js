var apiKey = 'SyErnieYe7Blm7UEQhS5kPap3Zkr1Yy0';

fetch('https://api.nytimes.com/svc/topstories/v2/world.json?api-key=' + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        showFeatured(data);
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

function showFeatured(data) {
    var mainContainer = document.getElementById('featured-data');
    mainContainer.innerHTML = '';
    for (var i = 0; i < 3; i++) {
        var div = document.createElement('div');
        div.classList.add('news', 'container');

        var header = document.createElement('div');
        header.innerHTML = data.results[i].title;
        header.classList.add('news-title');
        
        var p = document.createElement('p');
        
        var image = document.createElement('img');
        image.src = data.results[i].multimedia[4].url;
        image.classList.add('featured-image');
        
        var desc = document.createElement('div');
        desc.innerHTML = data.results[i].abstract;
        desc.classList.add('news-content');
        
        div.appendChild(header);
        p.appendChild(image);
        p.appendChild(desc);
        div.appendChild(p);
        
        mainContainer.appendChild(div);
    }
}

fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        showLatest(data);
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

function showLatest(data) {
    var mainContainer = document.getElementById('latest-data');
    mainContainer.innerHTML = '';
    for (var i = 0; i < 9; i++) {
        var div = document.createElement('div');
        div.classList.add('latest-news', 'container');

        var header = document.createElement('div');
        header.innerHTML = data.results[i].title;
        header.classList.add('news-title');
        
        var desc = document.createElement('div');
        desc.innerHTML = data.results[i].abstract;
        desc.classList.add('news-content');
        
        div.appendChild(header);
        div.appendChild(desc);
        
        mainContainer.appendChild(div);
    }
}