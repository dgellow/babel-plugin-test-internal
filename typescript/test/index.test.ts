import { report, result, testing } from "tesuto"
import ts from "typescript"
import plugin from "../index.js"
import assert from "assert"
import { readFileSync } from "fs"
import diff from "diff"
import { green, grey, red } from "neocolor"

const compare = (left: string, right: string): boolean => {
	if (left === right)
		return true

	console.log()
	console.error()
	const d = diff.diffLines(left, right)
	d.forEach(part => {
		const color = part.added ? green :
			part.removed ? red : grey
		process.stderr.write(color(part.value))
	})
	console.log()
	console.log()
	return false
}

testing("typescript compiler extension", () => {
	report("an exported '__internal__' object should be generated", () => {
		const input = "./test/testdata/code.ts"
		const expected = readFileSync("./test/testdata/output.js", "utf8")

		const program = ts.createProgram([input], {
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext,
			removeComments: true,
			declaration: false,
		})
		const transformers = { before: [plugin(program)] }
		const writeFile: ts.WriteFileCallback = (_, data, __) => {
			assert.ok(compare(expected, data))
		}
		program.emit(undefined, writeFile, undefined, false, transformers)
	})
})

process.exit(result())
