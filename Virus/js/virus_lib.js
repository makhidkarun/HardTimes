// MIT License

// Copyright (c) 2023 Makhidkarun

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

///////////////////////////////////////////////////////////////////////////////
//
//  virus_lib.js
//
//  Provides methods for running UWPs through the Virus degradation process
//  as outlined in the Traveller: The New Era rulebook.
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

//
//  A test harness for the library methods.
//
function test_virus() {

	var starport = 'A',
		siz = 7,
		atm = 5,
		hyd = 5,
		pop = 9,
		gov = 9,
		law = 9,
		tl = 14,
		population_multiplier = 5,
		navalBase = true,
        scoutBase = true,
        wayStation = true,
        depot = true;

	_test_virus( starport, siz, atm, hyd, pop, gov, law, tl, population_multiplier, navalBase, scoutBase, wayStation, depot );
}

function _test_virus( starport, siz, atm, hyd, pop, gov, law, tl, population_multiplier, navalBase, scoutBase, wayStation, depot  ) {

	console.log( 'inputs:' );
	console.log( '   starport: ' + starport );
	console.log( '   atm: ' + atm );
	console.log( '   hyd: ' + hyd );
	console.log( '   pop: ' + pop );
	console.log( '   gov: ' + gov );
	console.log( '   law: ' + law );
	console.log( '   tl: ' + tl );
	console.log( '   pop mult: ' + population_multiplier );
	console.log( '   naval base: ' + navalBase );
    console.log( '   scout base: ' + scoutBase );
    console.log( '   way station: ' + wayStation );
    console.log( '   depot: ' + depot );

	var out = doVirus( starport, siz, atm, hyd, pop, gov, law, tl, population_multiplier, navalBase, scoutBase, wayStation, depot  );

	console.log( 'output object: ' );
	console.log( out );
}

/**
 * Runs the given UWP information through the Virus degradation procedure, the so-called "Collapse"
 * from pages 190 to 191 in the Traveller: The New Era core rulebook.
 * @param {*} starport The UWP port code
 * @param {*} size The size of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} atmosphere The atmosphere code of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} hydrographics The hydrographics percentage of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} population The population of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} government The government UWP code of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} law The law level of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} techlevel The tech level of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} population_exponent The population exponent of the mainworld.
 * @param {boolean} navalbase Whether the mainworld has a naval base
 * @param {boolean} scoutbase Whether the mainworld has a scout base
 * @param {boolean} waystation Whether the mainworld has a waystation
 * @param {boolean} depot Whether the mainworld has a depot
 * @returns An object structured like the above parameters containing the altered UWP.
 */
function doVirus(starport, size, atmosphere, hydrographics, population, government, law, techlevel, population_exponent, navalbase, scoutbase, waystation, depot) {
    // Step 1
    let msp = virus_calculateMsp(size, atmosphere, hydrographics);
    if(msp <= 0) {
        return {
            starport: 'X',
            size: size,
            atmosphere: atmosphere,
            hydrographics: hydrographics,
            population: 0,
            government: 0,
            law: 0,
            techlevel: techlevel,
            population_exponent: 0,
            navalbase: false,
            scoutbase: false,
            waystation: false,
            depot: false
        }
    }
    if(msp < population) { // MSP will never be less than 2
        population = msp;
        population_exponent = virus_roll(1, 9);
    }

    // Step 2, 3, & 4
    let tldr = virus_techLevelDecline(techlevel);
    if(tldr > 0) {
        techlevel -= tldr;
        if(techlevel < 0) { techlevel = 0; }
        let popExDecline = Math.round(tldr / 4);
        population_exponent -= popExDecline;
        if(population_exponent < 1) {
            population -= 1;
            if(population < 1) {
                population = 0;
                population_exponent = 0;
            } else {
                population_exponent = 9 + population_exponent;
            }
        }
    }
    if(population < 6) {
        techlevel -= 1;
        if(techlevel < 0) { techlevel = 0; }
        if(population_exponent == 1) {
            population -= 1;
            if(population < 1) {
                population = 0;
                population_exponent = 0;
            } else {
                population_exponent = 5;
            }
        } else {
            population_exponent = Math.round(population_exponent / 2);
        }
    }

    // Step 5 & 6
    if(population < 1) {
        starport = 'X';
        navalbase = false;
        scoutbase = false;
        waystation = false;
        depot = false;
    } else {
        let roll = virus_roll(1, 6);
        if(roll > tldr) {
            starport = virus_reduceStarport(starport, 1);
            if(starport == 'X') {
                navalbase = false;
                scoutbase = false;
                waystation = false;
                depot = false;
            } else {
                if(virus_roll(1, 10) < 9) { navalbase = false; }
                if(virus_roll(1, 10) < 8) { scoutbase = false; }
                if(virus_roll(1, 10) < 10) { waystation = false; }
                if(virus_roll(1, 10) < 10) { depot = false; }
            }
        } else if(roll == tldr) {
            starport = reduceStarport(starport, 2);
            navalbase = false;
            scoutbase = false;
            waystation = false;
            depot = false;
        } else {
            starport = 'X';
            navalbase = false;
            scoutbase = false;
            waystation = false;
            depot = false;
        }
    }

    // Step 7 & 8
    if(population < 1) {
        government = 0;
        law = 0;
    } else {
        let balkanization = population + size - techlevel;
        if(virus_roll(2, 6) <= balkanization) {
            government = 7;
        } else {
            // TEDs are simply counted as "non-charismatic dictators" by our measure
            if(population > 4) {
                if(virus_roll(1, 10) < tldr) {
                    government = 11;
                } else {
                    government = virus_newGov(population);
                }
            } else {
                government = virus_newGov(population);
            }
        }
        // No need to adjust for TEDs because we set their gov to 11.
        law = virus_roll(2, 6) - 7 + government;
    }

    return {
        starport: starport,
        size: size,
        atmosphere: atmosphere,
        hydrographics: hydrographics,
        population: population,
        government: government,
        law: law,
        techlevel: techlevel,
        population_exponent: population_exponent,
        navalbase: navalbase,
        scoutbase: scoutbase,
        waystation: waystation,
        depot: depot
    }
}

/**
 * Convenience method for generating random numbers
 * @param {*} num The number of dice to roll
 * @param {*} size The size of dice to roll
 */
function virus_roll(num, size) {
    // TODO: Implement support for seeded RNG
    let value = 0;
    for(let i = 0; i < num; i++) {
        value += Math.ceil(Math.random() * size);
    }
    return value;
}

/**
 * Calculates the Maxiomum Sustainable Population based on the given factors.
 * @param {*} size requires an integer, do not use pseudohex notation
 * @param {*} atmosphere requires an integer, do not use pseudohex notation
 * @param {*} hydrographics requires an integer, do not use pseudohex notation
 * @returns integer
 */
function virus_calculateMsp(size, atmosphere, hydrographics) {
    let msp = 10;
    if([0, 1, 2, 3, 10, 11, 12].includes(atmosphere)) {
        msp = 0;
    } else {
        if(size < 8) { msp -= 1; }
        if(size < 5) { msp -= 1; } // intended to be cumulative
        if(atmosphere == 5 || atmosphere == 7 || atmosphere == 9) { msp -= 1; }
        if(atmosphere == 4) { msp -= 2; }
        if(atmosphere == 13 || atmosphere == 14 || atmosphere == 15) { msp -= 3; }
        if(hydrographics == 1 || hydrographics == 2 || hydrographics == 10) { msp -= 3; }
        if(hydrographics == 0) { msp -= 2; }
    }
    return msp;
}

/**
 * Calculates the techlevel decline due to interactions with Virus.
 * @param {*} techlevel requires an integer, do not use pseudohex notation
 * @returns The decline in tech level, not the new techlevel.
 */
function virus_techLevelDecline(techlevel) {
    let decline = 0;
    if(techlevel < 9) {
        decline = virus_roll(1, 6) - 3;
        if(decline < 0) { decline = 0; }
    } else if(techlevel < 11) {
        decline = virus_roll(1, 6);
    } else if(techlevel < 15) {
        decline = virus_roll(2, 6);
    } else {
        decline = virus_roll(3, 6);
    }
    return decline;
}

/**
 * Returns the new UWP starport code after applying the given reduction in "levels"
 * @param {*} starport The starport UWP code
 * @param {*} degree The degree to which to reduce the starport, in "levels"
 * @returns 
 */
function virus_reduceStarport(starport, degree) {
    if(starport == 'A') {
        if(degree == 1) { return 'B'; }
        if(degree == 2) { return 'C'; }
        if(degree == 3) { return 'D'; }
        if(degree == 4) { return 'E'; }
        if(degree > 4) { return 'X'; }
    } else if(starport == 'B') {
        if(degree == 1) { return 'C'; }
        if(degree == 2) { return 'D'; }
        if(degree == 3) { return 'E'; }
        if(degree > 3) { return 'X'; }
    } else if(starport == 'C') {
        if(degree == 1) { return 'D'; }
        if(degree == 2) { return 'E'; }
        if(degree > 2) { return 'X'; }
    } else if(starport == 'D') {
        if(degree == 1) { return 'E'; }
        if(degree > 1) { return 'X'; }
    } else if(starport == 'E') {
        return 'X';
    }
    return 'X'; // Required.
}

/**
 * Determines the new government for a given population based on the Virus degradation routine.
 * This is translated back to regular Traveller values rather than those given in TNE.
 * TEDs (Technologically Elevated Dictators) are treated as a Non-Charismatic Dictator (11).
 * @param {*} population requires an integer, do not use pseudohex notation
 * @returns The new government code as an integer.
 */
function virus_newGov(population) {
    let newgov = virus_roll(2, 6) - 7 + population;
    if(newgov < 0) { newgov = 0; }
    switch(newgov) {
        case 0: case 1:
            return 0; // No formal structure. This includes the "tribal" government from TNE
        case 2:
            return 2; // Participating Democracy
        case 3:
            return 4; // Representative Democracy
        case 4:
            return 10; // Charismatic Dictatorship
        case 5:
            return 12; // Charismatic Oligarchy
        case 6:
            return 11; // Non-Charismatic Dictatorship
        case 7:
            return 13; // Religious Dictatorship
        case 8:
            return 15; // Totalitarian Oligarchy
        case 9:
            return 14; // Religious Autocracy
        case 10:
            return 8; // Civil Service Bureaucracy
        case 11:
            return 3; // Self-Perpetuating Oligarchy
        case 12: case 13: case 14: case 15:
            return 9; // Impersonal Bureaucracy
        default:
            return 11; // Non-Charismatic Dictatorship
    }
}
