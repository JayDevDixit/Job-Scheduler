import { scheduleJobs, takeBackup, updateScheduler } from "./utility.js"

const manualTrigger = async ()=>{
    await scheduleJobs()
    await updateScheduler()
    await takeBackup()
}

manualTrigger()