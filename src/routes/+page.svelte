<script lang="ts">
	import { config } from './config';
	import {parseUnits, formatUnits} from 'viem';
	import {
		connect,
		readContract,
		writeContract,
		switchChain,
		watchAccount,
		watchChainId,
		getBalance,
		waitForTransactionReceipt
	} from '@wagmi/core';
	import { injected } from '@wagmi/connectors';
	import { onDestroy, onMount } from 'svelte';
	import { bsc } from '@wagmi/core/chains';
	import { erc20, multisend } from '$lib/abi';

	let isLoading: boolean = false;
	let amountsWithWallets: string = '';
	let token: string;
	let customToken: string;
	let tokenBalance: bigint = 0n;
	let tokenDecimals: number = 18;
	const multisendAddress = '0xfb6bd0c00bd348125a1f6edc36e4b7ff5dbddfba';
	const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

	$: token, customToken, updateTokenBalance(token, customToken)
	$: token, customToken, updateTokenDecimals(token, customToken)

	const updateTokenDecimals = async (token: string, customToken: string) => {
		try {
			isLoading = true;
			if (token === NATIVE_TOKEN) {
				return
			}
			if (token === 'custom') {
				if (customToken) {
					tokenDecimals = await readContract(config, {
						abi: erc20,
						address: customToken,
						functionName: 'decimals',
					}) as number
				}
			} else if (token) {
				tokenDecimals = await readContract(config, {
					abi: erc20,
					address: token,
					functionName: 'decimals',
				}) as number
			}
		} catch (e) {
			console.error(e)
		} finally {
			isLoading = false;
		}
	}

	const updateTokenBalance = async (token: string, customToken: string) => {
		try {
			isLoading = true;
			if (!account) return;
			if (token === NATIVE_TOKEN) {
				tokenBalance= (await getBalance(config, {
					address: account,
				})).value
			} else if (token === 'custom') {
				if (customToken && account) {
					tokenBalance = await readContract(config, {
						abi: erc20,
						address: customToken,
						functionName: 'balanceOf',
						args: [account]
					}) as bigint
				}
			} else if (token) {
				tokenBalance = await readContract(config, {
					abi: erc20,
					address: token,
					functionName: 'balanceOf',
					args: [account]
				}) as bigint
			}
		} catch (e) {
			console.error(e)
		} finally {
			isLoading = false;
		}
	}

	let unwatch: any;
	onMount(() => {
		unwatch = watchChainId(config, {
			onChange(id) {
				chainId = id
			},
		});
		watchAccount(config, {
			onChange(data) {
				account = data.address
			},
		})
	})

	onDestroy(() => {
		if (unwatch) unwatch()
	})

	let account: string = '';
	let chainId: number;
	const connectWallet = async () => {
		const result = await connect(config, { connector: injected() })
		if (result.accounts?.at(0)) account = result.accounts[0]
		if (result.chainId) chainId = result.chainId
		console.log(result)
		if (chainId !== 56) {
			await switchChain(config, { chainId: bsc.id })
		}
	}

	onMount(async () => {
		await connectWallet()
	})

	const approveAndSend = async () => {
		try {
			isLoading = true;
			const wallets = amountsWithWallets.trim().split('\n').map((line) => {
				const [address, amount] = line.split(',')
				return {
					address: address.trim(),
					amount: parseUnits(amount.trim(), tokenDecimals)
				}
			})
			const totalAmount = wallets.reduce((acc, wallet) => acc + wallet.amount, 0n)
			const tokenToSent = token === 'custom' ? customToken : token
			if (tokenToSent === NATIVE_TOKEN) {
				const txHash = await writeContract(config, {
					abi: multisend,
					address: multisendAddress,
					functionName: 'multiSend',
					args: [wallets.map((wallet) => ['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', wallet.address, wallet.amount])],
					value: totalAmount
				})
				await waitForTransactionReceipt(config, {
					hash: txHash
				})
			} else {
				const allowance = await readContract(config, {
					abi: erc20,
					address: tokenToSent,
					functionName: 'allowance',
					args: [account, multisendAddress]
				}) as bigint
				console.log(allowance, totalAmount, 'allowance')
				if (allowance < totalAmount) {
					console.log(allowance, totalAmount, 'allowance')
					const approveTxHash = await writeContract(config, {
						abi: erc20,
						address: tokenToSent,
						functionName: 'approve',
						args: [multisendAddress, totalAmount]
					})
					if (approveTxHash) {
						await waitForTransactionReceipt(config, {
							hash: approveTxHash
						})
					}
				}
				const txHash = await writeContract(config, {
					abi: multisend,
					address: multisendAddress,
					functionName: 'multiERC20Transfer',
					args: [tokenToSent, wallets.map((wallet) => wallet.address), wallets.map((wallet) => wallet.amount)]
				})
				if (txHash) {
					await waitForTransactionReceipt(config, {
						hash: txHash
					})
				}
			}
		} catch (e) {
			console.error(e)
		} finally {
			isLoading = false;
		}
	}
</script>

{#if chainId !== undefined && chainId !== 56}
	<div style="color: red;">Please switch to BSC</div>
{/if}

<button style="margin-bottom: 16px;" on:click={connectWallet}>
	{account ?? 'Connect Wallet'}
</button>

<div style="display:flex; margin-bottom: 8px;">
	<div>Select Token:</div>
	<select bind:value={token}>
		<option value={NATIVE_TOKEN}>BNB</option>
		<option value="0x6AA217312960A21aDbde1478DC8cBCf828110A67">SPIN (0x6A...0A67)</option>
		<option value="0x2947C22608D742AF4e8C16D86f90a93969f13F8D">CAKEBOT (0x29...3F8D)</option>
		<option value="0x55d398326f99059ff775485246999027b3197955">USDT (0x55...7955)</option>
		<option value="custom">Custom</option>
	</select>
	{#if token === 'custom'}
		<input bind:value={customToken} type="text" placeholder="Enter Token Address" />
	{/if}
</div>
<div style="margin-bottom: 8px;">Token Balance: {
	parseFloat(formatUnits(tokenBalance, tokenDecimals)).toLocaleString("en")
}</div>

<div>
	<textarea bind:value={amountsWithWallets} placeholder="Wallet addresses with amounts. (Seperated with commas)
Example:
0xa,0.1
0xb,0.2" />
</div>

<button on:click={approveAndSend} disabled={isLoading}>Approve and Send</button>

<style>
	textarea {
		width: 50%;
		min-height: 200px
	}
</style>
