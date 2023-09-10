'use strict';

const {Contract} = require('fabric-contract-api');

class CertContract extends Contract {
    constructor(){
        // Custom name to refer to this smart contract
        super('org.certnet.cert');
    }

    async instantiate(ctx){
        console.log('Certificate Smart Contract Instantiated');
    }
    /**
     * @param ctx
     * @param personId
     * @param name
     * @param email
     * @returns
    */
    async createPerson(ctx, personId, name, email, phone) {
        const personKey = ctx.stub.createCompositeKey('org.certnet.cert.person', [personId]);

        let newPerson = {
            personId: personId,
            name: name,
            email: email,
            phone: phone,
            Org: ctx.clientIdentity.getID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let dataBuffer = Buffer.from(JSON.stringify(newPerson));
        await ctx.stub.putState(personKey, dataBuffer);
        return newPerson;
    }
    /**
     * @param ctx
     * @param personId
     * @returns
    */
    async getPerson(ctx, personId) {
        const personKey = ctx.stub.createCompositeKey('org.certnet.cert.person', [personId]);
        let personBuffer = await ctx.stub
            .getState(personKey)
            .catch(err => console.log(err));
        return JSON.parse(personBuffer.toString());
    }

    /**
     * @param ctx
     * @param certId
     * @param personId
     * @param certHolderName
     * @param certDomain
     * @param CertTopic
     * @param originalHash
     * @returns {Object}
    */
    async issue(ctx, certId, personId, certHolderName, certDomain, CertTopic, originalHash){
        console.log('Issue Certificate');
        let msgSender = ctx.clientIdentity.getID();
        let certKey = ctx.stub.createCompositeKey('org.certnet.cert.certificate', [certId + '-' + personId]);
        const personKey = ctx.stub.createCompositeKey('org.certnet.cert.person', [personId]);

        let personBuffer = await ctx.stub
            .getState(personKey)
            .catch(err => console.log(err));

        let certBuffer = await ctx.stub
            .getState(certKey)
            .catch(err => console.log(err));

        console.log(JSON.parse(personBuffer.toString()));
        console.log(JSON.parse(certBuffer.toString()));

        if(personBuffer.length === 0 || certBuffer.length !== 0){
            throw new Error(`Invalid Person with ID: ${personId} & Certificate ID: ${certId}, Either Person does not exist or Certificate already exists`);
        }

        const cert = {
            certId: certId + '-' + personId,
            CertTopic: CertTopic,
            personId: personId,
            certHolderName: certHolderName,
            certDomain: certDomain,
            originalHash: originalHash,
            certIssuer: msgSender,
            issueDate: new Date(),
        };

        let dataBuffer = Buffer.from(JSON.stringify(cert));
        await ctx.stub.putState(certKey, dataBuffer);
        return cert;
    }
    /**
     * @param ctx
     * @param certId
     * @param personId
     * @param currentHash
     * @returns {Object}
     */
    async verify(ctx, certId, personId, currentHash){
        console.log('Verify Certificate');
        let validator = ctx.clientIdentity.getID();
        let certKey = ctx.stub.createCompositeKey('org.certnet.cert.certificate', [certId + '-' + personId]);
        let certBuffer = await ctx.stub.getState(certKey).catch(err => console.log(err));
        const cert = JSON.parse(certBuffer.toString());
        console.log(cert);

        if(cert === undefined || cert.originalHash !== currentHash){
            const verificationResult = {
                certificate: certId + '-' + personId,
                person: personId,
                validator: validator,
                verificationStatus: false,
                verificationResultMessage: 'Certificate does not exist',
                verificationOn: new Date()
            };
            await ctx.stub.setEvent('verify', Buffer.from(JSON.stringify(verificationResult)));
            console.log(verificationResult);
            return verificationResult;
        }else{
            const verificationResult = {
                certificate: certId + '-' + personId,
                person: personId,
                validator: validator,
                verificationStatus: true,
                verificationResultMessage: 'Certificate exist',
                verificationOn: new Date()
            };
            await ctx.stub.setEvent('verify', Buffer.from(JSON.stringify(verificationResult)));
            console.log(verificationResult);
            return verificationResult;
        }
    }
}

module.exports = CertContract;