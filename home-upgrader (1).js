import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    const reg = readRegistry(ns)

    const now = Date.now()

    if(reg?.pserv?.cooldownUntil && now < reg.pserv.cooldownUntil)
        ns.exit()


    let rotation = reg?.home?.upgradeRotation ?? 0
    let ramFallback = reg?.home?.ramFallback ?? 0


    const ramCost = ns.singularity.getUpgradeHomeRamCost()
    const coreCost = ns.singularity.getUpgradeHomeCoresCost()

    const money = ns.getServerMoneyAvailable("home")


    if(rotation === 0 || rotation === 1)
    {
        if(money >= ramCost)
        {
            ns.singularity.upgradeHomeRam()

            rotation++
            ramFallback = 0

            updateRegistry(ns,"home.upgradeRotation",rotation)
            updateRegistry(ns,"home.ramFallback",ramFallback)

            ns.exit()
        }

        ns.exit()
    }


    if(rotation === 2)
    {
        if(money >= coreCost)
        {
            ns.singularity.upgradeHomeCores()

            rotation = 0
            ramFallback = 0

            updateRegistry(ns,"home.upgradeRotation",rotation)
            updateRegistry(ns,"home.ramFallback",ramFallback)

            ns.exit()
        }

        ramFallback++

        if(ramFallback >= 2 && money >= ramCost)
        {
            ns.singularity.upgradeHomeRam()

            rotation = 1
            ramFallback = 0

            updateRegistry(ns,"home.upgradeRotation",rotation)
            updateRegistry(ns,"home.ramFallback",ramFallback)

            ns.exit()
        }

        updateRegistry(ns,"home.ramFallback",ramFallback)

        ns.exit()
    }

    ns.exit()
}