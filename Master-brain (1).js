import {ensureRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const CORE_SERVICES = [
        "awareness.js",
        "tracker.js"
    ]

    const HOME_BUFFER = 5

    ensureRegistry(ns)

    while(true)
    {
        const max = ns.getServerMaxRam("home")
        const used = ns.getServerUsedRam("home")
        const free = max - used

        for (const script of CORE_SERVICES)
        {
            if (!ns.scriptRunning(script,"home"))
            {
                const cost = ns.getScriptRam(script)

                if (free - cost > HOME_BUFFER)
                {
                    ns.exec(script,"home",1)
                }
            }
        }

        await ns.sleep(5000)
    }
}