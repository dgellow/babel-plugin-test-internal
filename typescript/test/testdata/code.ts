// exported function, should not be in __internal__ object
export function greetings() {
	return `${secretIdentity()} ${flair}: Hello ${secretName} ${secretHandshake()}`
}

// exported variable, should not be in __internal__ object
export const flair = "🐱‍🏍"

// non-exported variable, should be in __internal__ object
const secretName = "Julia"

// non-exported function, should be in __internal__ object
function secretHandshake() {
	return "🤗"
}

// non-exported arrow function, should be in __internal__ object
const secretIdentity = () => {
	return "Sam"
}

// exported default, should not be in __internal__ object
export default greetings
