'use strict';

const chai = require('chai').expect;

const game = require('../game.json');
module.exports.common = require('../helpers/common');
// main model
module.exports.model = require('../models/game_life');
// game sub models
module.exports.market = require('../models/game/market');
module.exports.airport = require('../models/game/airport');
module.exports.bank = require('../models/game/bank');
// JSON data
module.exports.places = require('../models/game/places.json');
module.exports.items = require('../models/game/items.json');
// for setting testing values
module.exports.config = {
  UNITS: 10,
  AMOUNT: 500,
  ITEM: module.exports.items[8],
  PLAYER: {
    id: "testing"
  },
  LOCATION: {
    location: module.exports.places[0],
    destination: module.exports.places[10]
  },
  GAME: game
}

// test modules
const lifeTest = require('./game/life');
const marketTest = require('./game/market');
const airportTest = require('./game/airport');
const bankTest = require('./game/bank');
// negative (error) test modules
const marketTestErrors = require('./game/market-errors');
const airportTestErrors = require('./game/airport-errors');
const bankTestErrors = require('./game/bank-errors');

// start testing by generating a life
let life;
// testing to make sure life has all components
life = cycleLife();
describe('Life Model - Base Validation', () => {lifeTest.describeBaseValidation(life)});
describe('Life Model - Starting Validation', () => {lifeTest.describeStartingValidation(life)});
describe('Life Model - Current Validation', () => {lifeTest.describeCurrentValidation(life)});
describe('Life Model - Listing Validation', () => {lifeTest.describeListingValidation(life)});
describe('Life Model - Actions Validation', () => {lifeTest.describeActionsValidation(life)});

// testing the market
life = cycleLife();
describe('Market - Listings Validation', () => {marketTest.describeListingsValidation(life)});
describe('Market - Transaction Validation (Buy)', () => {marketTest.describeBuyTransactionValidation(life)});
// set up life
life = module.exports.market.doMarketTransaction(life, marketTest.makeTransaction("buy"));
describe('Market - Transaction Validation (Sell)', () => {marketTest.describeSellTransactionValidation(life)});
// errors
life = cycleLife();
describe('Bank - Transaction Error Validation (Buy)', () => {marketTestErrors.describeBuyMarketErrors(life)});
describe('Bank - Transaction Error Validation (Sell)', () => {marketTestErrors.describeSellMarketErrors(life)});

// testing the bank
life = cycleLife();
describe('Bank - Finance Validation', () => {bankTest.describeFinanceValidation(life)});
describe('Bank - Transaction Validation (Deposit)', () => {bankTest.describeDepositTransactionValidation(life)});
// set up withdraw
life = module.exports.bank.doBankTransaction(life, bankTest.makeTransaction("deposit"));
describe('Bank - Transaction Validation (Withdraw)', () => {bankTest.describeWithdrawTransactionValidation(life)});
// set up repay
life = cycleLife();
life = module.exports.bank.doBankTransaction(life, bankTest.makeTransaction("deposit"));
describe('Bank - Lending Validation (Repay)', () => {bankTest.describeRepayLendingValidation(life)});
// set up borrow
describe('Bank - Lending Validation (Borrow)', () => {bankTest.describeBorrowLendingValidation(life)});
// errors
life = cycleLife();
describe('Bank - Transaction Error Validation (Deposit)', () => {bankTestErrors.describeBankDepositErrors(life)});
describe('Bank - Transaction Error Validation (Withdraw)', () => {bankTestErrors.describeBankWithdrawErrors(life)});
life = cycleLife();
describe('Bank - Lending Error Validation (Repay)', () => {bankTestErrors.describeBankRepayErrors(life)});
describe('Bank - Lending Error Validation (Borrow)', () => {bankTestErrors.describeBankBorrowErrors(life)});

// testing the airport
life = cycleLife();
describe('Airport - Listings Validation', () => {airportTest.describeAirportValidation(life)});
describe('Airport - Transaction Validation (Flight)', () => {airportTest.describeFlightValidation(life)});
// errors
life = cycleLife();
describe('Airport - Transaction Error Validation (Flight)', () => {airportTestErrors.describeFlightAirportErrors(life)});


function cycleLife(){
  let lifeObj = module.exports.model.generateLife(module.exports.config.PLAYER, module.exports.config.LOCATION);
  lifeObj.testing = true;
  return lifeObj;
}