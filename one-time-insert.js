var script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.4.1.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
var style = document.createElement("style");
style.innerHTML = "#cards_btn {	font-size: 0.8em;	margin-top: 0.1em;	border-radius: 50%;}body.cards main {	display: flex;	flex-wrap: wrap;}body.cards main page {	width: 210mm;	height: 296mm;	display: flex;	flex-wrap: wrap;	justify-content: center;	align-items: flex-start;	background-color: white;}body.cards main article.result:first-child,body.cards main article.result:nth-child(2),body.cards main article.result:nth-child(3) {	margin-top: 14.65mm;}body.cards main article.result:nth-child(9n + 7),body.cards main article.result:nth-child(9n + 8),body.cards main article.result:nth-child(9n + 9) {	margin-bottom: 14.65mm;}body.cards article.result {	padding: 10px;	height: 3.5in;	width: 2.5in;	display: flex;	flex-direction: column;	border: 1px black;	border-style: dashed;	border-radius: 15px;}body.cards header>h1,body.cards header>h2 {	font-size: 15px;	padding-bottom: 0.5em;}body.cards section.traits {	display: flex;	align-items: flex-start;}body.cards section.traits>div>h3 {	font-size: 10px;	padding: 0.1em 0.5em;}body.cards section.details>p {	font-size: 11px;	line-height: 1.25em;	letter-spacing: -0.3px;}body.cards section.content>p,body.cards section.content li,body.cards article:after,body.cards article:before {	font-size: 12px;	line-height: 1.25em;}body.cards section.content ul {	margin-bottom: 0;	padding-left: 0.75em;}body.cards .big section.content>p,body.cards .big section.content li,body.cards .big:after,body.cards .big:before {	font-size: 11px;}body.cards .bigger section.content>p,body.cards .bigger section.content li,body.cards .bigger:after,body.cards .bigger:before {	font-size: 10px;}body.cards .biggest section.content>p,body.cards .biggest section.content li,body.cards .biggest:after,body.cards .biggest:before {	font-size: 9px;}body.cards .tiny section.content>p,body.cards .tiny section.content li,body.cards .tiny:after,body.cards .tiny:before {	font-size: 13px;}body.cards .result.continue:after, body.cards .result.back:before {	font-family: Goodot;	font-weight: bold;}body.cards .result.continue:after {	content: '(Continued on back)';}body.cards .result.back:before {	content: '(Continued from front)';	transform: scaleX(-1);}body.cards .result.back > * {	transform: scaleX(-1);}@media print {	@page {		margin: 0;		size: 210mm 297mm !important;		-webkit-print-color-adjust: exact;	}	body.cards {		/* Set the background to gray to visualize the page size in the print preview */		background-color: gray;		min-width: initial !important;		margin: 0 !important	}	body.cards>header {		display: none !important;	}}";
document.getElementsByTagName('head')[0].appendChild(style);
$(document).ready(function () {
  $("main > script").remove();
  document.title = document.title + " - Cards";
  $("body").addClass('cards');
  if (window.location.pathname.indexOf("spellbook") > 0) {
    $(".details p:first-child").each(function () {
      this.innerHTML = this.innerHTML.substring(0, this.innerHTML.indexOf('; <strong>Source'));
    })
  }

  $("body").on("click", "article.result", function (e) {
    if (e.ctrlKey) {
      if ($(this).hasClass('continue')) {
        var length = $(this).find(".parte2 .content").length
        var lastelement = $(this).find(".parte2 .content:last-child")[0]
        if (length > 1 && lastelement) {
          $(this).next().find(".parte2").prepend(lastelement.outerHTML)
          $(lastelement).remove()
        } else if (length && lastelement) {
          var lastchild = $(lastelement).find('> *:last-child')[0];
          if (!$(this).next().find(".parte2 .content.first").length) {
            $(this).next().find(".parte2").prepend("<section class='content first'></section>")
          }
          $(this).next().find(".parte2 .content.first").prepend(lastchild.outerHTML)
          $(lastchild).remove()
        }
      } else if ($(this).hasClass('back')) {
        var firstelement = $(this).find(".parte2 .content:first-child")[0]
        if (firstelement) {
          if ($(firstelement).hasClass('first')) {
            var firstchild = $(firstelement).find('> *:first-child')[0]
            $(this).prev().find(".parte2 .content:last-child").append(firstchild.outerHTML)
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
        $(this).addClass("continue")
        $(this).after("<article class='result back'><div class='parte2'></div></article>")
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
          newClass = 'biggest';
        } else if ($(this).hasClass('biggest')) {
          oldClass = 'biggest';
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