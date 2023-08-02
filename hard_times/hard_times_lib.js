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
//  hard_times_lib.js
//
//  Methods for implementing the Hard Times rules on UWP data.
//
///////////////////////////////////////////////////////////////////////////////

function test_hard_times() {

	var starport = 'A',
		siz = 7,
		atm = 5,
		hyd = 5,
		pop = 9,
		gov = 9,
		law = 9,
		tl = 14,
		population_multiplier = 5,
		warZoneLevel = 1;

	_test_hard_times( starport, siz, atm, hyd, pop, gov, law, tl, population_multiplier, warZoneLevel );
}

function _test_hard_times( starport, siz, atm, hyd, pop, gov, law, tl, population_multiplier, warZoneLevel ) {

	console.log( 'inputs:' );
	console.log( '   starport: ' + starport );
	console.log( '   atm: ' + atm );
	console.log( '   hyd: ' + hyd );
	console.log( '   pop: ' + pop );
	console.log( '   gov: ' + gov );
	console.log( '   law: ' + law );
	console.log( '   tl: ' + tl );
	console.log( '   pop mult: ' + population_multiplier );
	console.log( '   war zone: ' + warZoneLevel );

	var out = doHardTimesStage1a( starport, atm, pop, gov, law, population_multiplier, warZoneLevel );

	console.log( 'output object: ' );
	console.log( out );
}

///////////////////////////////////////////////////////////////////////////////
//
// STAGE 1a. 
//
// A. **Biosphere**.  Roll 2D.   DMs:
//      +1 if war zone.  +2 if intense war zone.  +3 if black war zone. 
//      +1 if Starport A.  +1 if Population 9+.
//
// roll < 6 = no effect.
// 6-8: atmosphere turns _tainted_.
// 9-10: atmosphere turns _tainted_; pop - 1.  Apply TL-3 in **STAGE 3**.
// 11-12: atmosphere turns downright bad (but I can't quite read the text).
// 13+ Dieback.  Atmosphere is now C.
//
///////////////////////////////////////////////////////////////////////////////
function doHardTimesStage1a( 
      starport, a, p, g, l, 
      population_multiplier, 
      warZoneLevel ) {

    if (warZoneLevel < 0) warZoneLevel = 0;
    if (warZoneLevel > 3) warZoneLevel = 3;

    var roll = parseInt(Math.random() * 6) + parseInt(Math.random() * 6) + 2 + warZoneLevel;

    if (starport == 'A') ++roll;
    if (p >= 9) ++roll;

    var stage3TLDM = 0;

   if (roll > 5 ) {
      if (roll < 11 ) {
         if (a == 3 || a == 5) --a;
         if (a == 6 || a == 8) ++a;
      }
      if (roll == 9 || roll == 10) {
         --p;
         stage3TLDM = -3;
      }
      if (roll == 11 || roll == 12) {
           // truly astonishing effects here
      }
      if (roll > 12) {
         // dieback
         p = g = l = population_multiplier = 0;
         if (starport < 'D') starport = 'D';
         a = 12; // Insidious
      }
   }

  // sanity
  if (p < 0) p = 0;

  // build and return response object
   var resp = { 
      'starport': starport, 'atm': a, 'pop': p, 'gov': g, 'law': l, 
      'population_multiplier': population_multiplier, 
      'stage3TLDM': stage3TLDM };

   return resp;
}

///////////////////////////////////////////////////////////////////////////////
//
//  Stage 1b.
//
// B. **Starport**.  Roll 1D.   DMs:
//      A-class starports:
//          +2 if frontier === 'Frontier'
//          +3 if frontier === 'Outlands'
//          +3 if frontier === 'Wilds'
//          +warZoneLevel
//          +2 if isIsolated === true
//          +1 if pop < 5
//          +1 if pop < 3 (cumulative)
//      	11 - TL (max +8)
//
//      B-class starports:
//          +2 if frontier === 'Outlands'
//          +3 if frontier === 'Wilds'
//          +warZoneLevel (max +2)
//          +3 if isIsolated === true
//          +1 if pop < 5
//          +1 if pop < 3 (cumulative)
//			9 - TL (max +7)
//
//      C-class starports:
//          +1 if frontier === 'Outlands'
//          +2 if frontier === 'Wilds'
//          +warZoneLevel (adjust by -1 if > 1)
//          +4 if isIsolated === true
//          +1 if pop < 3
//			8 - TL if tl < 7 (max +5)
//
//      D-class starports:
//          +1 if frontier === 'Wilds'
//          +1 if warZoneLevel === 3
//          +1 if isIsolated === true
//          7 - TL if tl < 7 (max +3)
//
//   Roll is mapped to Degrees of Change table, which reduces the starport class.
//
//   If starport class falls two or more levels, all bases are eliminated.
//   Otherwise:
//      7+ on 2D eliminates the naval base
//      8+ on 2D eliminates the scout base
//
//   DMs: 
//		Frontier +3
//		Outlands +5
//		Wilds: base always eliminated if in a War Zone.
//		War Zone +1
//		Intense War Zone +2
//		Black War Zone   +2
//
///////////////////////////////////////////////////////////////////////////////
function doHardTimesStage1b(
	starport,
	hasNavalBase,
	hasScoutBase,
	frontierStatus,
	warZoneLevel,
	isIsolatedWorld,
	pop,
	tl
) {
	if (warZoneLevel < 0) warZoneLevel = 0;
    if (warZoneLevel > 3) warZoneLevel = 3;

	///////////////////////////////
	//
	//  TODO -- ALL THE INNARDS
	//
	///////////////////////////////
		
	var resp = {
		'starport': starport,
		'hasNavalBase': hasNavalBase,
		'hasScoutBase': hasScoutBase
	};

	return resp;
}
