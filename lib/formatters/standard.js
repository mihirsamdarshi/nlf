/**
 * @description Standard console output formatter
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly 2013
 * @license MIT
 */

'use strict'

const archy = require('archy')

/**
 * Create the output string for a single module
 *
 * @param  {Object} moduleData The module license data
 * @return {String}            An archy formatted string
 */
function createModuleNode (moduleData) {
  const output = {
    label: `${moduleData.id} [license(s): ${moduleData.summary().join(', ')}]`,
    nodes: []
  }
  let summary

  summary = moduleData.licenseSources.package.summary()
  if (summary.length > 0) {
    output.nodes.push('package.json:  ' + summary.join(', '))
  }

  summary = moduleData.licenseSources.license.summary()
  if (summary.length > 0) {
    output.nodes.push('license files: ' + summary.join(', '))
  }

  summary = moduleData.licenseSources.readme.summary()
  if (summary.length > 0) {
    output.nodes.push('readme files: ' + summary.join(', '))
  }

  return archy(output)
}

/**
 * Create an archy formatted summary of the licenses found
 *
 * @param {Object} summaryData Map: license -> modules
 */
function createSummary (summaryData) {
  return archy({
    label: 'LICENSES: ' + Object.keys(summaryData).sort().join(', ')
  })
}

/**
 * Create an archy output of the modules group by license
 *
 * @param {Object} summaryData Map: license -> modules
 */
function modulesByLicenses (summaryData) {
  const output = {
    label: 'LICENSES:',
    nodes: []
  }
  for (const license in summaryData) {
    if (Object.prototype.hasOwnProperty.call(summaryData, license)) {
      output.nodes.push({
        label: license,
        nodes: summaryData[license]
      })
    }
  }
  return archy(output)
}

/**
 * Render the license data
 *
 * @param  {Array}    licenseData An array of module licence data
 * @param  {Object}   options     Options
 * @param  {Function} callback    The callback (err, output string)
 */
function render (licenseData, options, callback) {
  if (typeof callback !== 'function') {
    throw new Error('must have a callback')
  }

  if (!Array.isArray(licenseData)) {
    return callback(new Error('licenseData must be an array'))
  }

  if (licenseData.length < 1) {
    return callback(new Error('must have at least one module in data'))
  }

  const output = []
  const summary = {}

  // go through all the modules, adding them to
  // the output archy formatted data
  licenseData.forEach(function (module) {
    output.push(createModuleNode(module))
    // add new licenses to the summary
    const moduleLicenses = module.summary()
    for (let index = 0; index < moduleLicenses.length; index++) {
      const license = moduleLicenses[index]
      if (!summary[license]) {
        summary[license] = []
      }
      summary[license].push(module.id)
    }
  })

  // add the summary
  switch (options.summaryMode) {
    case 'simple':
      output.push(createSummary(summary))
      break
    case 'detail':
      output.push(modulesByLicenses(summary))
      break
  }

  callback(null, output.join('\n'))
}

module.exports = {
  render
}
