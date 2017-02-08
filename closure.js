var ClosureCompiler = require("closurecompiler");

ClosureCompiler.compile(
    ['magic.js'],
    {
        // Options in the API exclude the "--" prefix
        compilation_level: "ADVANCED_OPTIMIZATIONS",
        // Capitalization does not matter
        // Formatting: "PRETTY_PRINT",
        // If you specify a directory here, all files inside are used
        // externs: ["externs/file3.js", "externs/contrib/"],
        // ^ As you've seen, multiple options with the same name are
        //   specified using an array.
    },
    function(error, result) {
        if (result) {
            console.log("result")
            console.log(result.length)
            console.log("===============")
            console.log(result)
            // Write result to file
            // Display error (warnings from stderr)
        } else {
            // Display error...
            console.log("error")
         }
    }
);
