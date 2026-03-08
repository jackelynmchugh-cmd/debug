import {updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    if(!ns.singularity)
        ns.exit()

    const companies = [
        ["ECorp","Aevum"],
        ["MegaCorp","Sector-12"],
        ["Bachman & Associates","Aevum"],
        ["Blade Industries","Sector-12"],
        ["NWO","Volhaven"],
        ["Clarke Incorporated","Aevum"],
        ["OmniTek Incorporated","Volhaven"],
        ["KuaiGong International","Chongqing"],
        ["Four Sigma","Sector-12"],
        ["Fulcrum Technologies","Aevum"]
    ]

    while(true)
    {
        let chosenCompany = null
        let chosenCity = null

        for(const [company,city] of companies)
        {
            try
            {
                const jobs = ns.singularity.getCompanyPositions(company)

                if(jobs && jobs.length > 0)
                {
                    chosenCompany = company
                    chosenCity = city
                    break
                }
            }
            catch{}
        }

        if(!chosenCompany)
        {
            await ns.sleep(60000)
            continue
        }


        try
        {
            const player = ns.getPlayer()

            if(player.city !== chosenCity)
            {
                ns.singularity.travelToCity(chosenCity)
            }
        }
        catch{}


        try
        {
            const fields = [
                "Software",
                "IT",
                "Security",
                "Business"
            ]

            for(const field of fields)
            {
                ns.singularity.applyToCompany(chosenCompany,field)
            }
        }
        catch{}


        try
        {
            const jobs = ns.singularity.getCompanyPositions(chosenCompany)

            const job = jobs[jobs.length-1]

            ns.singularity.workForCompany(chosenCompany,false)

            updateRegistry(ns,"company.companyName",chosenCompany)
            updateRegistry(ns,"company.currentJob",job)
        }
        catch{}

        await ns.sleep(60000)
    }
}