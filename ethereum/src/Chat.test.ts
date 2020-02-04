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
let defaultAccountAddress: string;

beforeEach(async () => {
    // Type cast necessary due to typings clash in web3 and ganache typings.
    // -
    ganacheProvider = (ganache.provider() as any) as provider;
    web3 = new Web3(ganacheProvider);
    accounts = Seq.Indexed(await web3.eth.getAccounts());
    defaultAccountAddress = accounts.first();

    chatContract = new web3.eth.Contract(ChatJson.abi as any);

    const deploymentGas = await chatContract
        .deploy({ data: ChatJson.binary })
        .estimateGas();

    chatContract = await chatContract
        .deploy({
            data: ChatJson.binary,
        })
        .send({
            from: defaultAccountAddress,
            gas: deploymentGas,
        });
});

const sendMessage = async (
    senderName: string,
    text: string,
    senderAddress?: string
) => {
    const boundSendMessage = chatContract.methods.sendMessage(senderName, text);
    const gasEstimate = await boundSendMessage.estimateGas();

    await boundSendMessage.send({
        from: senderAddress ?? accounts.first(),
        gas: gasEstimate,
    });
};

describe(nameof(Chat), () => {
    it('has empty messages upon deployment', async () => {
        const messages = await chatContract.methods.getMessages().call();

        expect(messages.length).toBe(0);
    });

    it('includes sender name into the message', async () => {
        const senderName = 'Batman';

        await sendMessage(senderName, 'foobar');

        const messages = await chatContract.methods.getMessages().call();

        expect(messages[0].senderName).toStrictEqual(senderName);
    });

    it('includes message text into the message', async () => {
        const text = 'How about we meat this weekend?';

        await sendMessage('Vegetarian', text);

        const messages = await chatContract.methods.getMessages().call();

        expect(messages[0].text).toStrictEqual(text);
    });

    it('stores the sender account in the messages', async () => {
        const expectedSenderAddress = accounts.last(undefined)!;

        await sendMessage('Mr. Twister', 'I feel good', expectedSenderAddress);

        const messages = await chatContract.methods.getMessages().call();

        expect(messages[0].senderAddress).toStrictEqual(expectedSenderAddress);
    });
});
