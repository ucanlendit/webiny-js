import * as React from "react";
import get from "lodash.get";
import { Query, Mutation } from "@apollo/react-components";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Switch } from "@webiny/ui/Switch";
import { Input } from "@webiny/ui/Input";
import { ColorPicker } from "@webiny/ui/ColorPicker";
import { ButtonSecondary, ButtonPrimary } from "@webiny/ui/Button";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { RadioGroup, Radio } from "@webiny/ui/Radio";
import { CircularProgress } from "@webiny/ui/Progress";
import graphql from "./graphql";
import showCookiePolicy from "./../../utils/showCookiePolicy";
import getDefaultCookiePolicySettings from "./getDefaultCookiePolicySettings";
import { validation } from "@webiny/validation";

import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent,
    SimpleFormHeader
} from "@webiny/app-admin/components/SimpleForm";

const positionOptions = [
    { id: "bottom", name: "Bottom" },
    { id: "top", name: "Top" },
    { id: "bottom-left", name: "Floating left" },
    { id: "bottom-right", name: "Floating right" }
];

const getFormData = settings => {
    const defaults = getDefaultCookiePolicySettings();
    const data = { ...settings };
    if (!data.palette) {
        data.palette = defaults.palette;
    }

    if (!data.content) {
        data.content = defaults.content;
    }

    if (!data.position) {
        data.position = defaults.position;
    }

    return data;
};

const CookiePolicySettings = () => {
    const { showSnackbar } = useSnackbar();

    return (
        <Query query={graphql.query}>
            {({ data, loading: queryInProgress }) => (
                <Mutation mutation={graphql.mutation}>
                    {(update, { loading: mutationInProgress }) => {
                        const settings = get(data, "cookiePolicy.getSettings.data") || {};

                        return (
                            <Form
                                data={getFormData(settings)}
                                onSubmit={async data => {
                                    await update({
                                        variables: {
                                            data
                                        }
                                    });
                                    showSnackbar("Settings updated successfully.");
                                }}
                            >
                                {({ Bind, form, data }) => (
                                    <SimpleForm>
                                        {(queryInProgress || mutationInProgress) && (
                                            <CircularProgress />
                                        )}
                                        <SimpleFormHeader title="Cookie Policy Settings">
                                            <Bind
                                                name={"enabled"}
                                                afterChange={enabled => {
                                                    if (!enabled) {
                                                        form.submit();
                                                    }
                                                }}
                                            >
                                                <Switch label="Enabled" />
                                            </Bind>
                                        </SimpleFormHeader>
                                        {data.enabled ? (
                                            <>
                                                <SimpleFormContent>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Grid>
                                                                <Cell span={3}>
                                                                    <Bind
                                                                        name={
                                                                            "palette.popup.background"
                                                                        }
                                                                    >
                                                                        <ColorPicker label="Banner background color" />
                                                                    </Bind>
                                                                </Cell>
                                                                <Cell span={3}>
                                                                    <Bind
                                                                        name={"palette.popup.text"}
                                                                    >
                                                                        <ColorPicker label="Banner text color" />
                                                                    </Bind>
                                                                </Cell>
                                                                <Cell span={3}>
                                                                    <Bind
                                                                        name={
                                                                            "palette.button.background"
                                                                        }
                                                                    >
                                                                        <ColorPicker label="Button background color" />
                                                                    </Bind>
                                                                </Cell>
                                                                <Cell span={3}>
                                                                    <Bind
                                                                        name={"palette.button.text"}
                                                                    >
                                                                        <ColorPicker label="Button text color" />
                                                                    </Bind>
                                                                </Cell>
                                                            </Grid>
                                                        </Cell>
                                                    </Grid>
                                                    <Grid>
                                                        <Cell span={12}>
                                                            <Grid>
                                                                <Cell span={12}>
                                                                    <Bind name={"position"}>
                                                                        <RadioGroup label="Position">
                                                                            {({
                                                                                onChange,
                                                                                getValue
                                                                            }) => (
                                                                                <React.Fragment>
                                                                                    {positionOptions.map(
                                                                                        ({
                                                                                            id,
                                                                                            name
                                                                                        }) => (
                                                                                            <Radio
                                                                                                key={
                                                                                                    id
                                                                                                }
                                                                                                label={
                                                                                                    name
                                                                                                }
                                                                                                value={getValue(
                                                                                                    id
                                                                                                )}
                                                                                                onChange={onChange(
                                                                                                    id
                                                                                                )}
                                                                                            />
                                                                                        )
                                                                                    )}
                                                                                </React.Fragment>
                                                                            )}
                                                                        </RadioGroup>
                                                                    </Bind>
                                                                </Cell>

                                                                <Cell span={12}>
                                                                    <Bind name={"content.message"}>
                                                                        <Input
                                                                            label="Message"
                                                                            description={
                                                                                "Link to your own policy\n"
                                                                            }
                                                                        />
                                                                    </Bind>
                                                                </Cell>

                                                                <Cell span={12}>
                                                                    <Bind name={"content.dismiss"}>
                                                                        <Input
                                                                            label="Dismiss button text"
                                                                            description={
                                                                                "Link to your own policy\n"
                                                                            }
                                                                        />
                                                                    </Bind>
                                                                </Cell>

                                                                <Cell span={6}>
                                                                    <Bind
                                                                        name={"content.href"}
                                                                        validators={validation.create(
                                                                            "url"
                                                                        )}
                                                                    >
                                                                        <Input label="Policy link" />
                                                                    </Bind>
                                                                </Cell>

                                                                <Cell span={6}>
                                                                    <Bind name={"content.link"}>
                                                                        <Input label="Policy link title" />
                                                                    </Bind>
                                                                </Cell>
                                                            </Grid>
                                                        </Cell>
                                                    </Grid>
                                                </SimpleFormContent>
                                                <SimpleFormFooter>
                                                    <ButtonSecondary
                                                        onClick={() => {
                                                            showCookiePolicy(
                                                                {
                                                                    ...data,
                                                                    // Official bug fix.
                                                                    messagelink:
                                                                        '<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a></span>',
                                                                    dismissOnTimeout: 5000,
                                                                    cookie: {
                                                                        expiryDays: 0.00000001
                                                                    }
                                                                },
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Preview
                                                    </ButtonSecondary>
                                                    &nbsp;
                                                    <ButtonPrimary onClick={form.submit}>
                                                        Save
                                                    </ButtonPrimary>
                                                </SimpleFormFooter>
                                            </>
                                        ) : null}
                                    </SimpleForm>
                                )}
                            </Form>
                        );
                    }}
                </Mutation>
            )}
        </Query>
    );
};

export default CookiePolicySettings;
