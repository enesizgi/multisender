import { http, createConfig } from '@wagmi/core';
import { base, bsc, bscTestnet, polygon } from '@wagmi/core/chains';
import { injected, safe } from '@wagmi/connectors';
import { dev } from '$app/environment';

const chains = [bsc, polygon, base];
const transports = {
	[bsc.id]: http(),
	[polygon.id]: http(),
	[base.id]: http()
};

if (dev) {
	chains.push(bscTestnet);
	transports[bscTestnet.id] = http();
}

export const config = createConfig({
	chains,
	connectors: [injected(), safe()],
	transports
});
