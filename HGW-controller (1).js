import {scanAllServers,getFreeRam} from "./utils.js"
import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const WORKER = "hgw-worker.js"
    const MIGRATION_RAM = 16

    while(true)
    {
        await checkMigration(ns)

        const target = chooseTarget(ns)

        if(!target)
        {
            await ns.sleep(5000)
            continue
        }

        updateRegistry(ns,"hacking.target",target)

        if(!isPrepped(ns,target))
        {
            updateRegistry(ns,"hacking.mode","prep")
            await runPrep(ns,target,WORKER)
        }
        else
        {
            updateRegistry(ns,"hacking.mode","batch")
            await runBatch(ns,target,WORKER)
        }

        await ns.sleep(200)
    }
}



async function checkMigration(ns)
{
    if(ns.getHostname() !== "home") return

    if(!ns.serverExists("pserv-0")) return

    const ram = ns.getServerMaxRam("pserv-0")

    if(ram < 16) return

    const files = [
        "hgw-controller.js",
        "hgw-worker.js",
        "utils.js",
        "registry.js"
    ]

    await ns.scp(files,"pserv-0","home")

    ns.exec("hgw-controller.js","pserv-0",1)

    ns.exit()
}



function chooseTarget(ns)
{
    const servers = scanAllServers(ns)

    let best = null
    let bestScore = 0

    for(const server of servers)
    {
        if(!ns.hasRootAccess(server)) continue
        if(ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) continue

        const money = ns.getServerMaxMoney(server)
        const sec = ns.getServerMinSecurityLevel(server)

        if(money <= 0) continue

        const score = money/sec

        if(score > bestScore)
        {
            bestScore = score
            best = server
        }
    }

    return best
}



function isPrepped(ns,target)
{
    const money = ns.getServerMoneyAvailable(target)
    const maxMoney = ns.getServerMaxMoney(target)

    const sec = ns.getServerSecurityLevel(target)
    const minSec = ns.getServerMinSecurityLevel(target)

    return money >= maxMoney*0.99 && sec <= minSec+1
}



async function runPrep(ns,target,worker)
{
    const weakenTime = ns.getWeakenTime(target)

    const growThreads = 50
    const weakenThreads = 50

    dispatch(ns,worker,target,"grow",0,growThreads)
    dispatch(ns,worker,target,"weaken",200,weakenThreads)

    await ns.sleep(weakenTime+500)
}



async function runBatch(ns,target,worker)
{
    const hackTime = ns.getHackTime(target)
    const growTime = ns.getGrowTime(target)
    const weakenTime = ns.getWeakenTime(target)

    const hackThreads = 10
    const growThreads = 20
    const weakenThreads = 30

    dispatch(ns,worker,target,"hack",0,hackThreads)
    dispatch(ns,worker,target,"weaken",200,weakenThreads)

    dispatch(ns,worker,target,"grow",hackTime+200,growThreads)
    dispatch(ns,worker,target,"weaken",hackTime+400,weakenThreads)

    await ns.sleep(weakenTime+500)
}



function dispatch(ns,script,target,action,delay,threads)
{
    const servers = scanAllServers(ns)

    const ramCost = ns.getScriptRam(script)

    for(const server of servers)
    {
        if(!ns.hasRootAccess(server)) continue

        const free = getFreeRam(ns,server)

        const maxThreads = Math.floor(free/ramCost)

        if(maxThreads <= 0) continue

        const useThreads = Math.min(maxThreads,threads)

        ns.exec(script,server,useThreads,target,action,delay)

        threads -= useThreads

        if(threads <= 0) return
    }
}