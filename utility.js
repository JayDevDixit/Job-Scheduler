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


const jobs = {
    urlReader : 'cd /home/projects/node/urlReader && git pull origin main && npm i',
    backup: `find /home/projects/backup -type f -name "backup*.tar.gz" -mtime +3 -delete && cd /home/projects/backup && tar -czf backup.${getTodayDate()}.tar.gz ../node/`
}


export const scheduleJobs = async () =>{
    writelog('Running scheduled jobs');
    for(const name in jobs){
        const job = jobs[name]
        writelog(`Starting job ${name}`)
        exec(job,(error,stdout,stderr)=>{
            if(error) return writelog(`${name} Error ${error.message}`)
            if(stderr) writelog(`${name} Warning ${stderr}`)
            if(stdout) writelog(`${name} Success ${stdout}`)
        })
    }
}