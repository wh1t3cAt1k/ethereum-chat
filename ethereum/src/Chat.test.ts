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

    chatContract = await new web3.eth.Contract(ChatJson.abi as any)
        .deploy({
            data: ChatJson.binary,
        })
        .send({
            from: accounts.first(),
            gas: 1000000,
        });
});

it('has empty messages upon creation', async () => {
    const messages = await chatContract.methods.getMessages().call();

    expect(messages.length).toBe(0);
});
