/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    if(!ns.singularity)
        ns.exit()

    const UNIVERSITY = "Rothman University"
    const COURSE = "Algorithms"

    while(true)
    {
        try
        {
            const player = ns.getPlayer()

            if(player.city !== "Sector-12")
            {
                ns.singularity.travelToCity("Sector-12")
            }

            ns.singularity.universityCourse(
                UNIVERSITY,
                COURSE,
                false
            )
        }
        catch{}

        await ns.sleep(60000)
    }
}