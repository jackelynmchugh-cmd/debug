/** UTILITY LIBRARY FOR AUTOMATION FRAMEWORK **/

/** NETWORK SCANNING **/

export function scanAllServers(ns)
{
    const discovered = new Set(["home"])
    const stack = ["home"]

    while(stack.length > 0)
    {
        const server = stack.pop()

        const neighbors = ns.scan(server)

        for(const n of neighbors)
        {
            if(!discovered.has(n))
            {
                discovered.add(n)
                stack.push(n)
            }
        }
    }

    return [...discovered]
}


/** SERVER PATH FINDER (FOR BACKDOORS) **/

export function findPath(ns,target)
{
    const queue = [["home"]]
    const visited = new Set(["home"])

    while(queue.length)
    {
        const path = queue.shift()
        const node = path[path.length-1]

        if(node === target) return path

        for(const next of ns.scan(node))
        {
            if(!visited.has(next))
            {
                visited.add(next)
                queue.push([...path,next])
            }
        }
    }

    return null
}


/** SERVER TARGET SCORING **/

export function scoreServer(ns,server)
{
    const maxMoney = ns.getServerMaxMoney(server)
    const minSec = ns.getServerMinSecurityLevel(server)

    if(maxMoney <= 0) return 0

    return maxMoney / minSec
}


export function findBestHackTarget(ns)
{
    const servers = scanAllServers(ns)

    let best = ""
    let bestScore = 0

    for(const server of servers)
    {
        if(!ns.hasRootAccess(server)) continue

        if(ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel())
            continue

        const score = scoreServer(ns,server)

        if(score > bestScore)
        {
            bestScore = score
            best = server
        }
    }

    return best
}


/** RAM HELPERS **/

export function getFreeRam(ns,server)
{
    const max = ns.getServerMaxRam(server)
    const used = ns.getServerUsedRam(server)

    return Math.max(0,max-used)
}


export function getAvailableThreads(ns,server,scriptRam)
{
    const free = getFreeRam(ns,server)

    return Math.floor(free/scriptRam)
}


/** EXECUTION SAFETY **/

export function safeExec(ns,script,host,threads=1,...args)
{
    if(!ns.fileExists(script,host)) return false

    const ramCost = ns.getScriptRam(script)
    const freeRam = getFreeRam(ns,host)

    if(freeRam < ramCost * threads) return false

    ns.exec(script,host,threads,...args)

    return true
}


/** PURCHASED SERVER HELPERS **/

export function getPurchasedServers(ns)
{
    return ns.getPurchasedServers()
}


export function getLowestRamPserv(ns)
{
    const servers = ns.getPurchasedServers()

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


/** HACKNET ROI CALCULATOR **/

export function hacknetROI(cost,incomeIncrease)
{
    if(incomeIncrease <= 0) return Infinity

    return cost / incomeIncrease
}


/** STOCK HELPERS **/

export function getStockSymbols(ns)
{
    try
    {
        return ns.stock.getSymbols()
    }
    catch
    {
        return []
    }
}


export function getStockPosition(ns,symbol)
{
    try
    {
        return ns.stock.getPosition(symbol)
    }
    catch
    {
        return [0,0,0,0]
    }
}


/** FORMATTING HELPERS **/

export function formatMoney(ns,value)
{
    return ns.formatNumber(value)
}


export function formatTime(ms)
{
    const seconds = Math.floor(ms/1000)
    const minutes = Math.floor(seconds/60)
    const hours = Math.floor(minutes/60)

    return `${hours}h ${minutes%60}m ${seconds%60}s`
}


/** RANDOM HELPERS **/

export function sleepRandom(min,max)
{
    return Math.floor(Math.random()*(max-min))+min
}


/** LOGGING **/

export function log(ns,message)
{
    ns.print(`[UTIL] ${message}`)
}