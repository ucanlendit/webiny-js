import { GraphQLContextPlugin } from "@webiny/graphql/types";
import models from "./models";
import modelFields from "./modelFields";
import filterOperators from "./filterOperators";
import graphqlFields from "./graphqlFields";
import graphql from "./graphql";
import { TypeValueEmitter } from "./utils/TypeValueEmitter";

type HeadlessPluginsOptions = {
    type: string;
    environment: string;
};

export default (options: HeadlessPluginsOptions = { type: null, environment: null }) => [
    {
        name: "graphql-context-cms-context",
        type: "graphql-context",
        apply(context) {
            context.cms = context.cms || {};
            context.cms.type = options.type || "read";
            context.cms.environment = options.environment;

            context.cms.READ = options.type === "read";
            context.cms.PREVIEW = options.type === "preview";
            context.cms.MANAGE = options.type === "manage";

            if (context.cms.READ) {
                context.resolvedValues = new TypeValueEmitter();
            }
        }
    } as GraphQLContextPlugin,
    models(),
    graphql(options),
    modelFields,
    graphqlFields,
    filterOperators()
];
