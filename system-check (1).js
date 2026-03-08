import {readRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    ns.tail()
    ns.resizeTail(500,400)
    ns.moveTail(100,100)

    ns.clearLog()

    const green = "\u001b[32m"
    const yellow = "\u001b[33m"
    const red = "\u001b[31m"
    const cyan = "\u001b[36m"
    const reset = "\u001b[0m"

    const requiredScripts = [
        "master-brain.js",
        "awareness.js",
        "registry.js",
        "utils.js",
        "tracker.js",
        "hgw-controller.js",
        "hgw-worker.js",
        "autoroot.js",
        "pserv-manager.js",
        "hacknet-manager.js",
        "home-upgrader.js",
        "tor-manager.js",
        "darknet-crawler.js",
        "crime.js",
        "university.js",
        "company-work.js",
        "faction-work.js",
        "backdoor.js",
        "contract-runner.js",
        "contract-solvers.js",
        "stock-trader.js"
    ]

    ns.print(`${cyan}===== SYSTEM CHECK =====${reset}`)

    ns.print("")
    ns.print(`${cyan}SCRIPT FILES${reset}`)

    for(const script of requiredScripts)
    {
        if(ns.fileExists(script,"home"))
            ns.print(`${green}OK${reset}  ${script}`)
        else
            ns.print(`${red}MISSING${reset}  ${script}`)
    }


    ns.print("")
    ns.print(`${cyan}REGISTRY STATUS${reset}`)

    let registry

    try
    {
        registry = readRegistry(ns)
        ns.print(`${green}Registry loaded${reset}`)
    }
    catch
    {
        ns.print(`${red}Registry corrupted or missing${reset}`)
    }

    if(registry)
    {
        checkField(ns,registry,"hacking.target")
        checkField(ns,registry,"servers.lastRooted")
        checkField(ns,registry,"servers.lastBackdoor")
        checkField(ns,registry,"pserv.count")
        checkField(ns,registry,"stocks.mode")
        checkField(ns,registry,"darknet.torPurchased")
    }


    ns.print("")
    ns.print(`${cyan}API ACCESS${reset}`)

    try
    {
        if(ns.singularity)
            ns.print(`${green}Singularity available${reset}`)
        else
            ns.print(`${yellow}Singularity not unlocked${reset}`)
    }
    catch
    {
        ns.print(`${yellow}Singularity unavailable${reset}`)
    }

    try
    {
        if(ns.stock)
            ns.print(`${green}Stock API available${reset}`)
        else
            ns.print(`${yellow}Stock API not unlocked${reset}`)
    }
    catch
    {
        ns.print(`${yellow}Stock API unavailable${reset}`)
    }

    try
    {
        ns.print(`${green}Hacknet API available${reset}`)
    }
    catch
    {
        ns.print(`${red}Hacknet API failure${reset}`)
    }


    ns.print("")
    ns.print(`${cyan}SERVER STATUS${reset}`)

    const rooted = ns.getPurchasedServers().length
    ns.print(`Purchased Servers : ${rooted}`)

    const ram = ns.getServerMaxRam("home")
    ns.print(`Home RAM : ${ram} GB`)

    ns.print("")
    ns.print(`${cyan}===== CHECK COMPLETE =====${reset}`)
}



function checkField(ns,obj,path)
{
    const green = "\u001b[32m"
    const red = "\u001b[31m"
    const reset = "\u001b[0m"

    const keys = path.split(".")
    let value = obj

    for(const k of keys)
    {
        if(value?.[k] === undefined)
        {
            ns.print(`${red}Missing registry field: ${path}${reset}`)
            return
        }
        value = value[k]
    }

    ns.print(`${green}OK${reset}  ${path}`)
}