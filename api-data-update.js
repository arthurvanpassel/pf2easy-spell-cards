async function getData(type) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "query": {
      "function_score": {
        "query": {
          "bool": {
            "filter": [
              {
                "query_string": {
                  "query": `category:${type}`
                }
              }
            ]
          }
        }
      }
    },
    "size": 5000,
    "_source": {
      "includes": [
        "name",
        "markdown"
      ]
    }
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  let regexArray = [
    {
      // only use the 'body' part from the markdown, and insert a <section class='content'><p>
      regex: /(?<="markdown":").*?(?=<\/column>)<\/column>\\r\\n\\r\\n---\\r\\n\\r\\n/gm,
      value: "<section class='content'><p>"
    },
    {
      // end the markdown with a section
      regex: /(","name")/gm,
      value: "</section>$1"
    },
    {
      // remove all the links from the markdown
      regex: /\[([^\]\{]*)\]\([^\)]*\)/gm,
      value: "$1"
    },
    {
      // replace double line breaks with paragraphs
      regex: /\\r\\n/gm,
      value: "</p><p>"
    },
    {
      // replace double line breaks with paragraphs
      regex: /\\n\\n/gm,
      value: "</p><p>"
    },
    {
      // remove the final linebreaks
      regex: /\\n/gm,
      value: ""
    },
    {
      // replace \" with '
      regex: /\\"/gm,
      value: "'"
    },
    {
      // insert new sections on ---
      regex: /<p>---<\/p>/gm,
      value: "</section><section class='content extra'>"
    },
    {
      // replace **words** with strong parents
      regex: /\*\*(.+?)(?=\*\*)\*\*/gm,
      value: "<strong>$1</strong>"
    },
    {
      // replace _words_ with em brackets
      regex: /_([^_"]*)_/gm,
      value: "<em>$1</em>"
    },
    {
      // replace the action brackets with actions element
      regex: /\[one-action]/gm,
      value: "<actions string='Single Action' />"
    },
    {
      // remove table elements
      regex: /<p>## [A-z0-9 :-]*<row gap='tiny'><table>.+?(?=<\/row>)<\/row>/gm,
      value: ""
    },
    {
      // remove column or row parents from elements
      regex: /<(column|row) gap='tiny'>(.+?)(?=<\/(column|row)>)<\/(column|row)>/gm,
      value: "$2"
    },
    {
      // replace title elements with strong elements
      regex: /<title level='[0-9]*'>([^<]*)<\/title>/gm,
      value: "<strong>$1</strong>"
    },
    {
      // remove document elements
      regex: /<document[A-z ='0-9-]*\/>/gm,
      value: ""
    },
    {
      // remove unclosed paragraph tags
      regex: /<p>(<\/[^p])/gm,
      value: "$1"
    },
    {
      // remove emtpy paragraphs 
      regex: /<p><\/p>/gm,
      value: ""
    }
  ]

  return fetch("https://elasticsearch.aonprd.com/aon/_search", requestOptions)
    .then(response => response.text())
    .then(result => {
      let string = result
      console.log(string)
      // for (let i = 0; i < regexArray.length; i++) {
      //   const element = regexArray[i];
      //   string = string.replace(element.regex, element.value)
      //   console.log(type, i, element.regex, string)
      // }

      console.log(string)

      let data = JSON.parse(string);
      let array = [];
      for (let i = 0; i < data.hits.hits.length; i++) {
        const element = data.hits.hits[i];
        let object = { name: element['_source'].name, description: converter.makeHtml(element['_source'].markdown) }
        array.push(object)
      }
      return array;
    })
    .catch(error => console.log('error', error));
}

var script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/showdown@<version>/dist/showdown.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
var converter = new showdown.Converter();

let resultsSpells = await getData('spell')
console.log(resultsSpells)
let resultsFeats = await getData('feat')
let result = {list: resultsSpells.concat(resultsFeats)}
console.log(result)