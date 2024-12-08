import fs from "node:fs";

const replacements = [
	["one", "1"],
	["two", "2"],
	["three", "3"],
	["four", "4"],
	["five", "5"],
	["six", "6"],
	["seven", "7"],
	["eight", "8"],
	["nine", "9"],
];

function replaceStrings(raw: string): string {
	for (let i = 0; i < raw.length; i++) {
		const sliding = raw.substring(i, i + 5);
		for (const [spelled, numeric] of replacements) {
			if (sliding.startsWith(spelled)) {
				raw = raw.substring(0, i) + numeric + raw.substring(i + 1);
			}
		}
	}
	return raw;
}

(function () {
	const raw = fs.readFileSync("data.txt").toString();
	const rawLines = raw.split("\n");

	let sum = 0;
	let firstInLine = 0;
	let lastInLine = 0;
	const converted = replaceStrings(raw);
	for (let i = 0; i < converted.length; i++) {
		const current = converted.charCodeAt(i);
		if (current === 10) {
			sum += firstInLine * 10 + (lastInLine || firstInLine);
			console.log({
				line: rawLines.shift(),
				firstInLine,
				lastInLine,
				sum: firstInLine * 10 + (lastInLine || firstInLine),
			});
			firstInLine = 0;
			lastInLine = 0;
		} else if (current >= 49 && current <= 57) {
			if (!firstInLine) {
				firstInLine = current - 48;
			} else {
				lastInLine = current - 48;
			}
		}
	}
	console.log(sum);
})();
