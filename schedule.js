import {exec} from 'child_process'
import cron from 'node-cron'
import { scheduleJobs } from './utility.js'

const cronExp = '0 6 * * *'

cron.schedule(cronExp,scheduleJobs)