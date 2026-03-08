import {readRegistry,updateRegistry} from "./registry.js"
import {detectBitNode} from "./utils.js"
import {BITNODES} from "./game-data.js"
import {FACTIONS} from "./faction-data.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    while(true)
    {
        await detectEnvironment(ns)

        await scheduleSingularity(ns)

        await runAutomationSystems(ns)

        await crashRecovery(ns)

        await ns.sleep(5000)
    }
}



async function detectEnvironment(ns)
{
    const reg = readRegistry(ns)

    /** Detect BitNode **/

    const node = detectBitNode(ns)

    if(reg?.bitnode?.current !== node)
    {
        updateRegistry(ns,"bitnode.current",node)

        if(BITNODES[node])
        {
            updateRegistry(ns,"bitnode.description",BITNODES[node].name)
        }
    }


    /** Detect API unlocks **/

    try
    {
        if(ns.singularity?.workForFaction)
            updateRegistry(ns,"singularity.unlocked",true)
    }
    catch{}

    try
    {
        if(ns.stock?.getSymbols)
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


    const targetFaction = determineFactionGoal(ns)

    if(targetFaction)
    {
        updateRegistry(ns,"progress.nextFaction",targetFaction)
    }

    const nextTask = decideTask(ns,targetFaction)


    if(nextTask !== reg.singularity.currentTask)
    {
        stopAllSingularity(ns)

        ns.exec(nextTask,"home",1)

        updateRegistry(ns,"singularity.currentTask",nextTask)
        updateRegistry(ns,"singularity.taskStart",Date.now())
    }
}



function determineFactionGoal(ns)
{
    const player = ns.getPlayer()

    for(const faction in FACTIONS)
    {
        if(player.factions.includes(faction)) continue

        return faction
    }

    return null
}



function decideTask(ns,targetFaction)
{
    const player = ns.getPlayer()

    if(!targetFaction)
        return "faction-work.js"

    const req = FACTIONS[targetFaction]?.requirements

    if(!req)
        return "faction-work.js"


    if(req.hacking && player.skills.hacking < req.hacking)
        return "university.js"


    if(req.money && player.money < req.money)
        return "crime.js"


    if(req.backdoor)
        return "backdoor.js"


    if(req.hacknetLevels || req.hacknetRam)
        return "hacknet-manager.js"


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
        "university.js",
        "backdoor.js"
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

    const max = ns.getServerMaxRam("home")
    const used = ns.getServerUsedRam("home")

    let free = max - used


    for(const script of systems)
    {
        if(!ns.scriptRunning(script,"home"))
        {
            const cost = ns.getScriptRam(script)

            if(free - cost > HOME_BUFFER)
            {
                ns.exec(script,"home",1)

                free -= cost
            }
        }
    }
}



async function crashRecovery(ns)
{
    if(!ns.scriptRunning("HGW-controller.js","home"))
    {
        ns.exec("HGW-controller.js","home",1)
    }
}
