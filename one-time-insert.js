var script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
var style = document.createElement("style");
style.innerHTML = "#cards_btn { 	font-size: 0.8em; 	margin-top: 0.1em; 	border-radius: 50%; }  body.cards { 	/* Set the background to gray to visualize the page size in the print preview */ 	background-color: lightgray; 	min-width: initial !important; 	margin: 0 !important; 	--border-radius: 0; }  body.cards main#lienzo { 	display: flex; 	flex-wrap: wrap; 	justify-content: center; 	width: 210mm; 	margin: auto; }  body.cards main article.result:first-child, body.cards main article.result:nth-child(2), body.cards main article.result:nth-child(3) { 	margin-top: 15.15mm; }  body.cards main article.result:nth-child(9n + 7), body.cards main article.result:nth-child(9n + 8), body.cards main article.result:nth-child(9n + 9) { 	margin-bottom: 30.3mm; }  body.cards article.result { 	padding: 5px 10px; 	height: 3.5in; 	width: 2.5in; 	display: flex; 	flex-direction: column; 	border: 1px dashed lightgray; 	border-radius: var(--border-radius); 	position: relative; }  body.cards header>h1, body.cards header>h2 { 	font-size: 15px; 	padding-bottom: 0.5em; }  body.cards header>h1 svg { 	display: none; }  body.cards section.traits { 	display: flex; 	align-items: flex-start; }  body.cards section.traits>div { 	flex-wrap: wrap }  body.cards section.traits>div>h3 { 	font-size: 10px; 	padding: 0.1em 0.5em; }  body.cards section.details>p { 	font-size: 11px; 	line-height: 1.25em; 	letter-spacing: -0.3px; }  body.cards .parte2 section>p, body.cards .parte2 section li, body.cards article:after, body.cards article:before { 	font-size: 11px; 	line-height: 1.25em; }  body.cards article.result a {     background: none; }  body.cards .parte2 section ul { 	margin-bottom: 0; 	padding-left: 0.75em; }  body.cards .parte2 section p.tab0 {     text-indent: -1em;     margin-left: 1em; }  body.cards .parte2 section label.nolink {     margin: 0; }  body.cards .big .parte2 section>p, body.cards .big .parte2 section li, body.cards .big:after, body.cards .big:before { 	font-size: 10px; }  body.cards .bigger .parte2 section>p, body.cards .bigger .parte2 section li, body.cards .bigger:after, body.cards .bigger:before { 	font-size: 9px; }  body.cards .tinier .parte2 section>p, body.cards .tinier .parte2 section li, body.cards .tinier:after, body.cards .tinier:before { 	font-size: 13px; }  body.cards .tiny .parte2 section>p, body.cards .tiny .parte2 section li, body.cards .tiny:after, body.cards .tiny:before { 	font-size: 12px; }  body.cards .result.continue:after,  body.cards .result.back:before { 	font-family: Goodot; 	font-weight: bold; }  body.cards .result.continue:after { 	content: '(Continued on back)'; 	position: absolute;     bottom: 10px;     left: 10px; }  body.cards .result.back:before { 	content: '(Continued from front)'; }  body.cards .result.back .content.first p:not(.tab0) { 	text-indent: 1em; }  @media print { 	@page { 		margin: 0; 		size: 210mm 297mm !important; 		-webkit-print-color-adjust: exact; 	}  	body.cards>header { 		display: none !important; 	}  	body.cards, body.cards main#lienzo { 		background-color: initial; 	} }";
document.getElementsByTagName('head')[0].appendChild(style);
$(document).ready(function () {
  $("main > script").remove();
  document.title = document.title + " - Cards";
  $("body").addClass('cards');

  var borderslider = '<div class="slidecontainer ml-auto"><span>Card border radius</span><input type="range" min="0" max="20" value="0" class="slider" id="borderslider"></div>'
  $(borderslider).insertAfter($('body > header h1'));
  $("#borderslider").on("input", function () {
    $("body.cards").css("--border-radius", $(this).val() + "px")
  })

  if (window.location.pathname.indexOf("spellbook") > 0) {
    $(".details p:first-child").each(function () {
      this.innerHTML = this.innerHTML.substring(0, this.innerHTML.indexOf('; <strong>Source'));
    })
  }

  $("body").on("click", "article.result", function (e) {
    if (e.ctrlKey) {
      if ($(this).hasClass('continue')) {
        var length = $(this).find(".parte2 > section").length
        var lastelement = $(this).find(".parte2 > section:last-child")[0]
        if (length > 1 && lastelement) {
          $(this).next().find(".parte2").prepend(lastelement.outerHTML)
          $(lastelement).remove()
        } else if (length && lastelement) {
          var lastchild = $(lastelement).find('> *:last-child')[0];
          if (!$(this).next().find(".parte2 > section.first").length) {
            $(this).next().find(".parte2").prepend("<section class='content first'></section>")
          }
          $(this).next().find(".parte2 > section.first").prepend(lastchild.outerHTML)
          $(lastchild).remove()
        }
      } else if ($(this).hasClass('back')) {
        var firstelement = $(this).find(".parte2 > section:first-child")[0]
        if (firstelement) {
          if ($(firstelement).hasClass('first')) {
            var firstchild = $(firstelement).find('> *:first-child')[0]
            $(this).prev().find(".parte2 > section:last-child").append(firstchild.outerHTML)
            $(firstchild).remove()
            if (!$(firstelement).children().length) {
              $(firstelement).remove()
            }
          } else {
            $(this).prev().find(".parte2").append(firstelement.outerHTML)
            $(firstelement).remove()
          }
        } else {
          $(this).prev().removeClass("continue")
          $(this).remove()
        }
      } else {
        var sizeclass = "";
        if (this.classList.length > 1) {
          sizeclass = this.classList[1]
        }
        $(this).addClass("continue")
        $(this).after("<article class='result back "+ sizeclass +"'><div class='parte2'></div></article>")
      }
    } else {
      if (!$(this).hasClass('back')) {
        var oldClass = "";
        var newClass = "";
        if ($(this).hasClass('tiny')) {
          oldClass = 'tiny'
        } else if ($(this).hasClass('big')) {
          oldClass = 'big';
          newClass = 'bigger';
        } else if ($(this).hasClass('bigger')) {
          oldClass = 'bigger';
          newClass = 'tinier';
        } else if ($(this).hasClass('tinier')) {
          oldClass = 'tinier';
          newClass = 'tiny';
        } else {
          newClass = 'big';
        }

        $(this).removeClass(oldClass)
        $(this).addClass(newClass)
        if ($(this).hasClass('continue')) {
          $(this).next().removeClass(oldClass)
          $(this).next().addClass(newClass)
        }
      }
    }
  });
});