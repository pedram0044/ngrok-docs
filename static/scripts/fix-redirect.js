const fromExact = (from) => (path) => [ from, path === from ]               // [xyz]
const fromIncludes = (from) => (path) => [ from, path.includes(from) ]      // [xy]z
const toExact = (to) => () => to                                            // x -> y
const toReplace = (to) => (path, from) => path.replace(from, to)            // abc/x -> xyz/x

// List of redirects
//  String values are treated as exacts by default.
//  Exact matches should be listed first as redirects are stacked
// 
// To change behavior you can use the following method structures:
//  [0 - from]: (path) => [matchStr, boolean (true for match, false for do not match)]
//  [1 - to]:  (path, from) => string (returned value becomes the new path)
const redirects = [
    [ fromIncludes(`/docs/ngrok-link`), `/docs/cloud-edge` ],
    [ fromIncludes(`/docs/api/api-clients`), `/docs/api/#client-libraries` ],
    [ fromIncludes(`/docs/api/client-libraries`), `/docs/api/#client-libraries` ],
    [ fromIncludes(`/docs/api/terraform`), `/docs/api/#terraform-provider` ],
    [ fromIncludes(`/docs/platform/api`), `/docs/api/` ],
    [ fromIncludes(`/docs/platform/events`), `/docs/events/` ],
    [ fromIncludes(`/docs/events/filtering`), `/docs/events/#filters` ],
    [ fromIncludes(`/docs/http-header-templates/`), `/docs/cloud-edge/http-header-templates/` ],
    [ fromIncludes(`/docs/platform/pops/`), `/docs/cloud-edge/pops/` ],
    [ fromIncludes(`/docs/best-practices/security-dev-productivity/`), `/docs/guides/security-dev-productivity/` ],
    [ fromIncludes(`/docs/platform/ip-policies/`), `/docs/cloud-edge/ip-policies/` ],
    [ fromIncludes(`/docs/platform/botusers/`), `/docs/user-management/#bot-users` ],
    [ fromIncludes(`/docs/platform/dashboard/`), `/docs/user-management/#sso` ],
    [ fromIncludes(`/docs/cloud-edge/modules/webhook/`), `/docs/cloud-edge/modules/webhook-verification/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/amazon/`), `/docs/integrations/amazon/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/facebook/`), `/docs/integrations/facebook/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/github/`), `/docs/integrations/github/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/gitlab/`), `/docs/integrations/gitlab/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/google/`), `/docs/integrations/google/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/linkedin/`), `/docs/integrations/linkedin/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/microsoft/`), `/docs/integrations/microsoft/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/modules/oauth/twitch/`), `/docs/integrations/twitch/oauth/` ],
    [ fromIncludes(`/docs/cloud-edge/http-header-templates/`), `/docs/cloud-edge/modules/request-headers/#variables` ],
    [ fromIncludes(`/docs/integrations/awscloudwatch`), `/docs/integrations/amazon-cloudwatch/` ],
    [ fromIncludes(`/docs/integrations/awsfirehose`), `/docs/integrations/amazon-firehose/` ],
    [ fromIncludes(`/docs/integrations/awskinesis`), `/docs/integrations/amazon-kinesis/` ],
    [ fromIncludes(`/docs/secure-tunnels/tunnels/tcp-tunnels`), `/docs/tcp/` ],
    [ fromIncludes(`/docs/secure-tunnels/tunnels/ssh-reverse-tunnel-agent`), `/docs/agent/ssh-reverse-tunnel-agent` ],

    // /docs/events/* -> /docs/obs/*
    [ fromIncludes(`/docs/events/`), toReplace(`/docs/obs/`) ],

    // redirects for ngrok agent, redirect cli first
    [ fromIncludes(`/docs/secure-tunnels/ngrok-agent/reference/ngrok`), `/docs/agent/cli` ],
    [ fromIncludes(`/docs/secure-tunnels/ngrok-agent/reference/`), toReplace(`/docs/agent/`) ],
]

// get current location from window
const currentPath = window.location.pathname

// setup empty variable to be filled when a match is found
let newPath = currentPath

// iterate over each redirect, when a match is found, update newPath
// we do this until the list is finished letting us stack redirects:
// redirect A (2018) -> redirect B (2020) -> redirect C (current year)
for (const redirect of redirects) {
    let fromFn = redirect[0]
    let toFn = redirect[1]

    // Sugar for exact matching
    if (typeof fromFn === 'string') {
        fromFn = fromExact(fromFn)
    }

    // Sugar for exact replacement
    if (typeof toFn === 'string') {
        toFn = toExact(toFn)
    }

    const [from, fromResult] = fromFn(newPath)
    if (fromResult) {
        newPath = toFn(newPath, from)
    }
}

// redirect when the path has changed
if (newPath) {
    window.location.href = `${window.location.origin}${newPath}`
}