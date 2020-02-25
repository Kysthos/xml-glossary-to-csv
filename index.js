const path = require("path");
const argv = require("yargs")
  .parserConfiguration({
    "duplicate-arguments-array": false
  })
  .command("$0 <file> [arg]", "Stream XML glossary to CSV.", yargs => {
    yargs.positional("file", {
      describe: "xml file to parse",
      type: "string"
    });
  })
  .option("o", {
    alias: "output",
    demandOption: false,
    describe: "output file",
    type: "string"
  })
  .check(argv => {
    if (path.extname(argv.file).toUpperCase() !== ".XML")
      throw new Error("File must be an xml.");
    if (!argv.output) argv.output = argv.file.replace(/xml$/i, "csv");
    else if (path.extname(argv.output).toUpperCase() !== ".CSV")
      throw new Error("Output must be a csv.");
    return true;
  })
  .help("help")
  .alias("h", "help")
  .alias("v", "version").argv;

const glossaryFile = argv.file;
const output = argv.output;

const { promises: fs, createWriteStream } = require("fs");
const { pipeline, Readable } = require("stream");
const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const stringify = require("csv-stringify");
const stringifier = stringify({
  delimiter: ","
});

main();
async function main() {
  try {
    const xml = await fs.readFile(glossaryFile, "utf8");
    const xmlParsed = await parser.parseStringPromise(xml);

    function* items() {
      for ({ word, description } of xmlParsed.glossary.item)
        yield [word.join("").trim(), description.join("").trim()];
    }
    const entries = items();

    pipeline(
      new Readable({
        objectMode: true,
        read() {
          const { value = null, done } = entries.next();
          if (!done && value) return this.push(value);
          return this.push(null);
        }
      }),
      stringifier,
      createWriteStream(output),
      err => {
        if (err) return console.error(err);
        console.log("Done!");
      }
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
