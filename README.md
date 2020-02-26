Simple exercise to parse an xml like "Glossary.xml" in the folder, and to save it as a csv using `Node`.

```
index.js <file> [arg]

Stream XML glossary to CSV.

Positionals:
  file  xml file to parse                                               [string]

Options:
  -o, --output     output file                                          [string]
  -d, --delimiter  csv delimiter                         [string] [default: ","]
  -h, --help       Show help                                           [boolean]
  -v, --version    Show version number                                 [boolean]
```

Example in the `test` folder.
`node index.js ./test/Glossary.xml -o ./test/new-glossary.csv`