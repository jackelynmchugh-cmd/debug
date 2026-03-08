import {readRegistry,updateRegistry} from "./registry.js"
import {hacknetROI} from "./utils.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    try
    {
        const nodes = ns.hacknet.numNodes()

        updateRegistry(ns,"hacknet.nodes",nodes)

        const best = findBestUpgrade(ns)

        if(!best) ns.exit()

        const money = ns.getServerMoneyAvailable("home")

        if(money < best.cost) ns.exit()

        performUpgrade(ns,best)

    }
    catch{}

    ns.exit()
}



function findBestUpgrade(ns)
{
    const nodes = ns.hacknet.numNodes()

    let best = null
    let bestROI = Infinity


    if(nodes < ns.hacknet.maxNumNodes())
    {
        const cost = ns.hacknet.getPurchaseNodeCost()

        const gain = estimateNodeGain(ns)

        const roi = hacknetROI(cost,gain)

        best = {
            type:"node",
            cost:cost,
            roi:roi
        }

        bestROI = roi
    }


    for(let i=0;i<nodes;i++)
    {
        const levelCost = ns.hacknet.getLevelUpgradeCost(i,1)
        const ramCost = ns.hacknet.getRamUpgradeCost(i,1)
        const coreCost = ns.hacknet.getCoreUpgradeCost(i,1)

        const levelGain = estimateLevelGain(ns,i)
        const ramGain = estimateRamGain(ns,i)
        const coreGain = estimateCoreGain(ns,i)

        evaluateUpgrade("level",i,levelCost,levelGain)
        evaluateUpgrade("ram",i,ramCost,ramGain)
        evaluateUpgrade("core",i,coreCost,coreGain)
    }


    function evaluateUpgrade(type,node,cost,gain)
    {
        if(cost === Infinity) return
        if(gain <= 0) return

        const roi = hacknetROI(cost,gain)

        if(roi < bestROI)
        {
            bestROI = roi

            best = {
                type:type,
                node:node,
                cost:cost,
                roi:roi
            }
        }
    }

    return best
}



function performUpgrade(ns,upgrade)
{
    if(upgrade.type === "node")
    {
        ns.hacknet.purchaseNode()
        return
    }

    if(upgrade.type === "level")
    {
        ns.hacknet.upgradeLevel(upgrade.node,1)
        return
    }

    if(upgrade.type === "ram")
    {
        ns.hacknet.upgradeRam(upgrade.node,1)
        return
    }

    if(upgrade.type === "core")
    {
        ns.hacknet.upgradeCore(upgrade.node,1)
        return
    }
}



/** ROI ESTIMATIONS **/

function estimateNodeGain(ns)
{
    const level = 1
    const ram = 1
    const cores = 1

    return ns.formulas?.hacknetNodes
        ? ns.formulas.hacknetNodes.moneyGainRate(level,ram,cores)
        : 1
}


function estimateLevelGain(ns,node)
{
    const stats = ns.hacknet.getNodeStats(node)

    if(ns.formulas?.hacknetNodes)
    {
        const current = ns.formulas.hacknetNodes.moneyGainRate(stats.level,stats.ram,stats.cores)

        const next = ns.formulas.hacknetNodes.moneyGainRate(stats.level+1,stats.ram,stats.cores)

        return next-current
    }

    return 1
}


function estimateRamGain(ns,node)
{
    const stats = ns.hacknet.getNodeStats(node)

    if(ns.formulas?.hacknetNodes)
    {
        const current = ns.formulas.hacknetNodes.moneyGainRate(stats.level,stats.ram,stats.cores)

        const next = ns.formulas.hacknetNodes.moneyGainRate(stats.level,stats.ram*2,stats.cores)

        return next-current
    }

    return 1
}


function estimateCoreGain(ns,node)
{
    const stats = ns.hacknet.getNodeStats(node)

    if(ns.formulas?.hacknetNodes)
    {
        const current = ns.formulas.hacknetNodes.moneyGainRate(stats.level,stats.ram,stats.cores)

        const next = ns.formulas.hacknetNodes.moneyGainRate(stats.level,stats.ram,stats.cores+1)

        return next-current
    }

    return 1
}