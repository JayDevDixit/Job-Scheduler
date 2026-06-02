import { exec } from 'child_process'; 
import fs from 'fs/promises';
import path from 'path'



const getTodayDate = () => {
  const today = new Date()

  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()

  return `${day}-${month}-${year}`
}
const timeStamp = () => {
  const date = new Date()

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '-')

  const timePart = date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${datePart}, ${timePart}`
}
export const writelog = async(errormsg)=>{
    const log_dir = './logs'
    await fs.mkdir(log_dir,{recursive:true})
    const logfile = path.join(log_dir,`${getTodayDate()}.log`)
    await fs.appendFile(logfile,`${timeStamp()}      ${errormsg}\n`,'utf-8')
}

const gitPull = (path,name) => {
  return(`
    cd ${path} &&
    OUTPUT=$(git pull origin main) && echo "$OUTPUT" &&
    if [[ "$OUTPUT" != *"Already up to date."* ]]; then
    echo "Changes detected. Installing package and restarting"
    npm i && pm2 restart ${name}
    else
      echo "Already up to date. Skipping restart"
    fi
    `)
}

const jobs = {
    urlReader : gitPull('/home/projects/node/urlReader','urlReader'),
    snowserver: gitPull('/home/projects/node/SNOW-Extension-Server','snow-server'),
    backup: `find /home/projects/backup -type f -name "backup*.tar.gz" -mtime +10 -delete && cd /home/projects/ && tar --exclude='*/node_modules/*' --exclude='*/.git/*' --exclude='*/logs/*' -czf /home/projects/backup/backup.${getTodayDate()}.tar.gz node/`
}

const run = async (job,name)=>{
    await writelog(`Starting job ${name}`)
    exec(job,{shell:'/bin/bash'}, async (error,stdout,stderr)=>{
      if(error) await writelog(`${name} Error ${error.message}`)
      if(stderr) await writelog(`${name} Warning ${stderr}`)
      if(stdout) await writelog(`${name} Success ${stdout}`)
  })
} 

export const scheduleJobs = async () =>{
    await writelog('Running scheduled jobs');
    for(const name in jobs){
        const job = jobs[name]
        await run(job,name)
    }
}

export const updateScheduler = async ()=>{
  await writelog('Updating Job-Scheduled')
  const name = 'Job-Scheduler'
  const cmds = gitPull('/home/projects/node/Job-Scheduler',name)
  run(cmds,name)
}