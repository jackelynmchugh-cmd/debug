import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    while(true)
    {
        await detectUnlocks(ns)

        await scheduleSingularity(ns)

        await runAutomationSystems(ns)

        await crashRecovery(ns)

        await ns.sleep(5000)
    }
}

async function detectUnlocks(ns)
{
    try
    {
        if(ns.singularity)
            updateRegistry(ns,"singularity.unlocked",true)
    }
    catch{}

    try
    {
        if(ns.stock)
            updateRegistry(ns,"stocks.unlocked",true)
    }
    catch{}
}

async function scheduleSingularity(ns)
{
    const reg = readRegistry(ns)

    if(!reg?.singularity?.unlocked) return

    const runtime = Date.now() - reg.singularity.taskStart
    const MIN_RUNTIME = 300000

    if(runtime < MIN_RUNTIME) return

    const nextTask = decideTask(ns)

    if(nextTask !== reg.singularity.currentTask)
    {
        stopAllSingularity(ns)

        ns.exec(nextTask,"home",1)

        updateRegistry(ns,"singularity.currentTask",nextTask)
        updateRegistry(ns,"singularity.taskStart",Date.now())
    }
}

function decideTask(ns)
{
    const player = ns.getPlayer()

    if(player.skills.hacking < 50)
        return "university.js"

    if(player.money < 2000000)
        return "crime.js"

    if(player.factions.length > 0)
        return "faction-work.js"

    return "company-work.js"
}

function stopAllSingularity(ns)
{
    const tasks = [
        "crime.js",
        "faction-work.js",
        "company-work.js",
        "university.js"
    ]

    for(const script of tasks)
    {
        if(ns.scriptRunning(script,"home"))
            ns.scriptKill(script,"home")
    }
}

async function runAutomationSystems(ns)
{
    const systems = [
        "HGW-controller.js",
        "autoroot.js",
        "backdoor.js",
        "pserv-manager.js",
        "hacknet-manager.js",
        "home-upgrader.js",
        "contract-runner.js",
        "tor-manager.js",
        "darknet-crawler.js",
        "stock-trader.js"
    ]

    const HOME_BUFFER = 5

    for(const script of systems)
    {
        if(!ns.scriptRunning(script,"home"))
        {
            const max = ns.getServerMaxRam("home")
            const used = ns.getServerUsedRam("home")
            const free = max - used

            const cost = ns.getScriptRam(script)

            if(free - cost > HOME_BUFFER)
            {
                ns.exec(script,"home",1)
            }
        }
    }
}
import {detectBitNode} from "./utils.js"
import {BITNODES} from "./game-data.js"

const node = detectBitNode(ns)

updateRegistry(ns,"bitnode.current",node)

if(BITNODES[node])
{
    updateRegistry(ns,"bitnode.description",BITNODES[node].name)
}

async function crashRecovery(ns)
{
    if(!ns.scriptRunning("HGW-controller.js","home"))
    {
        ns.exec("HGW-controller.js","home",1)
    }
}