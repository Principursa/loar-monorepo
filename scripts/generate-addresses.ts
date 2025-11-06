import fs from 'fs'
import path from 'path'

//change later to make these terminal args
const broadcastDir = path.resolve(__dirname, '../apps/contracts/broadcast')
const outFile = path.resolve(__dirname, '../packages/abis/src/addresses.ts')

// ContractName -> { chainId -> address }
const contracts: Record<string, Record<number, string>> = {}

for (const scriptName of fs.readdirSync(broadcastDir)) {
  const scriptPath = path.join(broadcastDir, scriptName)

  for (const chainId of fs.readdirSync(scriptPath)) {
    const chainPath = path.join(scriptPath, chainId)

    const runLatest = path.join(chainPath, 'run-latest.json')
    if (!fs.existsSync(runLatest)) continue

    const data = JSON.parse(fs.readFileSync(runLatest, 'utf-8'))
    for (const tx of data.transactions || []) {
      if (tx.contractName && tx.contractAddress) {
        contracts[tx.contractName] ??= {}
        contracts[tx.contractName][+chainId] = tx.contractAddress
      }
    }
  }
}

// Emit TS file
let tsOut = `// Auto-generated from Foundry broadcast\n\n`

for (const [contract, chains] of Object.entries(contracts)) {
  tsOut += `export const ${contract} = ${JSON.stringify(chains, null, 2)} as const\n\n`
  tsOut += `export type ${contract}ChainId = keyof typeof ${contract}\n\n`
}

fs.writeFileSync(outFile, tsOut)
console.log(`✅ Wrote addresses to ${outFile}`)
