import { 
  Connection, 
  PublicKey, 
  Keypair, 
  TransactionInstruction,
  PublicKeyInitData
} from "@solana/web3.js";
import { utils as coreUtils, IDL } from '@wormhole-foundation/sdk-solana-core';

// Helper functions
// Helper functions
function deriveTokenBridgeConfigKey(programId: PublicKeyInitData): PublicKey {
  const [key] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")], 
    new PublicKey(programId)
  );
  return key;
}

function deriveWrappedMetaKey(programId: PublicKeyInitData, mint: PublicKeyInitData): PublicKey {
  const [key] = PublicKey.findProgramAddressSync(
    [Buffer.from("meta"), new PublicKey(mint).toBuffer()],
    new PublicKey(programId)
  );
  return key;
}

function deriveSplTokenMetadataKey(mint: PublicKeyInitData): PublicKey {
  return new PublicKey("HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC");
}
import type { Provider } from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { utils } from '@wormhole-foundation/sdk-solana';
import { TokenBridgeCoder } from "../wormhole-sdk-ts/platforms/solana/protocols/tokenBridge/src/utils/tokenBridge/coder/index.js";
import { signSendWait, Wormhole, wormhole } from "@wormhole-foundation/sdk";
import evm from "../wormhole-sdk-ts/sdk/src/evm.js";
import solana from "../wormhole-sdk-ts/sdk/src/solana.js";
import { getEvmSignerForKey } from "../wormhole-sdk-ts/platforms/evm/src/signer.js";
export type TokenBridge = {
  version: '0.1.0';
  name: 'wormhole';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'wormhole';
          type: 'publicKey';
        },
      ];
    },
    {
      name: 'attestToken';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wrappedMeta';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'splMetadata';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeBridge';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeMessage';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'wormholeEmitter';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeSequence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeFeeCollector';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'clock';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'nonce';
          type: 'u32';
        },
      ];
    },
    {
      name: 'completeNative';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaa';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'claim';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'endpoint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'to';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'toFees';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'custody';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'custodySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'completeWrapped';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaa';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'claim';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'endpoint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'to';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'toFees';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wrappedMeta';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mintAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'transferWrapped';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'from';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fromOwner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wrappedMeta';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'authoritySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeBridge';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeMessage';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'wormholeEmitter';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeSequence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeFeeCollector';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'clock';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'nonce';
          type: 'u32';
        },
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'fee';
          type: 'u64';
        },
        {
          name: 'targetAddress';
          type: {
            array: ['u8', 32];
          };
        },
        {
          name: 'targetChain';
          type: 'u16';
        },
      ];
    },
    {
      name: 'transferNative';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'from';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'custody';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authoritySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'custodySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeBridge';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeMessage';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'wormholeEmitter';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeSequence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeFeeCollector';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'clock';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'nonce';
          type: 'u32';
        },
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'fee';
          type: 'u64';
        },
        {
          name: 'targetAddress';
          type: {
            array: ['u8', 32];
          };
        },
        {
          name: 'targetChain';
          type: 'u16';
        },
      ];
    },
    {
      name: 'registerChain';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'endpoint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaa';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'claim';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'createWrapped';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'endpoint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaa';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'claim';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wrappedMeta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'splMetadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mintAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'splMetadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'upgradeContract';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'vaa';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'claim';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'upgradeAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'spill';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'implementation';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'programData';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenBridgeProgram';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'clock';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bpfLoaderUpgradeable';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'transferWrappedWithPayload';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'from';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'fromOwner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wrappedMeta';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'authoritySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeBridge';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeMessage';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'wormholeEmitter';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeSequence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeFeeCollector';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'clock';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'sender';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'nonce';
          type: 'u32';
        },
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'targetAddress';
          type: {
            array: ['u8', 32];
          };
        },
        {
          name: 'targetChain';
          type: 'u16';
        },
        {
          name: 'payload';
          type: 'bytes';
        },
        {
          name: 'cpiProgramId';
          type: {
            option: 'publicKey';
          };
        },
      ];
    },
    {
      name: 'transferNativeWithPayload';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'from';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'custody';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authoritySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'custodySigner';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeBridge';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeMessage';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'wormholeEmitter';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeSequence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'wormholeFeeCollector';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'clock';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'sender';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'wormholeProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'nonce';
          type: 'u32';
        },
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'targetAddress';
          type: {
            array: ['u8', 32];
          };
        },
        {
          name: 'targetChain';
          type: 'u16';
        },
        {
          name: 'payload';
          type: 'bytes';
        },
        {
          name: 'cpiProgramId';
          type: {
            option: 'publicKey';
          };
        },
      ];
    },
  ];
  accounts: [];
};

export const TOKEN_BRIDGE_IDL: any = {
  version: '0.1.0',
  name: 'wormhole',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'wormhole',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'attestToken',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wrappedMeta',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'splMetadata',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeBridge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeMessage',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'wormholeEmitter',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeSequence',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeFeeCollector',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'nonce',
          type: 'u32',
        },
      ],
    },
    {
      name: 'completeNative',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaa',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'claim',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'endpoint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'to',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'toFees',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'custody',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'custodySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'completeWrapped',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaa',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'claim',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'endpoint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'to',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'toFees',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wrappedMeta',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mintAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'transferWrapped',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'from',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fromOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wrappedMeta',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authoritySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeBridge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeMessage',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'wormholeEmitter',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeSequence',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeFeeCollector',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'nonce',
          type: 'u32',
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'fee',
          type: 'u64',
        },
        {
          name: 'targetAddress',
          type: {
            array: ['u8', 32],
          },
        },
        {
          name: 'targetChain',
          type: 'u16',
        },
      ],
    },
    {
      name: 'transferNative',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'from',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'custody',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authoritySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'custodySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeBridge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeMessage',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'wormholeEmitter',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeSequence',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeFeeCollector',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'nonce',
          type: 'u32',
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'fee',
          type: 'u64',
        },
        {
          name: 'targetAddress',
          type: {
            array: ['u8', 32],
          },
        },
        {
          name: 'targetChain',
          type: 'u16',
        },
      ],
    },
    {
      name: 'registerChain',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'endpoint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaa',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'claim',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'createWrapped',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'endpoint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaa',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'claim',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wrappedMeta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'splMetadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mintAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'splMetadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'upgradeContract',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'vaa',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'claim',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'upgradeAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'spill',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'implementation',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'programData',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenBridgeProgram',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bpfLoaderUpgradeable',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'transferWrappedWithPayload',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'from',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fromOwner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wrappedMeta',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authoritySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeBridge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeMessage',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'wormholeEmitter',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeSequence',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeFeeCollector',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'sender',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'nonce',
          type: 'u32',
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'targetAddress',
          type: {
            array: ['u8', 32],
          },
        },
        {
          name: 'targetChain',
          type: 'u16',
        },
        {
          name: 'payload',
          type: 'bytes',
        },
        {
          name: 'cpiProgramId',
          type: {
            option: 'publicKey',
          },
        },
      ],
    },
    {
      name: 'transferNativeWithPayload',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'from',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'custody',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authoritySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'custodySigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeBridge',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeMessage',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'wormholeEmitter',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeSequence',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'wormholeFeeCollector',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'sender',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'wormholeProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'nonce',
          type: 'u32',
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'targetAddress',
          type: {
            array: ['u8', 32],
          },
        },
        {
          name: 'targetChain',
          type: 'u16',
        },
        {
          name: 'payload',
          type: 'bytes',
        },
        {
          name: 'cpiProgramId',
          type: {
            option: 'publicKey',
          },
        },
      ],
    },
  ],
  accounts: [],
};  

export function createTokenBridgeProgramInterface(
  programId: PublicKeyInitData,
  provider?: Provider,
): Program<any> {
  return new Program<any>(
    IDL as any,
    new PublicKey(programId),
    provider === undefined ? ({ connection: null } as any) : provider,
    coder(),
  );
}

export function createReadOnlyTokenBridgeProgramInterface(
  programId: PublicKeyInitData,
  connection?: Connection,
): Program<TokenBridge> {
  return new Program<TokenBridge>(
    TOKEN_BRIDGE_IDL,
    new PublicKey(programId),
    utils.createReadOnlyProvider(connection),
    coder()
  );
}

export function coder(): any {
  return new TokenBridgeCoder(IDL as any);
}
export function createAttestTokenInstruction(
  connection: Connection,
  tokenBridgeProgramId: PublicKeyInitData,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  message: PublicKeyInitData,
  nonce: number,
): TransactionInstruction {
  const program = createReadOnlyTokenBridgeProgramInterface(
    tokenBridgeProgramId,
    connection
  );
  
  if (!program.methods.attestToken) {
    throw new Error('attestToken method not found on program interface');
  }

  const methods = program.methods.attestToken(nonce);

  console.log(
    getAttestTokenAccounts(
      tokenBridgeProgramId,
      wormholeProgramId,
      payer,
      mint,
      message,
    ),
  );
  // @ts-ignore
  return methods._ixFn(...methods._args, {
    accounts: getAttestTokenAccounts(
      tokenBridgeProgramId,
      wormholeProgramId,
      payer,
      mint,
      message,
    ) as any,
    signers: undefined,
    remainingAccounts: undefined,
    preInstructions: undefined,
    postInstructions: undefined,
  });
}

export interface AttestTokenAccounts {
  payer: PublicKey;
  config: PublicKey;
  mint: PublicKey;
  wrappedMeta: PublicKey;
  splMetadata: PublicKey;
  wormholeBridge: PublicKey;
  wormholeMessage: PublicKey;
  wormholeEmitter: PublicKey;
  wormholeSequence: PublicKey;
  wormholeFeeCollector: PublicKey;
  clock: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
  wormholeProgram: PublicKey;
}
import { JsonRpcProvider } from "ethers";
import { EvmAddress } from "../wormhole-sdk-ts/platforms/evm/src/address.js";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes/index.js";

export function getAttestTokenAccounts(
  tokenBridgeProgramId: PublicKeyInitData,
  wormholeProgramId: PublicKeyInitData,
  payer: PublicKeyInitData,
  mint: PublicKeyInitData,
  message: PublicKeyInitData,
): AttestTokenAccounts {
  const {
    bridge: wormholeBridge,
    emitter: wormholeEmitter,
    sequence: wormholeSequence,
    feeCollector: wormholeFeeCollector,
    clock,
    rent,
    systemProgram,
  } = coreUtils.getPostMessageAccounts(
    wormholeProgramId,
    payer,
    message,
    tokenBridgeProgramId,
  );

  return {
    payer: new PublicKey(payer),
    config: new PublicKey("DapiQYH3BGonhN8cngWcXQ6SrqSm3cwysoznoHr6Sbsx"),
    mint: new PublicKey(mint),
    wrappedMeta: new PublicKey("2KQ5vFDhiq3gzgDcig9umCZ5tF9CYYcnkfV7vHADmniL"),
    splMetadata: new PublicKey(mint),
    wormholeBridge: new PublicKey("2yVjuQwpsvdsrywzsJJVs9Ueh4zayyo5DYJbBNc3DDpn"),
    wormholeMessage: new PublicKey(message),
    wormholeEmitter: new PublicKey("Gv1KWf8DT1jKv5pKBmGaTmVszqa56Xn8YGx2Pg7i7qAk"),
    wormholeSequence: new PublicKey("GF2ghkjwsR9CHkGk1RvuZrApPZGBZynxMm817VNi51Nf"),
    wormholeFeeCollector: new PublicKey("9bFNrXNb2WTx8fMHXCheaZqkLZ3YCCaiqTftHxeintHy"),
    clock,
    rent,
    systemProgram,
    wormholeProgram: new PublicKey(wormholeProgramId),
  };
}
// Import required Transaction from @solana/web3.js
const { Transaction } = require("@solana/web3.js");
const payer = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
async function attestToken() {
  // Connect to cluster
  const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
  
  // Token mint address
  const mintPubkey = new PublicKey("HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC");
  
  // Generate message account
  const messageKeypair = Keypair.generate();
  
  // Create attest token instruction
  const instruction = createAttestTokenInstruction(
    connection,
    new PublicKey("wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb"), // Token Bridge Program ID
    new PublicKey("worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth"), // Wormhole Program ID
    payer.publicKey, // Payer
    mintPubkey, // Mint
    payer.publicKey, // Message
    1 // Nonce
  );

  // Log instruction details
  console.log("Wormhole Token Bridge Attest Instruction:", {
    programId: instruction.programId.toBase58(),
    keys: instruction.keys.map(key => ({
      pubkey: key.pubkey.toBase58(),
      isSigner: key.isSigner,
      isWritable: key.isWritable
    })),
    data: Buffer.from(instruction.data).toString('hex')
  });

  // Log accounts structure
  console.log("Attest Token Accounts:", 
    getAttestTokenAccounts(
      new PublicKey("wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb"),
      new PublicKey("worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth"),
      payer.publicKey,
      mintPubkey,
      messageKeypair.publicKey
    )
  );
  // Initialize Wormhole SDK with both chains
  const wh = await wormhole("Mainnet", [evm, solana]);

  // Get chain contexts
  const solanaChain = wh.getChain("Solana");
  const baseChain = wh.getChain("Base");
  // Create and send transaction
  const transaction = new Transaction().add(instruction);
  transaction.feePayer = payer.publicKey;
  
  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  // Sign and send transaction
  try {
    const signature = await connection.sendTransaction(transaction, [payer]);
    console.log("Transaction signature:", signature);
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature);
    console.log("Transaction confirmed:", confirmation);

    // Get VAA from transaction
    const msgs = await solanaChain.parseTransaction(signature);
    const vaa = await wh.getVaa(msgs[0], "TokenBridge:AttestMeta", 60_000);
    
    if (!vaa) throw new Error("VAA not found after timeout");
    
    // Get token bridge reference for Base chain
    const tb = await baseChain.getTokenBridge();
    
    // Get EVM signer
    const signer = await getEvmSignerForKey(
      new JsonRpcProvider("https://mainnet.base.org"), 
      process.env.BASE_PRIVATE_KEY!
    );

    // Submit attestation to Base chain
    console.log("Submitting attestation to Base...");
    await signSendWait(
      baseChain,
      // @ts-ignore
      tb.submitAttestation(vaa, Wormhole.parseAddress(signer.chain(), signer.address()) as EvmAddress),
      signer
    );
    console.log("Attestation complete!");

  } catch (error) {
    console.error("Error during attestation:", error);
    throw error;
  }
}

attestToken();