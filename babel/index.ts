import { PluginObj, types } from "@babel/core"

export interface IState {
	internalNames: string[]
}

export default function (): PluginObj<IState> {
	return {
		name: 'test-internal',
		pre() {
			this.internalNames = []
		},
		post() {
			this.internalNames = []
		},
		visitor: {
			Program: {
				exit(path) {
					const identifier = types.identifier("__internal__")
					const objectProperties = this.internalNames.map(name => {
						const keyIdentifier = types.identifier(name)
						const valueIdentifier = types.identifier(name)
						return types.objectProperty(
							keyIdentifier,
							valueIdentifier,
							false, // computed
							true // shorthand
						)
					})
					const objectExpression = types.objectExpression(objectProperties)
					const declarator = types.variableDeclarator(identifier, objectExpression)
					const declaration = types.variableDeclaration("const", [declarator])
					const exportDeclaration = types.exportNamedDeclaration(declaration, [])
					path.node.body.push(exportDeclaration)
				}
			},
			ExportDeclaration(path) {
				path.skip()
			},
			FunctionDeclaration(path) {
				path.skip()
				if (!path.node.id) return
				this.internalNames.push(path.node.id.name)
			},
			VariableDeclarator(path) {
				path.skip()
				if (!types.isIdentifier(path.node.id)) return
				this.internalNames.push(path.node.id.name)
			}
		},
	}
}
