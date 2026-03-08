/** @param {NS} ns **/
export async function main(ns)
{
    const target = ns.args[0]
    const action = ns.args[1]
    const delay = ns.args[2] || 0

    if(delay > 0)
        await ns.sleep(delay)

    if(action === "hack")
        await ns.hack(target)

    if(action === "grow")
        await ns.grow(target)

    if(action === "weaken")
        await ns.weaken(target)
}