interface EthereumProvider {
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: "accountsChanged", handler: (accounts: string[]) => void) => void;
  on: (event: "chainChanged", handler: () => void) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: "accountsChanged", handler: (accounts: string[]) => void) => void;
  removeListener: (event: "chainChanged", handler: () => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

interface Window {
  ethereum?: EthereumProvider;
}
