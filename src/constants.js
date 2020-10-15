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
    REPO_ONLY_MATCHING = '',
} = process.env;

module.exports = {
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
}