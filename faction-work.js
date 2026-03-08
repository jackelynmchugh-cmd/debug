import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    if(!ns.singularity)
        ns.exit()

    while(true)
    {
        try
        {
            const invites = ns.singularity.checkFactionInvitations()

            for(const faction of invites)
            {
                ns.singularity.joinFaction(faction)
            }
        }
        catch{}


        const player = ns.getPlayer()

        const factions = player.factions.filter(f => f !== "Bladeburners")


        updateRegistry(ns,"factions.joined",factions)


        let bestFaction = null
        let lowestRep = Infinity


        for(const faction of factions)
        {
            try
            {
                const rep = ns.singularity.getFactionRep(faction)

                if(rep < lowestRep)
                {
                    lowestRep = rep
                    bestFaction = faction
                }
            }
            catch{}
        }


        if(!bestFaction)
        {
            await ns.sleep(60000)
            continue
        }


        let workStarted = false

        try
        {
            workStarted = ns.singularity.workForFaction(bestFaction,"hacking",false)
        }
        catch{}

        if(!workStarted)
        {
            try
            {
                workStarted = ns.singularity.workForFaction(bestFaction,"security",false)
            }
            catch{}
        }

        if(!workStarted)
        {
            try
            {
                ns.singularity.workForFaction(bestFaction,"field",false)
            }
            catch{}
        }


        updateRegistry(ns,"factions.workingFor",bestFaction)


        await ns.sleep(60000)
    }
}