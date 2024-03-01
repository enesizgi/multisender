import { http, createConfig } from '@wagmi/core';
import { bsc } from '@wagmi/core/chains';
import { injected, safe } from '@wagmi/connectors';

export const config = createConfig({
	chains: [bsc],
	connectors: [injected(), safe()],
	transports: {
		[bsc.id]: http()
	}
});
