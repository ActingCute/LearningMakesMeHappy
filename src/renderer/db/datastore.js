import Datastore from 'nedb'
import path from 'path'

let job = new Datastore({
    autoload: true,
    filename: path.join("./", './data/job.db')
})

let user = new Datastore({
    autoload: true,
    filename: path.join("./", './data/user.db')
})


export { job, user }