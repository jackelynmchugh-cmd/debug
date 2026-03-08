/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    if(!ns.singularity)
        ns.exit()

    const crimes = [
        "Mug",
        "Larceny",
        "Rob Store",
        "Deal Drugs",
        "Bond Forgery",
        "Traffick Arms",
        "Homicide"
    ]

    while(true)
    {
        let bestCrime = null
        let bestScore = 0

        for(const crime of crimes)
        {
            try
            {
                const stats = ns.singularity.getCrimeStats(crime)
                const chance = ns.singularity.getCrimeChance(crime)

                const score = stats.money * chance

                if(score > bestScore)
                {
                    bestScore = score
                    bestCrime = crime
                }
            }
            catch{}
        }

        if(!bestCrime)
        {
            await ns.sleep(5000)
            continue
        }

        try
        {
            await ns.singularity.commitCrime(bestCrime)
        }
        catch
        {
            await ns.sleep(5000)
        }
    }
}