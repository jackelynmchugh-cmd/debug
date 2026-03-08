import {readRegistry,updateRegistry} from "./registry.js"

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog("ALL")

    if(!ns.stock)
        ns.exit()

    const MAX_CAPITAL = 0.30
    const TRAIL_STOP = 0.92
    const OBSERVE_TIME = 5

    let observeCounter = 0

    while(true)
    {
        const reg = readRegistry(ns)

        const symbols = getSymbols(ns)

        if(symbols.length === 0)
        {
            await ns.sleep(10000)
            continue
        }

        const money = ns.getServerMoneyAvailable("home")
        const budget = money * MAX_CAPITAL

        observeCounter++

        if(observeCounter < OBSERVE_TIME)
        {
            updateRegistry(ns,"stocks.mode","observe")
            await ns.sleep(6000)
            continue
        }


        updateRegistry(ns,"stocks.mode","trade")


        for(const sym of symbols)
        {
            try
            {
                const forecast = ns.stock.getForecast(sym)
                const price = ns.stock.getPrice(sym)

                const pos = ns.stock.getPosition(sym)

                const shares = pos[0]
                const avg = pos[1]

                if(shares > 0)
                {
                    if(price < avg * TRAIL_STOP || forecast < 0.50)
                    {
                        ns.stock.sell(sym,shares)
                    }

                    continue
                }


                if(forecast > 0.60 && budget > price)
                {
                    const maxShares = ns.stock.getMaxShares(sym)

                    const buyShares = Math.min(
                        Math.floor(budget/price),
                        maxShares
                    )

                    if(buyShares > 0)
                    {
                        ns.stock.buy(sym,buyShares)
                    }
                }


                if(reg?.stocks?.shortUnlocked)
                {
                    if(forecast < 0.40 && budget > price)
                    {
                        const maxShares = ns.stock.getMaxShares(sym)

                        const shortShares = Math.min(
                            Math.floor(budget/price),
                            maxShares
                        )

                        if(shortShares > 0)
                        {
                            ns.stock.short(sym,shortShares)
                        }
                    }
                }

            }
            catch{}
        }

        await ns.sleep(6000)
    }
}



function getSymbols(ns)
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