let script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.querySelector('head').appendChild(script);
$(document).ready(function () {
  $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/arthurvanpassel/pf2easy-spell-cards@latest/styling.css">')
  $("main > script").remove();
  document.title = document.title + " - Cards";
  $("body").addClass('cards');

  let insert = '<div class="slidecontainer ml-auto"><span>Card border radius</span><input type="range" min="0" max="20" value="0" class="slider" id="borderslider"></div><a id="help" href="#" class="ml-auto">Card functions help</a><a id="hideSource" href="#" class="ml-auto">Hide/show source</a>';
  $(insert).insertAfter($('body > header h1'));

  $("#borderslider").on("input", function () {
    $("body.cards").css("--border-radius", $(this).val() + "px");
  });

  $('#help').on('click', function () {
    if (window.confirm("There are essentially 3 functions to use on a card:\n\n1. Slider: Change the description font size.\nThis goes from smallest -> small -> normal (default) -> big -> bigger.\n\n2. Ctrl + Click: Split the card in a front and back.\nClick once to make the back card appear, and keep clicking to add more paragraphs.\nClick on the backside of the card to put the last paragraph back on the front card.\n\n3. Alt + Click: Change default description to api description.\nSometimes, the description is not complete with heightened information.\nYou can switch between the default and an (experimental) one, that might improve the card.\nThis is not yet finished and doesn't always give good results (parsing errors)\n\nThese functions can be used together to create the best cards for your use.\n\nYou can also change the border radius of the cards with the slider next to this link. You can also remove the Source from the card.\n\nWhen you're done just click print and enjoy!\nClick 'ok' for more info on https://github.com/arthurvanpassel/pf2easy-spell-cards")) {
      window.open('https://github.com/arthurvanpassel/pf2easy-spell-cards', "_blank");
    };
  });

  $("#hideSource").on('click', function () {
    if (!$('body').data('wrappedSources')) {
      if (window.location.pathname.indexOf("spellbook") > 0) {
        $(".details p:first-child").each(function () {
          if (this.innerHTML.indexOf('<strong>Source') > 0) {
            const index = this.innerHTML.indexOf('<strong>Source')
            this.innerHTML = this.innerHTML.slice(0, index) + "<span class='source'>"+this.innerHTML.slice(index)+"</span>";
          }
        });
      } else {
      $(".details p:last-child").each(function () {
        if (this.innerHTML.indexOf('<strong>Source') >= 0) {
          const index = this.innerHTML.indexOf('<strong>Source')
            this.innerHTML = this.innerHTML.slice(0, index) + "<span class='source'>"+this.innerHTML.slice(index)+"</span>";
        }
      });
      }
      $('body').data('wrappedSources', true)
    }
    $('body').toggleClass('hideSources')
  });

  let jsonapi;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "https://raw.githubusercontent.com/arthurvanpassel/pf2easy-spell-cards/main/pf2-api-spells-adapted-name%20and-desc.json", true);
  httpRequest.send();
  httpRequest.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      jsonapi = JSON.parse(this.response);
    }
  });

  $("article.result").each((key, element) => {
    let slider = '<input type="range" min="0" max="4" value="2" class="slider" >';
    $(element).prepend($(slider));
  });

  $("body").on("click", "article.result", function (e) {
    if (e.ctrlKey) {
      if ($(this).hasClass('continue')) {
        let length = $(this).find(".parte2 > section").length;
        let lastelement = $(this).find(".parte2 > section:last-child")[0];
        if (length > 1 && lastelement) {
          $(this).next().find(".parte2").prepend(lastelement.outerHTML);
          $(lastelement).remove();
        } else if (length && lastelement) {
          let lastchild = $(lastelement).find('> *:last-child')[0];
          if (!$(this).next().find(".parte2 > section.first").length) {
            $(this).next().find(".parte2").prepend("<section class='content first'></section>");
          }
          $(this).next().find(".parte2 > section.first").prepend(lastchild.outerHTML);
          $(lastchild).remove();
        }
      } else if ($(this).hasClass('back')) {
        let firstelement = $(this).find(".parte2 > section:first-child")[0];
        if (firstelement) {
          if ($(firstelement).hasClass('first')) {
            let firstchild = $(firstelement).find('> *:first-child')[0];
            $(this).prev().find(".parte2 > section:last-child").append(firstchild.outerHTML);
            $(firstchild).remove();
            if (!$(firstelement).children().length) {
              $(firstelement).remove();
            }
          } else {
            $(this).prev().find(".parte2").append(firstelement.outerHTML);
            $(firstelement).remove();
          }
        } else {
          $(this).prev().removeClass("continue");
          $(this).remove();
        }
      } else {
        let sizeclass = "";
        if (this.classList.length > 1) {
          sizeclass = this.classList[1];
        }
        $(this).addClass("continue");
        $(this).after("<article class='result back " + sizeclass + "'><div class='parte2'></div></article>");
      }
    } else if (e.altKey) {
      let title = $(this).find("h1")[0].innerText.replace("’", "'");
      let i = jsonapi.list.findIndex(element => element.name.toLowerCase() == title.toLowerCase());
      if (jsonapi.list[i].current == "old") {
        $(this).find(".parte2")[0].innerHTML = jsonapi.list[i].description;
        jsonapi.list[i].current = "description";
      } else if (jsonapi.list[i].current == "description") {
        $(this).find(".parte2")[0].innerHTML = jsonapi.list[i].old;
        jsonapi.list[i].current = "old";
      } else {
        jsonapi.list[i].old = $(this).find(".parte2")[0].innerHTML;
        jsonapi.list[i].current = "description";
        $(this).find(".parte2")[0].innerHTML = jsonapi.list[i].description;
      }
    } else {
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
    }
  });
});