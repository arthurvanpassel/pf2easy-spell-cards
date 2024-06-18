let script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.querySelector('head').appendChild(script);
$(document).ready(function () {
  $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.statically.io/gh/arthurvanpassel/pf2easy-spell-cards/main/styling.css">')
  $("main > script").remove();
  document.title = document.title + " - Cards";
  $("body").addClass('cards');

  let insert = '<div class="slidecontainer ml-auto"><span>Card border radius</span><input type="range" min="0" max="20" value="0" class="slider" id="borderslider"></div><a id="help" href="#" class="ml-auto">Card functions help</a><a id="hideSource" href="#" class="ml-auto">Hide/show source</a><a id="showAllAon" href="#" class="ml-auto">Hide/show AoN descriptions</a>';
  $(insert).insertAfter($('body > header h1'));

  $("#borderslider").on("input", function () {
    $("body.cards").css("--border-radius", $(this).val() + "px");
  });

  $('#help').on('click', function () {
    if (window.confirm("There are essentially 4 functions to use on a card:\n\n1. Slider: Change the description font size.\nThis goes from smallest -> small -> normal (default) -> big -> bigger.\n\n2. Show/Hide source: Show or hide the source. You can also show or hide on all cards with the link on top of the page\n\n3. Show/Hide AoN description: Change default description to AoN description. Sometimes, the description is not complete with heightened information. You can switch between the pf2easy and the AoN, which might improve the card.\nYou can also switch all cards with the link on top of the page\n\n4. Split card: \nSplit the card in a front and back. This works per paragraph.\n\nThese functions can be used together to create the best cards for your use.\n\nYou can also change the border radius of the cards with the slider next to this link.\n\nWhen you're done just click print and enjoy!\nClick 'ok' for more info on https://github.com/arthurvanpassel/pf2easy-spell-cards")) {
      window.open('https://github.com/arthurvanpassel/pf2easy-spell-cards', "_blank");
    };
  });

  $("#showAllAon").on('click', function () {
    if ($('body').data('showAllAon')) {
      $('body').data('showAllAon', false)
      $('article.result').each((key, element) => {
        showAon(false, element)
        $(element).find('.showAon')[0].checked = false;
      });
    } else {
      $('body').data('showAllAon', true)
      $('article.result').each((key, element) => {
        showAon(true, element)
        $(element).find('.showAon')[0].checked = true;
      });
    }
  });

  $("#hideSource").on('click', function () {
    if ($('body').data('hideAllSources')) {
      $('body').data('hideAllSources', false)
      $('article.result').each((key, element) => {
        hideSource(element, false)
        $(element).find('.hideSourceInput')[0].checked = false;
      });
    } else {
      $('body').data('hideAllSources', true)
      $('article.result').each((key, element) => {
        hideSource(element, true)
        $(element).find('.hideSourceInput')[0].checked = true;
      });
    }
  });

  let jsonapi;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "https://raw.githubusercontent.com/arthurvanpassel/pf2easy-spell-cards/main/pf2-api-spells-adapted-name%20and-desc.json", true);
  httpRequest.send();
  httpRequest.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      jsonapi = JSON.parse(this.response);

      $("article.result").each((key, element) => {
        let title = $(element).find("h1")[0].innerText.replace("’", "'");
        let aon_description = jsonapi.list.find((spell) => spell.name.toLowerCase() == title.toLowerCase())?.description;
        if (aon_description) $(element).data('aon_description', aon_description);
        $(element).data('old_description', $(element).find(".parte2")[0]?.innerHTML);
      });
    }
  });

  
  $("article.result").each((key, element) => {
    let actions = `
      <div class="actions">
        <div class="slider-wrapper"><input type="range" min="0" max="4" value="2" class="slider" id="size"><label for="size">Text size</label></div>
        <div class="source-wrapper"><input type="checkbox" class="hideSourceInput" name="hideSourceInput" id="hideSourceInput-${key}"><label for="hideSourceInput-${key}">Hide Source</label></div>
        <div class="aon-wrapper"><input type="checkbox" class="showAon" name="showAon" id="showAon-${key}"><label for="showAon-${key}">Show AoN description</label></div>
        <div class="split-wrapper"><button class="split-left">&vartriangleleft;</button><button class="split-right">&vartriangleright;</button><label for="split">Split card</label></div>
      </div>`;
    $(element).prepend($(actions));
  });

  $("body").on("click", "article.result", function (e) {
    if ($(e.target).hasClass('slider')) {
      let sizes = ['bigger', 'big', '', 'tiny', 'tinier']
      $(this).removeClass(sizes[$(this).data('size')]);
      $(this).addClass(sizes[$(e.target).val()])
      if ($(this).hasClass('continue')) {
        $(this).next().removeClass(sizes[$(this).data('size')]);
        $(this).next().addClass(sizes[$(e.target).val()]);
      }
      $(this).data('size', $(e.target).val())
    }

    if ($(e.target).hasClass('hideSourceInput')) hideSource(this, e.target.checked);

    if ($(e.target).hasClass('showAon')) showAon(e.target.checked, this);

    if ($(e.target).hasClass('split-left')) splitCard(this, false);

    if ($(e.target).hasClass('split-right')) splitCard(this, true);

  });

  function showAon(value, article) {
    if ($(article).hasClass('continue')) {
      $(article).removeClass("continue");
      $(article).next().remove();
    }
    if (value) {
      $(article).find(".parte2")[0].innerHTML = $(article).data('aon_description');
    } else {
      $(article).find(".parte2")[0].innerHTML = $(article).data('old_description');
    }
  }

  function hideSource(article, value) {
    if (!$(article).data('wrappedSource')) {
      if (window.location.pathname.indexOf("spellbook") > 0) {
        $(article).find(".details p:first-child").each(function () {
          if (this.innerHTML.indexOf('<strong>Source') > 0) {
            const index = this.innerHTML.indexOf('<strong>Source')
            this.innerHTML = this.innerHTML.slice(0, index) + "<span class='source'>"+this.innerHTML.slice(index)+"</span>";
          }
        });
      } else {
        $(article).find(".details p:last-child").each(function () {
          if (this.innerHTML.indexOf('<strong>Source') >= 0) {
            const index = this.innerHTML.indexOf('<strong>Source')
              this.innerHTML = this.innerHTML.slice(0, index) + "<span class='source'>"+this.innerHTML.slice(index)+"</span>";
          }
        });
      }
      $(article).data('wrappedSource', true)
    }
    if (value) {
      $(article).addClass('hideSource')
    } else {
      $(article).removeClass('hideSource')
    }
  }

  function splitCard(article, directionRight) {
    const front = $(article)
    let back = $(article).next().hasClass('back') && $(article).next();

    if (directionRight) {
      // first time
      if (!front.hasClass('continue')) {
        let sizeclass = "";
        if (article.classList.length > 1) {
          sizeclass = article.classList[1];
        }
        front.addClass("continue");
        front.after("<article class='result back " + sizeclass + "'><div class='parte2'></div></article>");
        back = $(article).next();
      }

      let length = front.find(".parte2 > section").length;
      let lastelement = front.find(".parte2 > section:last-child")[0];
      // not final item of front
      if (length > 1 && lastelement) {
        back.find(".parte2").prepend(lastelement.outerHTML);
        $(lastelement).remove();
      }
      // final item of front
      else if (length && lastelement) {
        let lastchild = $(lastelement).find('> *:last-child')[0];
        if (!back.find(".parte2 > section.first").length) {
          back.find(".parte2").prepend("<section class='content first'></section>");
        }
        back.find(".parte2 > section.first").prepend(lastchild.outerHTML);
        $(lastchild).remove();
      }
    } else {
      let firstelement = back.find(".parte2 > section:first-child")[0];
      if ($(firstelement).hasClass('first')) {
        let firstchild = $(firstelement).find('> *:first-child')[0];
        front.find(".parte2 > section:last-child").append(firstchild.outerHTML);
        $(firstchild).remove();
        if (!$(firstelement).children().length) {
          firstelement.remove();
        }
      } else {
        front.find(".parte2").append(firstelement.outerHTML);
        $(firstelement).remove();
      }
      // after last element back to front -> delete
      if (back.find(".parte2 > *").length == 0) {
        back.remove();
        front.removeClass("continue");
      }
    }
  }
});