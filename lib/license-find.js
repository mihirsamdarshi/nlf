/**
 *
 * @description Module for identifying license from a text string
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly
 *
 * @license The MIT License
 * 
 */

'use strict';


var licenses = [ {
		'name': 'BSD',
		'regex': [
			/\sBSD\s/
		]
	},
	{
		'name': 'GPL',
		'regex': [
			/\sGPL\s/,
			/\sGPLv2\s/
		]
	},
	{
		'name': 'LGPL',
		'regex': [
			/\sLGPL\s/
		]
	},
	{
		'name': 'MIT',
		'regex' : [
			/\sMIT\s/,
			/\s\(MIT\)\s/
		]
	},
	{
		'name': 'Apache',
		'regex': [
			/\sApache\sLicense\s/
		]
	},
	{
		'name': 'MPL',
		'regex': [
			/\sMPL\s/
		]
	},
	{
		'name': 'WTFPL',
		'regex': [
			/\sDO\sWHAT\sTHE\sFUCK\sYOU\sWANT\sTO\sPUBLIC\sLICENSE\s/
		]

	}
];

/**
 * Identifies potential license text
 * 
 * @param  {String} text The text to scan
 * @return {Array}       Array of potential license names
 */
function identifyLicense(text) {

	var licenseIndex,
		regexIndex,
		license,
		output = [];

	for (licenseIndex = licenses.length - 1; licenseIndex >= 0; licenseIndex--) {
		license = licenses[licenseIndex];
		for (regexIndex = license.regex.length - 1; regexIndex >= 0; regexIndex--) {
			if (license.regex[regexIndex].test(text)) {
				output.push(license.name);
				break;
			}
		}
	}

	return output.sort();
}

module.exports = identifyLicense;