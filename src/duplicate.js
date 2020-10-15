const { Octokit } = require("@octokit/rest");
const git = require('./git');

const {
    SOURCE_ORG,
    SOURCE_PERSONAL_ACCESS_TOKEN,
    SOURCE_ENTERPRISE,
    SOURCE_SSH_KEY,

    DESTINATION_PERSONAL_ACCESS_TOKEN,
    DESTINATION_ORG,
    DESTINATION_ENTERPRISE,
    DESTINATION_SSH_KEY,

    REPO_PREFIX,
    REPO_SUFFIX,
    REPO_ONLY_MATCHING,
} = require("./constants");


let source = new Octokit({
    auth: SOURCE_PERSONAL_ACCESS_TOKEN,
    baseUrl: SOURCE_ENTERPRISE ? SOURCE_ENTERPRISE : null,
    log: {
        debug: () => { },
        info: () => { },
        warn: console.warn,
        error: console.error
    },
});

let destination = new Octokit({
    auth: DESTINATION_PERSONAL_ACCESS_TOKEN,
    baseUrl: DESTINATION_ENTERPRISE ? DESTINATION_ENTERPRISE : null,
    log: {
        debug: () => { },
        info: () => { },
        warn: console.warn,
        error: console.error
    },
});

const main = async () => {
    // Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
    const { data } = await source.repos.listForOrg({ org: SOURCE_ORG, type: 'all' });
    console.info('Source Repo List:', data);

    const destinationList = await destination.repos.listForOrg({ org: DESTINATION_ORG, type: 'all' });
    console.info('Destination Repo List:', destinationList.data);

    let filtered = [];

    // pull out repos only matching certain text
    if (REPO_ONLY_MATCHING) {
        filtered = data.filter((repo) => repo.full_name.indexOf(REPO_ONLY_MATCHING) >= 0)
    } else {
        filtered = data;
    }

    // create repos in the destination account
    for (let i = 0; i < filtered.length; i++) {

        let repo = filtered[i];
        let name = repo.name;

        try {

            if (REPO_PREFIX && !name.startsWith(REPO_PREFIX)) {
                name = `${REPO_PREFIX}${name}`;
            }

            if (REPO_SUFFIX && !name.endsWith(REPO_SUFFIX)) {
                name = `${name}${REPO_SUFFIX}`
            }


            console.log('Checking destination for repo:', { org: DESTINATION_ORG, name, destinationList: destinationList.data.length })
            try {
                const found = await destination.repos.get({ owner: DESTINATION_ORG, repo: name });
                // const found = destinationList.data.find((repo) => repo.name === name);
                console.log('Found:', found.data);
                repo.destination = found.data;
            } catch (error) {
                console.error(error);
            }

            if (!repo.destination) {
                console.log('Creating repo:', { org: DESTINATION_ORG, name })
                const result = await destination.repos.createInOrg({ org: DESTINATION_ORG, name, private: true });
                repo.destination = result.data;
            }

            await git.duplicate(SOURCE_SSH_KEY, DESTINATION_SSH_KEY, repo);

        } catch (error) {
            console.error('Unable to duplicate:', name, error);
        }
    }

}

main();
