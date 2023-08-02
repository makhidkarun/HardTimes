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

// STAGE 1. 
// A. **Biosphere**.  Roll 2D; DMs = +1 if war zone.  +2 if intense war zone.  +3 if black war zone.  +1 if Starport A.  +1 if Population 9+.

// roll < 6 = no effect.
// 6-8: atmosphere turns _tainted_.
// 9-10: atmosphere turns _tainted_; pop - 1.  Apply TL-3 in **STAGE 3**.
// 11-12: atmosphere turns downright bad (but I can't quite read the text).
// 13+ Dieback.  Atmosphere is now C.

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

	var out = doHardTimesStage1( starport, atm, pop, gov, law, population_multiplier, warZoneLevel );

	console.log( 'output object: ' );
	console.log( out );
}


function doHardTimesStage1( 
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
   var uwp = { 
      'starport': starport, 'atm': a, 'pop': p, 'gov': g, 'law': l, 
      'population_multiplier': population_multiplier, 
      'warZoneLevel': warZoneLevel, 'stage3TLDM': stage3TLDM };

   return uwp;
}
