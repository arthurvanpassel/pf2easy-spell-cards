API Documentation: https://api.pathfinder2.fr/doc

Use https://jsonformatter.org/ to get name and description

Basic transformations to the descriptions:
- Put <section class="content"> at the front & </section> at the back
- Delete all the \n in the text
- Replace all the <hr /> with </section><section class="content extra">

Advanced regex transformations:

Use the https://regex101.com/ substition function to achieve this
- /@[A-z]*\[[^\]]*\]\{([^\}]*)\}/gm 
  - \L$1\E
- /@Localize\[PF2E.PersistentDamage.([A-z]*)([0-9d]*).[^\]]*\]/gm
  - $2 persistant \L$1\E damage
- /@Template\[type:([^|]*)\|distance:([0-9]*)\]/gm
  - $2-foot \L$1\E
- /@Check\[type:([^\]\|])([^\]\|]*)\]/gm
  - \U$1\E$2
- /@Check\[type:([^|]*)\|dc:([0-9]*)\]/gm
  - DC $2 $1 check
- /@Check\[type:([^\]\|])([^\]\|]*)\|dc:resolve[^\|\]]*\]/gm
  - \U$1\E$2
- /@Check\[type:([^\|])([^\|]*)\|[^\|]*\|basic:true\]/gm
  - basic \U$1\E$2
- @Check\[type:([^\]\|])([^\]\|]*)\|dc:resolve[^\]]*\|traits:[^\]]*\]
  - \U$1\E$2
- /\[\[\/r ([0-9Dd]*)\]\]/gm
  - $1