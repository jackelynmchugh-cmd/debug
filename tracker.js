import {readRegistry} from "./registry.js"
import {formatMoney} from "./utils.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    ns.tail()
    ns.resizeTail(520,650)
    ns.moveTail(20,20)

    let lastXP = ns.getPlayer().exp.hacking
    let lastMoney = ns.getServerMoneyAvailable("home")
    let lastTime = Date.now()

    while(true)
    {
        ns.clearLog()

        const reg = readRegistry(ns)
        const player = ns.getPlayer()

        const now = Date.now()

        const currentXP = player.exp.hacking
        const currentMoney = ns.getServerMoneyAvailable("home")

        const timeDiff = (now-lastTime)/1000

        const xpPerSec = timeDiff > 0 ? (currentXP-lastXP)/timeDiff : 0
        const incomePerSec = timeDiff > 0 ? (currentMoney-lastMoney)/timeDiff : 0

        lastXP = currentXP
        lastMoney = currentMoney
        lastTime = now


        const cyan = "\u001b[36m"
        const green = "\u001b[32m"
        const yellow = "\u001b[33m"
        const magenta = "\u001b[35m"
        const blue = "\u001b[34m"
        const reset = "\u001b[0m"


        ns.print(`${cyan}=================================================${reset}`)
        ns.print(`${cyan}                 AUTOMATION TRACKER              ${reset}`)
        ns.print(`${cyan}=================================================${reset}`)


        /** PLAYER **/

        ns.print("")
        ns.print(`${green}PLAYER${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Hacking Level        : ${ns.formatNumber(player.skills.hacking)}`)
        ns.print(`Money                : $${formatMoney(ns,currentMoney)}`)
        ns.print(`Income/sec           : $${formatMoney(ns,incomePerSec)}`)
        ns.print(`XP/sec               : ${ns.formatNumber(xpPerSec)}`)


        /** HACKING **/

        ns.print("")
        ns.print(`${yellow}HACKING SYSTEM${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Target Server        : ${reg?.hacking?.target ?? ""}`)
        ns.print(`Mode                 : ${reg?.hacking?.mode ?? ""}`)
        ns.print(`Controller Host      : ${reg?.hacking?.controllerHost ?? ""}`)


        /** SERVERS **/

        ns.print("")
        ns.print(`${magenta}SERVER STATUS${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Last Rooted          : ${reg?.servers?.lastRooted ?? ""}`)
        ns.print(`Last Backdoor        : ${reg?.servers?.lastBackdoor ?? ""}`)


        /** PURCHASED SERVERS **/

        ns.print("")
        ns.print(`${blue}PURCHASED SERVERS${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Server Count         : ${reg?.pserv?.count ?? 0}`)
        ns.print(`Server RAM           : ${reg?.pserv?.ram ?? 0} GB`)


        /** SINGULARITY **/

        ns.print("")
        ns.print(`${green}SINGULARITY${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Unlocked             : ${reg?.singularity?.unlocked ?? false}`)
        ns.print(`Current Task         : ${reg?.singularity?.currentTask ?? ""}`)


        /** FACTIONS **/

        ns.print("")
        ns.print(`${yellow}FACTIONS${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Joined               : ${reg?.factions?.joined?.length ?? 0}`)
        ns.print(`Working For          : ${reg?.factions?.workingFor ?? ""}`)


        /** COMPANY **/

        ns.print("")
        ns.print(`${magenta}COMPANY${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Company              : ${reg?.company?.companyName ?? ""}`)
        ns.print(`Current Job          : ${reg?.company?.currentJob ?? ""}`)


        /** STOCK MARKET **/

        ns.print("")
        ns.print(`${blue}STOCK MARKET${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`Stocks Unlocked      : ${reg?.stocks?.unlocked ?? false}`)
        ns.print(`Shorting Enabled     : ${reg?.stocks?.shortUnlocked ?? false}`)
        ns.print(`Trading Mode         : ${reg?.stocks?.mode ?? ""}`)


        /** DARKNET **/

        ns.print("")
        ns.print(`${cyan}DARKNET${reset}`)
        ns.print("-----------------------------------------------")

        ns.print(`TOR Purchased        : ${reg?.darknet?.torPurchased ?? false}`)
        ns.print(`Programs Complete    : ${reg?.darknet?.programsComplete ?? false}`)
        ns.print(`Caches Opened        : ${reg?.darknet?.cacheOpened ?? 0}`)
        ns.print(`Authed Servers       : ${reg?.darknet?.authedServers ?? 0}`)


        /** HOME RAM **/

        ns.print("")
        ns.print(`${green}HOME SERVER${reset}`)
        ns.print("-----------------------------------------------")

        const maxRam = ns.getServerMaxRam("home")
        const usedRam = ns.getServerUsedRam("home")

        ns.print(`RAM Used             : ${ns.formatNumber(usedRam)} / ${maxRam} GB`)


        ns.print("")
        ns.print(`${cyan}=================================================${reset}`)

        await ns.sleep(2000)
    }
}