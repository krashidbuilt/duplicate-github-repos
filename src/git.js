const exec = require('child_process').exec;
const path = require('path');

class Bash {
    constructor() {
        this.execCommand = (cmd) => {
            return new Promise((resolve, reject) => {
                console.log('Executing Shell Command:', cmd);
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(stdout)
                });
            })
        }
    }
}

const duplicate = async (sourceSshKey, destinationSshKey, repo) => {
    console.log('duplicate()', { sourceSshKey, destinationSshKey, repo });
    const shell = new Bash();

    try {
        const cloned = await shell.execCommand(`GIT_SSH_COMMAND='ssh -i ${sourceSshKey}' git clone ${repo.ssh_url} ./tmp/${repo.name}`);
        console.log('clone result:', cloned);
        const duplicated = await shell.execCommand(`cd ./tmp/${repo.name} && git checkout master && git remote add duplicate ${repo.destination.ssh_url} && GIT_SSH_COMMAND='ssh -i ${destinationSshKey}' git push duplicate master`);
        console.log('duplicated result:', duplicated);
    } catch (error) {
        console.log('duplicate error:', error);
    }

}

module.exports = {
    duplicate
}