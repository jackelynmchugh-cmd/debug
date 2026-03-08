import {scanAllServers, findPath} from "./utils.js"
import {updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    if(!ns.singularity)
        ns.exit()

    const servers = scanAllServers(ns)

    for(const server of servers)
    {
        if(server === "home") continue

        if(!ns.hasRootAccess(server)) continue

        if(ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel())
            continue

        const info = ns.getServer(server)

        if(info.backdoorInstalled) continue

        if(info.purchasedByPlayer) continue


        const path = findPath(ns,server)

        if(!path) continue

        try
        {
            for(const node of path)
            {
                ns.singularity.connect(node)
            }

            await ns.singularity.installBackdoor()

            updateRegistry(ns,"servers.lastBackdoor",server)

            ns.singularity.connect("home")

            ns.exit()
        }
        catch
        {
            ns.singularity.connect("home")
        }
    }

    ns.exit()
}