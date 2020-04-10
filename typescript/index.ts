import * as ts from "typescript"

let internals: string[] = []

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
	return (context: ts.TransformationContext) => (file: ts.SourceFile) => transform(program, context, file)
}

function transform(program: ts.Program, context: ts.TransformationContext, file: ts.SourceFile): ts.SourceFile {
	internals = [] // reset our state

	console.log("visit", file.fileName)
	// traverse file content
	ts.visitEachChild(file, child => visit(child, context, file), context)
	console.log("internals", internals)

	// no state, we can return the file unchanged
	if (internals.length === 0)
		return file

	// create the __internal__ object declaration and export
	const modifiers: ts.Modifier[] = [ts.createToken(ts.SyntaxKind.ExportKeyword),]
	const assignments: ts.ShorthandPropertyAssignment[] = internals.map(name => {
		return ts.createShorthandPropertyAssignment(name)
	})
	const objectLiteral = ts.createObjectLiteral(assignments, true)
	const declarations = [ts.createVariableDeclaration("__internal__", undefined, objectLiteral)]
	const declarationList = ts.createVariableDeclarationList(declarations, ts.NodeFlags.Const)
	const statement = ts.createVariableStatement(modifiers, declarationList)

	// append to source file
	const transformedFile = ts.updateSourceFileNode(file, [...file.statements, statement])

	// const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed })
	// const resultFile = ts.createSourceFile("test.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
	// console.log(printer.printNode(ts.EmitHint.Unspecified, transformedFile, resultFile))

	return transformedFile
}

function visit(node: ts.Node, context: ts.TransformationContext, file: ts.SourceFile) {
	// only consider top level functions and variable declarations
	if (!ts.isFunctionDeclaration(node) && !ts.isVariableStatement(node)) {
		return node
	}

	// check if exported, we only consider non-exported declarations
	if (node.modifiers) {
		for (let i in node.modifiers) {
			if (node.modifiers[i].kind === ts.SyntaxKind.ExportKeyword) {
				return node
			}
		}
	}

	if (ts.isFunctionDeclaration(node) && !!node.name) {
		// found an non-exported function, save the name
		internals.push(node.name.text)
	}
	if (ts.isVariableStatement(node)) {
		node.declarationList.forEachChild(node => {
			if (!ts.isVariableDeclaration(node))
				return
			if (!ts.isIdentifier(node.name))
				return
			// found an non-exported variable, save the name
			internals.push(node.name.text)
		})
	}

	return node
}

// const program = ts.createProgram(['./index.ts'], {
// 	target: ts.ScriptTarget.ES5,
// 	module: ts.ModuleKind.CommonJS,
// 	moduleResolution: ts.ModuleResolutionKind.NodeJs,
// 	importHelpers: true,
// 	alwaysStrict: true,
// 	noImplicitAny: true,
// 	noImplicitThis: true,
// 	removeComments: true,
// 	declaration: true,
// 	noEmitOnError: true,
// })

// const transformers = {
// 	before: [
// 		transformer(program),
// 	]
// }
// const result = program.emit(undefined, undefined, undefined, false, transformers)
// console.log(result)
