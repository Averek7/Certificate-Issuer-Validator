# Sample Certificate - Issuer & Validator on Hyperledger

The asset transfer basic sample demonstrates:

- Create User.
- Get User.
- Issue the Certificate.
- Verify the Certificate.

## About the sample

This sample includes smart contract and application code in multiple languages. This sample shows create, read, update, transfer and delete of an asset.


### Application

Follow the execution flow in the client application code, and corresponding output on running the application. Pay attention to the sequence of:

- Transaction invocations (console output like "**--> Submit Transaction**" and "**--> Evaluate Transaction**").
- Results returned by transactions (console output like "**\*\*\* Result**").

### Smart Contract

Note that the CertificateIssuerValidator implemented by the smart contract is a simplified scenario, without ownership validation, meant only to demonstrate how to invoke transactions.

## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

1. Deploy one of the smart contract implementations (from the `test-network` folder).
   ```
   ./startFabric.sh

   cd ../application-javascript
   node enrollAdmin.ja
   node registerUSer.js
   ```

1. Run the application (from the `asset-transfer-basic` folder).
   ```
   node app.js

   ```

## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```
./network.sh down
```
