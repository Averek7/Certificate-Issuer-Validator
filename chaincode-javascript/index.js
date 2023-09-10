/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// const assetTransfer = require('./lib/assetTransfer');
const certificate = require('./lib/certificate');

// module.exports.AssetTransfer = assetTransfer;
module.exports.Certificate = certificate;
module.exports.contracts = [certificate];
