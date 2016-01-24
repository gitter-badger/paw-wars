"use strict";

const game = require("../../game.json");
const items = require("./items.json");
const events = require("./events.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.doSimulateEncounter = function doSimulateEncounter(life) {
	let newLife = JSON.parse(JSON.stringify(life));
	// see if we even get an event
	const eventRoll = common.getRandomInt(0, game.police.heat_cap);
	// calculate our encounter rate for our location
	const encounterRate = getTotalHeat(newLife);
	// see if our roll is good enough for an encounter
	if (encounterRate <= eventRoll || life.testing === true) {
		// they didn't get an encounter
		newLife.current.police.encounter = null;
		return newLife;
	}
	newLife = module.exports.startEncounter(newLife);
	return newLife;
};

module.exports.startEncounter = function simulateEncounter(life) {
	let newLife = JSON.parse(JSON.stringify(life));
	const totalHeat = getTotalheat(life);
	const totalOfficers = Math.ceil(totalHeat / (game.police.heat_cap / game.police.total_officers)) - 1;
	// if we don't need any officers, we don't need an event
	if (totalOfficers === 0) {
		newLife.current.police.encounter = null;
		return newLife;
	}
	const encounter = {
		id: Date.now(),
		officers: totalOfficers,
		total_hp: totalOfficers * game.person.starting_hp,
		mode: "discovery"
	};
	newLife.current.police.encounter = encounter;
	newLife = simulateEncounter(newLife);
	// console.log("* simulateEncounter:", newLife);
	return newLife;
};

module.exports.simulateEncounter = function simulateEncounter(life) {
	const newLife = JSON.parse(JSON.stringify(life));
	// see where we're at in the encounter
	const handleEncounter = {
		// discovery is the phase where the officer is trying to figure out what's going on
		// the officer will ask questions and may ask to search
		discovery: doDiscoveryMode,
		// searching is the phaser where the officer is actively searching your storage
		// you either consented during discovery, or the officer is claiming probable cause
		searching: doSearchingMode,
		// the officer found something, or caught you shooting at him, or something
		// it's not good, you're about to go to jail
		detain: doDetainMode,
		// you're in the back of a cop car, not much to do about it now
		custody: doCustodyMode,
		// you're free to leave, those cops don't have anything on you!
		released: doReleasedMode
	};
	newLife.current.police = handleEncounter[life.current.police.encounter](newLife.current.police);
	// console.log("* simulateEncounter:", newLife);
	return newLife;

	function doDiscoveryMode(police) {
		return police;
	}

	function doSearchingMode(police) {
		return police;
	}

	function doDetainMode(police) {
		return police;
	}

	function doCustodyMode(police) {
		return police;
	}

	function doReleasedMode(police) {
		return police;
	}
};

function getTotalHeat(life) {
	return life.current.police.heat + getAwarenessHeat(life);
}

function getAwarenessHeat(life) {
	// get the heat for the specific country's awareness
	let heat = 0;
	if (life.current.police.awareness[life.current.location.country]) {
		heat += life.current.police.awareness[life.current.location.country];
	}
	return heat;
}
