const FILE = "registry.txt"

export function ensureRegistry(ns)
{
    if (ns.fileExists(FILE)) return

    const base = {

        reset:{
            lastAugTime: Date.now()
        },

        hacking:{
            target:"",
            mode:"prep",
            controllerHost:"home",
            lastBatch:0
        },

        servers:{
            lastRooted:"",
            lastBackdoor:""
        },

        singularity:{
            unlocked:false,
            currentTask:"",
            taskStart:0
        },

        pserv:{
            count:0,
            ram:0,
            cooldownUntil:0,
            maxed:false
        },

        hacknet:{
            nodes:0
        },

        home:{
            ramUsed:0
        },

        stocks:{
            unlocked:false,
            shortUnlocked:false,
            mode:"observe"
        },

        factions:{
            joined:[],
            workingFor:""
        },

        company:{
            currentJob:"",
            companyName:""
        },

        darknet:{
            torPurchased:false,
            programsComplete:false
        },

        contracts:{
            lastScan:0
        }

    }

    ns.write(FILE, JSON.stringify(base,null,2),"w")
}

export function readRegistry(ns)
{
    ensureRegistry(ns)

    try
    {
        return JSON.parse(ns.read(FILE))
    }
    catch
    {
        ns.rm(FILE)
        ensureRegistry(ns)
        return JSON.parse(ns.read(FILE))
    }
}

export function writeRegistry(ns,data)
{
    ns.write(FILE, JSON.stringify(data,null,2),"w")
}

export function updateRegistry(ns,path,value)
{
    const data = readRegistry(ns)

    let obj = data
    const keys = path.split(".")

    for (let i=0;i<keys.length-1;i++)
    {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
    }

    const key = keys[keys.length-1]

    if (obj[key] !== value)
    {
        obj[key] = value
        writeRegistry(ns,data)
    }
}