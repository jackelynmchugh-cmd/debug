import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const reg = readRegistry(ns)

    const programs = [
        "BruteSSH.exe",
        "FTPCrack.exe",
        "relaySMTP.exe",
        "HTTPWorm.exe",
        "SQLInject.exe",
        "ServerProfiler.exe",
        "DeepscanV1.exe",
        "DeepscanV2.exe",
        "AutoLink.exe",
        "darknetscape.exe"
    ]


    /** BUY TOR **/

    try
    {
        if(!reg?.darknet?.torPurchased)
        {
            const money = ns.getServerMoneyAvailable("home")

            if(money >= 200000)
            {
                if(ns.singularity.purchaseTor())
                {
                    updateRegistry(ns,"darknet.torPurchased",true)
                }
            }

            ns.exit()
        }
    }
    catch
    {
        ns.exit()
    }


    if(!reg?.darknet?.torPurchased)
        ns.exit()


    /** BUY PROGRAMS **/

    let allOwned = true

    for(const program of programs)
    {
        if(!ns.fileExists(program,"home"))
        {
            allOwned = false

            try
            {
                ns.singularity.purchaseProgram(program)
            }
            catch{}
        }
    }


    /** MARK COMPLETION **/

    if(allOwned)
    {
        updateRegistry(ns,"darknet.programsComplete",true)
    }

    ns.exit()
}