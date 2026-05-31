import {exec} from 'child_process'
import cron from 'node-cron'
import { scheduleJobs } from './utility.js'

cron.schedule('0 6 * * *',scheduleJobs)