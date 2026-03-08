const FILE = "registry.txt"

/** Create registry if missing **/
export function ensureRegistry(ns)
{
    if(ns.fileExists(FILE)) return

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
            ramUsed:0,
            upgradeRotation:0,
            ramFallback:0
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

        bitnode:{
    current:0,
    description:"",
    sourceFiles:{}
},

progress:{
    nextFaction:"",
    requirements:{}
},

        company:{
            companyName:"",
            currentJob:""
        },

        darknet:{
            torPurchased:false,
            programsComplete:false,
            cacheOpened:0,
            authedServers:0
        },

        contracts:{
            lastScan:0,
            found:0,
            solved:0
        }

    }

    ns.write(FILE,JSON.stringify(base,null,2),"w")
}


/** Read registry safely **/
export function readRegistry(ns)
{
    ensureRegistry(ns)

    try
    {
        const raw = ns.read(FILE)

        if(!raw || raw.length === 0)
        {
            ensureRegistry(ns)
            return JSON.parse(ns.read(FILE))
        }

        return JSON.parse(raw)
    }
    catch
    {
        ns.rm(FILE)
        ensureRegistry(ns)
        return JSON.parse(ns.read(FILE))
    }
}


/** Write full registry **/
export function writeRegistry(ns,data)
{
    ns.write(FILE,JSON.stringify(data,null,2),"w")
}


/** Update a single field safely **/
export function updateRegistry(ns,path,value)
{
    const data = readRegistry(ns)

    let obj = data
    const keys = path.split(".")

    for(let i=0;i<keys.length-1;i++)
    {
        if(!obj[keys[i]])
            obj[keys[i]] = {}

        obj = obj[keys[i]]
    }

    const key = keys[keys.length-1]

    if(obj[key] !== value)
    {
        obj[key] = value
        writeRegistry(ns,data)
    }
}