export function greetings() {
    return `${secretIdentity()} ${flair}: Hello ${secretName} ${secretHandshake()}`;
}
export const flair = "🐱‍🏍";
const secretName = "Julia";
function secretHandshake() {
    return "🤗";
}
const secretIdentity = () => {
    return "Sam";
};
export default greetings;
export const __internal__ = {
    secretName,
    secretHandshake,
    secretIdentity
};
