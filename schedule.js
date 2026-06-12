import {exec} from 'child_process'
import cron from 'node-cron'
import { scheduleJobs, takeBackup, updateScheduler, writelog } from './utility.js'

const at2AM = '0 2 * * *';
const at1AM = '0 1 * * *';
const every6hr = '0 */6 * * *'

cron.schedule(every6hr,scheduleJobs)
cron.schedule(at1AM,updateScheduler)
cron.schedule(at2AM,takeBackup)

