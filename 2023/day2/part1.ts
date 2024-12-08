import fs from "node:fs";

type CubeSet = { red: number; blue: number; green: number };
type Game = { id: number; cubeSets: CubeSet[] };

const Mode = {
	ReadingId: 0,
	StartingSet: 1,
	ReadingQuantity: 2,
	ReadingColour: 3,
	BetweenSets: 4,
};

function isNumeral(char: string) {
	return char >= "0" && char <= "9";
}

function isLetter(char: string) {
	return char >= "a" && char <= "z";
}

const cubesInBag = { red: 12, green: 13, blue: 14 };

function parseGrid(raw: string): Game[] {
	const games: Game[] = [];
	let mode = Mode.ReadingId;
	let buffer = "";
	let colourBuffer = "";
	let currentSet: CubeSet = { red: 0, blue: 0, green: 0 };
	let currentGame: Game = { id: 0, cubeSets: [] };
	for (let i = 0; i < raw.length; i++) {
		const curr = raw[i];
		if (mode === Mode.ReadingId) {
			if (isNumeral(curr)) {
				buffer += curr;
			} else if (curr === ":") {
				currentGame.id = Number.parseInt(buffer);
				buffer = "";
				mode = Mode.StartingSet;
			}
		} else if (mode === Mode.StartingSet) {
			if (isNumeral(curr)) {
				buffer = curr;
				mode = Mode.ReadingQuantity;
			}
		} else if (mode === Mode.ReadingQuantity) {
			if (isNumeral(curr)) {
				buffer += curr;
			} else if (buffer !== "") {
				mode = Mode.ReadingColour;
			}
		} else if (mode === Mode.ReadingColour) {
			if (isLetter(curr)) {
				colourBuffer += curr;
			} else if (colourBuffer !== "") {
				currentSet[colourBuffer as keyof CubeSet] = Number.parseInt(buffer);
				buffer = "";
				colourBuffer = "";
				if (curr === ",") {
					mode = Mode.ReadingQuantity;
				} else {
					currentGame.cubeSets.push(currentSet);
					currentSet = { red: 0, green: 0, blue: 0 };
					if (curr === ";") {
						mode = Mode.StartingSet;
					} else {
						games.push(currentGame);
						currentGame = { id: 0, cubeSets: [] };
						mode = Mode.ReadingId;
					}
				}
			}
		}
	}
	return games;
}
(function () {
	const raw = fs.readFileSync("data.txt").toString();
	const parsed = parseGrid(raw);
	let sum = 0;

	game: for (const game of parsed) {
		console.dir(game, { depth: 3 });
		for (const cubeSet of game.cubeSets) {
			if (
				cubeSet.green > cubesInBag.green ||
				cubeSet.blue > cubesInBag.blue ||
				cubeSet.red > cubesInBag.red
			) {
				continue game;
			}
		}
		sum += game.id;
	}
	console.dir(sum);
})();