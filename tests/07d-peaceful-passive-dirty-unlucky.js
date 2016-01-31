"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;

let life;

describe("Police - Simulating Encounter (Peaceful, Passive, Dirty, Unlucky)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		// adding some heat
		life.current.police.heat = config.GAME.police.heat_cap / 2;
		// fill them up full of something...
		life.current.storage.available = 0;
		life = police.startEncounter(life);
	});

	it("encounter should go into discovery mode", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("discovery");
		return done();
	});

	it("encounter should explain what is happening in simple", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.discovery.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.discovery.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should accept the 'allow_search' action", (done) => {
		// simulate the encounter
		life = simulateAction("permit_search", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'searching'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("searching");
		return done();
	});

	it("encounter reason should be 'search_consent'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("search_consent");
		return done();
	});

	it("encounter should start 'searching' mode", (done) => {
		// simulate the encounter
		life = police.simulateEncounter(life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("searching");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.search_consent.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.search_consent.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should accept the 'comply_search' action", (done) => {
		// simulate the encounter
		life.current.police.meta = "unlucky";
		life = simulateAction("comply_search", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'detained'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("detained");
		return done();
	});

	it("encounter reason should be 'search_success'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("search_successful");
		return done();
	});

	it("encounter should start 'detained' mode", (done) => {
		// simulate the encounter
		life = police.simulateEncounter(life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("detained");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.search_successful.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.search_successful.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should accept the 'comply_detain' action", (done) => {
		// simulate the encounter
		life = simulateAction("comply_detain", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'end'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter reason should be 'comply_detain'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("comply_detain");
		return done();
	});
});

function simulateAction(action, lifeObj) {
	// set our action
	lifeObj.current.police.encounter.action = action;
	// simulate the encounter
	return police.simulateEncounter(lifeObj);
}