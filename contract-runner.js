import {scanAllServers} from "./utils.js"
import {readRegistry,updateRegistry} from "./registry.js"
import {solveContract} from "./contract-solvers.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const servers = scanAllServers(ns)

    let found = 0
    let solved = 0

    for(const server of servers)
    {
        const files = ns.ls(server,".cct")

        if(files.length === 0) continue

        for(const file of files)
        {
            found++

            try
            {
                const type = ns.codingcontract.getContractType(file,server)
                const data = ns.codingcontract.getData(file,server)

                const answer = solveContract(type,data)

                if(answer === null) continue

                const result = ns.codingcontract.attempt(answer,file,server)

                if(result)
                {
                    solved++
                }
            }
            catch{}
        }
    }

    updateRegistry(ns,"contracts.lastScan",Date.now())
    updateRegistry(ns,"contracts.found",found)
    updateRegistry(ns,"contracts.solved",solved)

    ns.exit()
}