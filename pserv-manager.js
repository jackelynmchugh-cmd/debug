import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const MAX_TARGET_RAM = 2048
    const START_RAM = 8
    const COOLDOWN = 300000

    const reg = readRegistry(ns)

    const now = Date.now()

    if(reg?.pserv?.cooldownUntil && now < reg.pserv.cooldownUntil)
        ns.exit()


    const limit = ns.getPurchasedServerLimit()
    const owned = ns.getPurchasedServers()

    updateRegistry(ns,"pserv.count",owned.length)

    if(owned.length < limit)
    {
        await buyServer(ns,owned.length)
        ns.exit()
    }


    const lowest = findLowestRamServer(ns,owned)

    if(!lowest) ns.exit()

    const currentRam = ns.getServerMaxRam(lowest)

    if(currentRam >= MAX_TARGET_RAM)
    {
        updateRegistry(ns,"pserv.maxed",true)
        ns.exit()
    }

    const nextRam = currentRam * 2

    const cost = ns.getPurchasedServerCost(nextRam)

    if(ns.getServerMoneyAvailable("home") < cost)
        ns.exit()


    const hostname = lowest

    ns.killall(hostname)

    ns.deleteServer(hostname)

    const newServer = ns.purchaseServer(hostname,nextRam)

    if(newServer)
    {
        updateRegistry(ns,"pserv.ram",nextRam)
        updateRegistry(ns,"pserv.cooldownUntil",now + COOLDOWN)
    }

    ns.exit()
}



async function buyServer(ns,index)
{
    const START_RAM = 8

    const cost = ns.getPurchasedServerCost(START_RAM)

    if(ns.getServerMoneyAvailable("home") < cost)
        return

    const name = "pserv-" + index

    const server = ns.purchaseServer(name,START_RAM)

    if(server)
    {
        updateRegistry(ns,"pserv.ram",START_RAM)
    }
}



function findLowestRamServer(ns,servers)
{
    let lowest = null
    let ram = Infinity

    for(const s of servers)
    {
        const r = ns.getServerMaxRam(s)

        if(r < ram)
        {
            ram = r
            lowest = s
        }
    }

    return lowest
}