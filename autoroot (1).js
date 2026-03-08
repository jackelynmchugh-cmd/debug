import {scanAllServers} from "./utils.js"
import {updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const servers = scanAllServers(ns)

    const crackers = [
        ["BruteSSH.exe", (s)=>ns.brutessh(s)],
        ["FTPCrack.exe", (s)=>ns.ftpcrack(s)],
        ["relaySMTP.exe", (s)=>ns.relaysmtp(s)],
        ["HTTPWorm.exe", (s)=>ns.httpworm(s)],
        ["SQLInject.exe", (s)=>ns.sqlinject(s)]
    ]

    let rootedSomething = false

    for(const server of servers)
    {
        if(server === "home") continue

        if(ns.hasRootAccess(server)) continue

        const requiredLevel = ns.getServerRequiredHackingLevel(server)

        if(ns.getHackingLevel() < requiredLevel) continue

        let portsOpened = 0

        for(const [program,fn] of crackers)
        {
            if(ns.fileExists(program,"home"))
            {
                try
                {
                    fn(server)
                    portsOpened++
                }
                catch{}
            }
        }

        const requiredPorts = ns.getServerNumPortsRequired(server)

        if(portsOpened >= requiredPorts)
        {
            try
            {
                ns.nuke(server)

                updateRegistry(ns,"servers.lastRooted",server)

                rootedSomething = true
            }
            catch{}
        }
    }

    if(rootedSomething)
        ns.print("New servers rooted")

    ns.exit()
}