import pluginTester from "babel-plugin-tester"
import { join } from "path"

import plugin from "../src/index"

pluginTester({
	plugin,
	fixtures: join(__dirname, "fixtures"),
	babelOptions: {
		generatorOpts: {
			comments: false,
			retainLines: true,
		},
	},
})
