// Process data from File
$(document).ready(function() {
  var tab_name = 'Data';
  var spreadsheet_id = '1IuicD2xPSk9HibXcW42GLBsGJcKCQ4jV4cXbMi0fRT8';
  var api_key = 'AIzaSyCyVrmIYsa7ldGiUjkrQdHCkSkzf3NkqI8';
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_id + '/values/' + tab_name + '?alt=json&key=' + api_key;

  $.getJSON( url, function(data) {
      processData(data.values);
  }) .fail(function(){
      console.log("An error has occurred.");
  });

  // $.getJSON("assets/mapdata.json", function(data){
  //     processData(data);
  //     // publishPoems(data);
  // }).fail(function(){
  //     console.log("An error has occurred.");
  // });
});

// Process data from gSheet
function processData(data) {
  let poemArray = [];
  let numberSelected = 0;
  let windowSize = $(window).width();

  // Push only published rows to poemArray
  for (let i = 0; i < data.length; i++) {
    if (data[i][2] == 'Yes') {
      poemArray.push(data[i]);
      numberSelected++;
    }
  }

  if(windowSize > 1024){
    processMap(poemArray);
  } else {
    processMobile(poemArray);
  }

  publishPoems(poemArray);
  createModal(poemArray);
}

// Publish the poems to the "Poems" page
function publishPoems(poemArray){
    
  poemArray.sort((a, b) => {
    const lastA = a[5].toLowerCase();
    const lastB = b[5].toLowerCase();
    return lastA.localeCompare(lastB);
  });
    
  for (let i = 0; i < poemArray.length; i++) {
      console.log(poemArray);
    const poetFirst = poemArray[i][4];
    const poetLast = poemArray[i][5];
    const url = poemArray[i][8];
    const code = poemArray[i][0];
    
    var poemList = `<p class="poet-${code}"><a href="${url}" target="_blank">${poetFirst} ${poetLast}</a></p>`;

    $('#poems .poemscontainer').append(poemList);
  }
}

// Match the published poems to the subway stops on map
function processMap(poemArray) {
  let map = $('.subwaymap #markers path');

  for (let i = 0; i < poemArray.length; i++) {
    for (let x = 0; x < map.length; x++) {
      if (map[x].id == poemArray[i][0]) {
        map.eq(x).addClass('published').attr({
          "href": "#",
          "data-featherlight": '#' + map[x].id
        });
      }
    }
  }
}

// Publish poems for mobile view
function processMobile(poemArray) {
  // Break up JSON data into objects by subway line
  let subwaylines = {};
  for (let i = 0; i < poemArray.length; i++) {
    var item = poemArray[i];
    var x = poemArray[i][1];
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
      let stop = this[7];
      let trigger = $(`<a>${stop}</a>`);
      trigger.addClass('mobile-stop').attr({
        "href": "#",
        "data-featherlight": '#' + this[0]
      });

      // Append modal trigger to body
      $('.mobile').append(trigger);
    });
  })
}

// Create Modal
function createModal(poemArray) {
  poemArray.forEach(function(poem) {
    let code = poem[0];
    let name = poem[3];
    let poet = poem[4] + " "+ poem[5];
    let year = poem[6];
    let stop = poem[7];
    let url = poem[8];
    let bio = poem[9];
    let line = poem[1];

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
