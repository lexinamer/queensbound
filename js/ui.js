// Initialize Tabletop to get gSheet data
let publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1IuicD2xPSk9HibXcW42GLBsGJcKCQ4jV4cXbMi0fRT8/pubhtml';

function init() {
  Tabletop.init({ key: publicSpreadsheetUrl,
    callback: processData,
    simpleSheet: true })
};

// Process data from gSheet
function processData(data) {
  let poemArray = [];
  let numberSelected = 0;

  // Push only published rows to poemArray
  for (let i = 0; i < data.length; i++) {
    if (data[i].Published == 'Yes') {
      poemArray.push(data[i]);
      numberSelected++;
    };
  };

  if($(window).width() >= 767){
    processMap(poemArray);
  } else {
    processMobile(poemArray);
  }

  createModal(poemArray);
};

// Match the published poems to the subway stops on map
function processMap(poemArray) {
  let map = $('.subwaymap #markers path');

  for (let i = 0; i < poemArray.length; i++) {
    for (let x = 0; x < map.length; x++) {
      if (map[x].id == poemArray[i].Webcode) {
        map.eq(x).addClass('published').attr({
          "href": "#",
          "data-featherlight": '#' + map[x].id
        });
      };
    }
  }
}

// Publish poems for mobile view
function processMobile(poemArray) {

  // Break up JSON data into objects by subway line
  let subwaylines = {};
  for (let i = 0; i < poemArray.length; i++) {
    var item = poemArray[i];
    var x = poemArray[i].SubwayLine;
    if (!(x in subwaylines)) subwaylines[x] = [];
    subwaylines[x].push(item);
  }

  // Loop through new data to populate subway stops
  subwaylines = Object.keys(subwaylines).forEach(function(key, i) {
    // Prep subwayline json data for print
    var line = key;
    var edit = key.replace(/-/g,' ');

    // Append subway line label to body
    $('.mobile').append(`<p class="mobile-line ${line}">${edit}</p>`);

    // Loop through the subwaylines objects to create modal triggers
    $(subwaylines[key]).each(function(){
      let stop = this.SubwayStop;
      let trigger = $(`<a>${stop}</a>`);
      trigger.addClass('published mobile-stop').attr({
        "href": "#",
        "data-featherlight": '#' + this.Webcode
      });

      // Append modal trigger to body
      $('.mobile').append(trigger);
    });
  })
}

// Create Modal
function createModal(poemArray) {
  poemArray.forEach(function(poem) {
    let code = poem.Webcode;
    let name = poem.Poem;
    let poet = poem.Poet;
    let year = poem.Year;
    let stop = poem.SubwayStop;
    let url = poem.SoundcloudURL;
    let bio = poem.Bio;
    let line = poem.SubwayLine;

    var modal =
      `<div id="${code}" class="lightbox">
          <div class="stop-banner ${line}">
            <p>${stop}</p>
          </div>
          <div class="poem-info">
            <div class="poem">
              <h2>${name}</h2>
              <p>${year}</p>
              <div class="poem-data">
                <iframe width="100%" height="150" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${url}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"></iframe>
              </div>
            </div>
            <div class="poet">
              <p>${poet}</p>
              <p>${bio}</p>
            </div>
          </div>
      </div>`;

    $('.data').append(modal);
  });
}

$(document).ready(init);
