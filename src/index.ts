require('dotenv').config()
import setup from './utils/setup'
import {JobReads, Job} from './job'


export { setup, JobReads, Job }
export * from './interfaces'
export * from './types'