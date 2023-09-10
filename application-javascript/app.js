/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
// const { eventNames } = require('process');


async function main() {
	try {
		// load the network configuration
		const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
		const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

		// Create a new file system based wallet for managing identities.
		const walletPath = path.join(process.cwd(), 'wallet');
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);

		// Check to see if we've already enrolled the user.
		const identity = await wallet.get('appUser');
		if (!identity) {
			console.log('An identity for the user "appUser" does not exist in the wallet');
			console.log('Run the registerUser.js application before retrying');
			return;
		}

		// Create a new gateway for connecting to our peer node.
		const gateway = new Gateway();
		await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

		// Get the network (channel) our contract is deployed to.
		const network = await gateway.getNetwork('mychannel');

		// Get the contract from the network.
		const contract = network.getContract('Certificate');

		// const result = await contract.submitTransaction('instantiate');
		// const result = await contract.submitTransaction('createPerson', '0xoknfoenoidmnmgoiemgoipemgosedgd', 'bittuuu', 'xy12d@gmail.com', '1264167800');
		const result = await contract.submitTransaction('issue', '0xoknfoenoidmnmgoiemgoipemgosedgdgh', '0xoknfefsfsdfsdfsfsdfsfsfsfdsdfsdfoenoidmnmgoiemgoipemgosedgd', 'bittttttttuuuu' , 'Cooolnee' , 'JS', 'SsssssssD234klflsAsdff');
		// const result = await contract.evaluateTransaction('verify', '0x01', '0x0000003421', 'SsD234klflsAsdff');
		// const result = await contract.evaluateTransaction('getPerson', '0xoknfoenoidmnmgoiemgoipemgosedgd');

		// Parse the string as JSON
		console.log(JSON.parse(result.toString()));
		// Disconnect from the gateway.
		await gateway.disconnect();

	} catch (error) {
		console.error(`Failed to evaluate transaction: ${error}`);
		process.exit(1);
	}
}

main();