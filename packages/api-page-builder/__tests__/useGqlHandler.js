import { createHandler } from "@webiny/handler-aws";
import apolloServerPlugins from "@webiny/handler-apollo-server";
import pageBuilderPlugins from "@webiny/api-page-builder/plugins";
import securityPlugins from "@webiny/api-security/authenticator";
import dbPlugins from "@webiny/handler-db";
import { DynamoDbDriver } from "@webiny/db-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { CREATE_MENU, DELETE_MENU, LIST_MENUS, UPDATE_MENU, GET_MENU } from "./graphql/menus";
import {
    CREATE_CATEGORY,
    DELETE_CATEGORY,
    LIST_CATEGORIES,
    UPDATE_CATEGORY,
    GET_CATEGORY
} from "./graphql/categories";

export default () => {
    // Creates the actual handler. Feel free to add additional plugins if needed.
    const handler = createHandler(
        dbPlugins({
            table: "PageBuilder",
            driver: new DynamoDbDriver({
                documentClient: new DocumentClient({
                    convertEmptyValues: true,
                    endpoint: "localhost:8000",
                    sslEnabled: false,
                    region: "local-env"
                })
            })
        }),
        apolloServerPlugins(),
        securityPlugins(),
        { type: "security-authorization", getPermissions: () => [{ name: "*", key: "*" }] },
        pageBuilderPlugins()
    );

    // Let's also create the "invoke" function. This will make handler invocations in actual tests easier and nicer.
    const invoke = async ({ httpMethod = "POST", body, headers = {}, ...rest }) => {
        const response = await handler({
            httpMethod,
            headers,
            body: JSON.stringify(body),
            ...rest
        });

        // The first element is the response body, and the second is the raw response.
        return [JSON.parse(response.body), response];
    };

    return {
        handler,
        invoke,
        // Menus
        async createMenu(variables) {
            return invoke({ body: { query: CREATE_MENU, variables } });
        },
        async updateMenu(variables) {
            return invoke({ body: { query: UPDATE_MENU, variables } });
        },
        async deleteMenu(variables) {
            return invoke({ body: { query: DELETE_MENU, variables } });
        },
        async listMenus(variables) {
            return invoke({ body: { query: LIST_MENUS, variables } });
        },
        async getMenu(variables) {
            return invoke({ body: { query: GET_MENU, variables } });
        },

        // Categories
        async createCategory(variables) {
            return invoke({ body: { query: CREATE_CATEGORY, variables } });
        },
        async updateCategory(variables) {
            return invoke({ body: { query: UPDATE_CATEGORY, variables } });
        },
        async deleteCategory(variables) {
            return invoke({ body: { query: DELETE_CATEGORY, variables } });
        },
        async listCategories(variables) {
            return invoke({ body: { query: LIST_CATEGORIES, variables } });
        },
        async getCategory(variables) {
            return invoke({ body: { query: GET_CATEGORY, variables } });
        }
    };
};
