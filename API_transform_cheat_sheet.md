API Documentation: https://api.pathfinder2.fr/doc

Use postman with AoN elasticsearch requests to get spell list and feat list:

POST https://elasticsearch.aonprd.com/aon/_search

Body: 
{
    "query": {
        "function_score": {
            "query": {
                "bool": {
                    "filter": [
                        {
                            "query_string": {
                                "query": "category:feat "
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
}

or 

{
    "query": {
        "function_score": {
            "query": {
                "bool": {
                    "filter": [
                        {
                            "query_string": {
                                "query": "category:spell "
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
}

Advanced regex transformations:

Use the https://regex101.com/ substition function to achieve this

  - /(?<="markdown": ").*?(?=<\/column>)<\/column>\\r\\n\\r\\n---\\r\\n\\r\\n/gm
    - <section class='content'><p>
  - /(",\n[ ]*"name")/gm
    - </section>$1
  - /\[([^]\n]*)]\([^)]*\)/gm
    - $1
  - /\\r\\n/gm
    - </p><p>
  - /\\n\\n/gm
    - </p><p>
  - /\\n/gm
    - 
  - /\\"/gm
    - '
  - /<p>---<\/p>/gm
    - </section><section class='content extra'>
  - /\*\*([^*\n]*)\*\*/gm
    - <strong>$1</strong>
  - _([^_\n]*)_
    - <em>$1</em>
  - /\[one-action]/gm
    - <actions string='Single Action' />
  - /<p>## [A-z0-9 :-]*<row gap='tiny'><table>[^\n]*<\/table>[^\n]*<\/row>/gm
    -
  - /<p><\/p><p><(column|row) gap='tiny'><\/p>([^\n]*)<p><\/(column|row)>/gm  <!-- For spells -->
  - /<\/p><p><(column|row) gap='tiny'>([^\n]*)<\/(column|row)><\/p><p>/gm <!-- For feats -->
    - $2
  - /<title level='[0-9]*'>([^<]*)<\/title>/gm
    - <strong>$1</strong>
  - /<document [^\n]* \/>/gm
    - 


Then go to https://jsonformatter.org/ with this filter string: hits.hits[*][{name: _source.name, description: _source.markdown}]s