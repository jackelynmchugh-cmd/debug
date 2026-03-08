export const FACTIONS = {

CyberSec:{
type:"early",
requirements:{
backdoor:"CSEC"
}
},

TianDiHui:{
type:"early",
requirements:{
money:1000000,
hacking:50,
city:["Chongqing","New Tokyo","Ishima"]
}
},

Netburners:{
type:"early",
requirements:{
hacking:80,
hacknetLevels:100,
hacknetRam:8,
hacknetCores:4
}
},

NiteSec:{
type:"hacking",
requirements:{
backdoor:"avmnite-02h",
hacking:200
}
},

BlackHand:{
type:"hacking",
requirements:{
backdoor:"I.I.I.I",
hacking:340
}
},

BitRunners:{
type:"hacking",
requirements:{
backdoor:"run4theh111z",
hacking:500
}
},

Daedalus:{
type:"late",
requirements:{
augs:30,
money:100000000000,
hacking:2500
}
},

Illuminati:{
type:"late",
requirements:{
augs:30,
money:150000000000,
hacking:1500
}
},

Covenant:{
type:"late",
requirements:{
augs:20,
money:75000000000,
hacking:850
}
}

}