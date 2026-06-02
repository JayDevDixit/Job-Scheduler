import {exec} from 'child_process'
import cron from 'node-cron'
import { scheduleJobs, updateScheduler, writelog } from './utility.js'

const at2AM = '0 2 * * *';
const at1AM = '0 1 * * *';

cron.schedule(at2AM,scheduleJobs)
cron.schedule(at1AM,updateScheduler)

