import pkg from "../../package.json" with { type: "json" };

const [homepage] = pkg.homepage.split("#");
const linkify = (file) => `${homepage}/blob/master/${file}`;

export default {
  EINVALIDCHANGELOGFILE: ({ changelogFile }) => ({
    message: "Invalid `changelogFile` option.",
    details: `The [changelogFile option](${linkify(
      "README.md#options"
    )}) option, if defined, must be a non empty \`String\`.

Your configuration for the \`changelogFile\` option is \`${changelogFile}\`.`,
  }),
  EINVALIDCHANGELOGTITLE: ({ changelogTitle }) => ({
    message: "Invalid `changelogTitle` option.",
    details: `The [changelogTitle option](${linkify(
      "README.md#options"
    )}) option, if defined, must be a non empty \`String\`.

Your configuration for the \`changelogTitle\` option is \`${changelogTitle}\`.`,
  }),
};
