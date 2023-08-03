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
//  utils_lib.js
//
//  Provides convenience utility methods and a seeded alea RNG with functions
//  for common RPG (Traveller specifically) rolls.
//  This library file requires the Alea Seeded RNG found here:
//  https://github.com/davidbau/seedrandom
//  You can load this using the CDN script below:
//  <script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/lib/alea.min.js"></script>
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

class seededARng {
    constructor(seed) {
        this.arng = new alea(seed);
    }

    /**
     * Seeded.
     * Returns a number between 0 (inclusive) and size (not inclusive)
     */
    rand(size) {
        return Math.floor(this.arng() * size);
    }

    /**
     * Seeded.
     * Returns a number between 1 (inclusive) and size (inclusive)
     */
    roll(size) {
        return this.rand(size) + 1;
    }

    /**
     * Seeded.
     * Returns the total result of number d6.
     */
    nd6(num) {
        let result = 0;
        for(let i = 0; i < num; i++) {
            result += this.roll(6);
        }
        return result;
    }

    /**
     * Seeded.
     * Returns a number between -5 (inclusive) and 5 (not inclusive)
     * Identical to 2d6-7 or 1d6-1d6
     */
    flux() {
        // reminder that d6-d6 is identical to 2d6-7
        return this.roll(6) - this.roll(6);
    }

    /**
     * Seeded.
     * Returns the result of a 2d6 roll
     */
    throw() {
        return this.roll(6) + this.roll(6);
    }

    /**
     * Seeded.
     * Returns the result of a "d66" roll where one die is considered the "tens" digit and
     * the other the "ones'. Thus a roll of 5 tens and 2 ones returns 52.
     */
    d66() {
        return this.roll(6) * 10 + this.roll(6);
    }
}

/**
 * Unseeded.
 * Returns a number between 0 (inclusive) and size (not inclusive)
 */
function u_rand(size) {
	return Math.floor(Math.random() * size);
}

/**
 * Unseeded.
 * Returns a number between 1 (inclusive) and size (inclusive)
 */
function u_roll(size) {
	return u_rand(size) + 1;
}

/**
 * Unseeded.
 * Returns the total result of number d6.
 */
function u_nd6(num) {
    let result = 0;
    for(let i = 0; i < num; i++) {
        result += this.roll(6);
    }
    return result;
}

/**
 * Unseeded.
 * Returns a number between -5 (inclusive) and 5 (not inclusive)
 * Identical to 2d6-7 or 1d6-1d6
 */
function u_flux() {
	return u_roll(6) - u_roll(6);
}

/**
 * Unseeded.
 * Returns the result of a 2d6 roll
 */
function u_throw() {
	return u_roll(6) + u_roll(6);
}

/**
 * Unseeded.
 * Returns the result of a "d66" roll where one die is considered the "tens" digit and
 * the other the "ones'. Thus a roll of 5 tens and 2 ones returns 52.
 */
function u_d66() {
    return u_roll(6) * 10 + u_roll(6);
}

/**
 * Swaps two elements in an array by index. Used for insertion sort.
 */
function swap(arr, idx1, idx2) {
    let temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
}

/**
 * Performs an insertion sort on the given number array and returns the array
 */
function insertionSort(arr) {
    let begIdx = 0;
    let curIdx = 1;

    while(curIdx < arr.length) {
        while(curIdx > 0) {
            var curVal = arr[curIdx];
            if(curVal <= arr[curIdx - 1]) {
                swap(arr, curIdx, curIdx - 1);
                curIdx--;
            } else {
                break;
            }
        }
        begIdx++;
        curIdx = begIdx + 1;
    }

    return arr;
}

/**
 * Translates an integer into a UWP pseudohex code
 */
function intToUwp(num) {
	if(num < 0) { num = 0; }
	if(num < 16) { return num.toString(16).toUpperCase(); }
	switch(num) {
        case 16: return "G";
        case 17: return "H";
        case 18: return "J";
        case 19: return "K";
        case 20: return "L";
        case 21: return "M";
        case 22: return "N";
        case 23: return "O";
        case 24: return "P";
        case 25: return "Q";
        case 26: return "R";
        case 27: return "S";
        case 28: return "T";
        case 29: return "U";
        case 30: return "V";
        case 31: return "W";
        case 32: return "X";
        case 33: return "Y";
        case 34: return "Z";
    }
    return 0;
}

/**
 * Translates a UWP pseudohex code into an integer.
 */
function uwpToInt(uwpElem) {
    var parsed = parseInt(uwpElem, 16);
    if(isNaN(parsed)) {
        switch(uwpElem) {
            case "G": return 16;
            case "H": return 17;
            case "J": return 18;
            case "K": return 19;
            case "L": return 20;
            case "M": return 21;
            case "N": return 22;
            case "O": return 23;
            case "P": return 24;
            case "Q": return 25;
            case "R": return 26;
            case "S": return 27;
            case "T": return 28;
            case "U": return 29;
            case "V": return 30;
            case "W": return 31;
            case "X": return 32;
            case "Y": return 33;
            case "Z": return 34;
        }
    } else {
        return parsed;
    }
    return 0;
}

/**
 * Create a formatted UWP line for sector generation
 * @param {*} port  The UWP port code
 * @param {*} size The size of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} atmos The atmosphere code of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} hydro The hydrographics percentage of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} pop The population of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} gov The government UWP code of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} law The law level of the mainworld, requires an integer, do not use pseudohex notation
 * @param {*} tl The tech level of the mainworld, requires an integer, do not use pseudohex notation
 * @returns A formatted UWP string (A123456-7)
 */
function formatUWP(port, size, atmos, hydro, pop, gov, law, tl) {
    var uwp =   port +
        intToUwp(size) +
        intToUwp(atmos) +
        intToUwp(hydro) +
        intToUwp(pop) +
        intToUwp(gov) +
        intToUwp(law) + '-' +
        intToUwp(tl);
    return uwp;
}
