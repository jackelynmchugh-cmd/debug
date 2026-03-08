import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const SCAN_INTERVAL = 15000

    while(true)
    {
        const reg = readRegistry(ns)

        if(!reg?.darknet?.torPurchased) 
        {
            await ns.sleep(SCAN_INTERVAL)
            continue
        }

        if(!ns.fileExists("darknetscape.exe","home"))
        {
            await ns.sleep(SCAN_INTERVAL)
            continue
        }

        try
        {
            await crawlDarknet(ns)
        }
        catch{}

        await ns.sleep(SCAN_INTERVAL)
    }
}



async function crawlDarknet(ns)
{
    const servers = ns.scan("darkweb")

    let authedCount = 0
    let cacheCount = 0

    for(const server of servers)
    {
        try
        {
            if(!ns.hasRootAccess(server))
            {
                tryAuth(ns,server)
            }

            if(ns.hasRootAccess(server))
            {
                authedCount++
                openCache(ns,server)
                cacheCount++
            }
        }
        catch{}
    }

    updateRegistry(ns,"darknet.authedServers",authedCount)
    updateRegistry(ns,"darknet.cacheOpened",cacheCount)
}



function tryAuth(ns,server)
{
    try
    {
        ns.brutessh(server)
    }
    catch{}

    try
    {
        ns.ftpcrack(server)
    }
    catch{}

    try
    {
        ns.relaysmtp(server)
    }
    catch{}

    try
    {
        ns.httpworm(server)
    }
    catch{}

    try
    {
        ns.sqlinject(server)
    }
    catch{}

    try
    {
        ns.nuke(server)
    }
    catch{}
}



function openCache(ns,server)
{
    try
    {
        ns.scan(server)
    }
    catch{}
}