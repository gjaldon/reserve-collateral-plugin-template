import hre, { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// Mainnet Addresses
export const COMP = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
export const RSR = "0x320623b8e4ff03373931769a31fc52a4e78b5d70";

export const ORACLE_TIMEOUT = 86400n; // 24 hours in seconds
export const DEFAULT_THRESHOLD = 5n * 10n ** 16n; // 0.05
export const DELAY_UNTIL_DEFAULT = 86400n;
export const MAX_TRADE_VOL = 1000000n;

export const FIX_ONE = 1n * 10n ** 18n;

export type Numeric = number | bigint;

export const exp = (i: Numeric, d: Numeric = 0): bigint => {
  return BigInt(i) * 10n ** BigInt(d);
};

type ImpersonationFunction<T> = (signer: SignerWithAddress) => Promise<T>;

/* whileImpersonating(address, f):

   Set up `signer` to be an ethers transaction signer that impersonates the account address
   `address`. In that context, call f(signer). `address` can be either a contract address or an
   external account, so you can use often this instead of building entire mock contracts.

   Example usage:

   await whileImpersonating(basketHandler.address, async (signer) => {
     await expect(rToken.connect(signer).setBasketsNeeded(fp('1'))
     .to.emit(rToken, 'BasketsNeededChanged')
   })

   This does the following:
   - Sets the basketHandler Eth balance to 2^256-1 (so it has plenty of gas)
   - Calls rToken.setBasketsNeeded _as_ the basketHandler contract,
   - Checks that that call emits the event 'BasketNeededChanged'
*/
export const whileImpersonating = async (
  address: string,
  f: ImpersonationFunction<void>
) => {
  // Set maximum ether balance at address
  await hre.network.provider.request({
    method: "hardhat_setBalance",
    params: [
      address,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    ],
  });
  const signer = await ethers.getImpersonatedSigner(address);

  await f(signer);
};
