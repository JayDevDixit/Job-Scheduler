import {exec} from 'child_process'
import cron from 'node-cron'
import { scheduleJobs } from './utility.js'

const cronExp = '0 2 * * *';

cron.schedule(cronExp,scheduleJobs)