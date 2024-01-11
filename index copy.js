const axios = require('axios');
const manageCognitoUsersUrl = `https://ldfgs2d4uf.execute-api.ap-southeast-1.amazonaws.com/dev/manageCognitoUsers`;
const databaseUrl = `https://me86o2nqgl.execute-api.ap-southeast-1.amazonaws.com/testing/myaccount/dbconnect`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    try {
        // Retrieve necessary parameters from the incoming event
        const org = event.queryStringParameters['org'];

        const org_display_name =
            event.queryStringParameters['org_display_name'];
        const orgDisplay = org_display_name;

        const role = 'primary';

        const username = event.queryStringParameters['username'];
        const email = username;

        const displayName = event.queryStringParameters['display_name'];
        const name = displayName;

        // Check if required parameters are undefined
        if (name === undefined || email === undefined) {
            // Insert organization into the database if org_display_name is also undefined
            if (org_display_name === undefined) {
                // Construct SQL query to insert organization
                const insertOrgQuery = `
                    INSERT INTO orgs (org_name)
                    VALUES ('${org}')
                    RETURNING id;
                `;
                const insertOrgResult = await axios.post(databaseUrl, {
                    query: insertOrgQuery,
                });
                const orgId = insertOrgResult.data.response.rows[0].id;
            } else {
                // Insert organization with org_display_name into the database
                const insertOrgQuery = `
                    INSERT INTO orgs (org_name,org_display_name)
                    VALUES ('${org}','${org_display_name}')
                    RETURNING id;
                `;
                const insertOrgResult = await axios.post(databaseUrl, {
                    query: insertOrgQuery,
                });
                const orgId = insertOrgResult.data.response.rows[0].id;
            }

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify({ message: 'organization added' }),
            };
        }

        // Validation for contact name
        let Regex;
        Regex = /^[A-Za-z\s]*$/;
        if (
            !(
                Regex.test(displayName) &&
                !(
                    displayName == '' ||
                    displayName == ' ' ||
                    displayName === undefined
                )
            )
        ) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify({
                    message: 'Name of the contact is not valid',
                }),
            };
        }

        // Validation for email format
        Regex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        if (!Regex.test(username)) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                },
                body: JSON.stringify({
                    message: 'Email format is invalid',
                }),
            };
        }

        // Insert organization into the database if orgDisplay is undefined
        var insertOrgResult;
        if (orgDisplay === undefined) {
            const insertOrgQuery = `
                INSERT INTO orgs (org_name)
                VALUES ('${org}')
                RETURNING id;
            `;
            insertOrgResult = await axios.post(databaseUrl, {
                query: insertOrgQuery,
            });
        } else {
            const insertOrgQuery = `
                INSERT INTO orgs (org_name,org_display_name)
                VALUES ('${org}','${orgDisplay}')
                RETURNING id;
            `;
            insertOrgResult = await axios.post(databaseUrl, {
                query: insertOrgQuery,
            });
        }
        const orgId = insertOrgResult.data.response.rows[0].id;

        // Fetch the role_id for the given role_name
        const getRoleIdQuery = `
            SELECT id
            FROM roles
            WHERE role_name ='${role}';
        `;
        const getRoleIdResult = await axios.post(databaseUrl, {
            query: getRoleIdQuery,
        });
        const roleId = getRoleIdResult.data.response.rows[0].id;

        // Insert user into the users table with respective details
        const insertUserQuery = `
            INSERT INTO users (username,display_name, org_id)
            VALUES ('${username}', '${displayName}', '${orgId}')
            RETURNING *;
        `;
        const insertUserResult = await axios.post(databaseUrl, {
            query: insertUserQuery,
        });
        const newUser = insertUserResult.data.response.rows[0];

        // Update user roles in the users table
        const setRolesArrayQuery = `
            UPDATE users
            SET roles='{}'
            WHERE id='${newUser.id}'
        `;
        const setRolesArrayResult = await axios.post(databaseUrl, {
            query: setRolesArrayQuery,
        });

        const setRolesQuery = `
            UPDATE users
            SET roles=array_append(roles,'${roleId}')
            WHERE id='${newUser.id}'
        `;
        const setRolesResult = await axios.post(databaseUrl, {
            query: setRolesQuery,
        });

        // Add user to Cognito
        const url = `${manageCognitoUsersUrl}?username=${username}&action=create`;
        await axios.post(url);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({ user: newUser }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: error,
            }),
        };
    }
};
