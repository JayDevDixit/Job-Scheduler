import { scheduleJobs, updateScheduler } from "./utility.js"

const manualTrigger = async ()=>{
    await scheduleJobs()
    await updateScheduler()
}

manualTrigger()