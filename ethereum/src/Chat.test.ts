import Web3 from 'web3';
import { provider } from 'web3-core';
import ganache from 'ganache-core';
import { Chat } from '../build/Chat';
import ChatJson from '../build/Chat.json';
import { Seq } from 'immutable';

let ganacheProvider: provider;
let web3: Web3;
let chatContract: Chat;
let accounts: Seq.Indexed<string>;

beforeEach(async () => {
    // Type cast necessary due to typings clash in web3 and ganache typings.
    // -
    ganacheProvider = (ganache.provider() as any) as provider;
    web3 = new Web3(ganacheProvider);
    accounts = Seq.Indexed(await web3.eth.getAccounts());

    chatContract = new web3.eth.Contract(ChatJson.abi as any);

    const deploymentGas = await chatContract
        .deploy({ data: ChatJson.binary })
        .estimateGas();

    await chatContract
        .deploy({
            data: ChatJson.binary,
        })
        .send({
            from: accounts.first(),
            gas: deploymentGas,
        });
});

describe(nameof(Chat), () => {
    it('has empty messages upon deployment', async () => {
        const messages = await chatContract.methods.getMessages().call();

        expect(messages.length).toBe(0);
    });

    it('adds a message with the specified sender name', async () => {
        const senderName = 'Batman';

        await chatContract.methods.sendMessage(senderName, 'foobar').send({});
    });
});
