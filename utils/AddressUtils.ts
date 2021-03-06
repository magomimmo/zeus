import { satoshisPerBTC } from './../stores/UnitsStore';

const btcNonBech = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const btcBech = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;

const lnInvoice = /^(lnbcrt|lntb|lnbc|LNBCRT|LNTB|LNBC)([0-9]{1,}[a-zA-Z0-9]+){1}$/;

/* testnet */
const btcNonBechTestnet = /^[2][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const btcBechTestnet = /^(bc1|[2])[a-zA-HJ-NP-Z0-9]{25,39}$/;
const btcBechPubkeyScriptHashTestnet = /^(tb1|[2])[a-zA-HJ-NP-Z0-9]{25,39}$/;

class AddressUtils {
    processSendAddress = (input: string) => {
        let value, amount;

        // handle addresses prefixed with 'bitcoin:' and
        // payment requests prefixed with 'lightning:'

        // handle BTCPay invoices with amounts embedded
        if (input.includes('bitcoin:') && input.includes('?amount=')) {
            const btcAddressAndAmt = input.split('bitcoin:')[1];
            const amountSplit = btcAddressAndAmt.split('?amount=');
            value = amountSplit[0];
            amount = Number(amountSplit[1]) * satoshisPerBTC;
            amount = amount.toString();
        } else if (input.includes('bitcoin:')) {
            value = input.split('bitcoin:')[1];
        } else if (input.includes('lightning:')) {
            value = input.split('lightning:')[1];
        } else if (input.includes('LIGHTNING:')) {
            value = input.split('LIGHTNING:')[1];
        } else {
            value = input;
        }

        return { value, amount };
    };

    isValidBitcoinAddress = (input: string, testnet: boolean) => {
        if (testnet) {
            return (
                btcNonBechTestnet.test(input) ||
                btcBechTestnet.test(input) ||
                btcBechPubkeyScriptHashTestnet.test(input)
            );
        }

        return btcNonBech.test(input) || btcBech.test(input);
    };

    isValidLightningPaymentRequest = (input: string) => lnInvoice.test(input);
}

const addressUtils = new AddressUtils();
export default addressUtils;
