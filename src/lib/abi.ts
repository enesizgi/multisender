export const erc20 = [
	{
		type: 'function',
		name: 'balanceOf',
		stateMutability: 'view',
		inputs: [{ name: 'account', type: 'address' }],
		outputs: [{ type: 'uint256' }]
	},
	{
		type: 'function',
		name: 'totalSupply',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: 'supply', type: 'uint256' }]
	},
	{
		type: 'function',
		name: 'decimals',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: '', type: 'uint8' }]
	},
	{
		type: 'function',
		name: 'allowance',
		stateMutability: 'view',
		inputs: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' }
		],
		outputs: [{ type: 'uint256' }]
	},
	{
		type: 'function',
		name: 'approve',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'spender', type: 'address' },
			{ name: 'amount', type: 'uint256' }
		],
		outputs: [{ type: 'bool' }]
	}
];

export const multisend = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: '_from', type: 'address' },
			{ indexed: true, internalType: 'address', name: '_to', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: '_amount', type: 'uint256' }
		],
		name: 'Call',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		inputs: [
			{ internalType: 'address[]', name: '_addresses', type: 'address[]' },
			{ internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' }
		],
		name: 'multiCall',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32[]', name: '_addressesAndAmounts', type: 'bytes32[]' }],
		name: 'multiCallTightlyPacked',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_token', type: 'address' },
			{ internalType: 'address[]', name: '_addresses', type: 'address[]' },
			{ internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' }
		],
		name: 'multiERC20Transfer',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: '_token', type: 'address' },
			{ internalType: 'bytes32[]', name: '_addressesAndAmounts', type: 'bytes32[]' }
		],
		name: 'multiERC20TransferTightlyPacked',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'address', name: 'token', type: 'address' },
					{ internalType: 'address', name: 'to', type: 'address' },
					{ internalType: 'uint256', name: 'amount', type: 'uint256' }
				],
				internalType: 'struct MultiSend.Send[]',
				name: 'sends',
				type: 'tuple[]'
			}
		],
		name: 'multiSend',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'token', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			{ internalType: 'address', name: 'to', type: 'address' }
		],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{ stateMutability: 'payable', type: 'receive' }
];
