# Encryption des données
## SHA-256
- Tokens/sum
## Argon2id
- Mots de passe
- Tokens
## Symétrique avec clé encryption API
- Secret utilisateur
- Banks/name
## Symétrique secret utilisateur
- Secret 2FA
- Usernames
- Emails
- Wordings
- Accounts/amount
- Todos/name



# For future
## Auth
### GET /auth/2fa
Take JWT. Generate the 2fa secret and send the link+qrcode.
### POST /auth/2fa
Take JWT and 2fa code and verify it's well configured by the user.
### DELETE /auth/2fa
Take JWT. Remove the 2fa from the account.
### POST /auth/2fa/recover
Take JWT and one 2fa recovery code. Disable the 2fa if code is correct.
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
# Naming
- AT: Access token (classic JWT, have user id, token type)
- RT: Refresh token (JWT, have user id, token type)
- CT: Code token (JWT, have user id, token type, and keep logged value)

# Routes

## Version
### GET /version
Return the current backend version.

## Auth
### POST /auth/login?keep
Take username, password. Return AT and RT if keep param is present. If verification code present, return CT.
### POST /auth/logout
Take AT (and RT if existing) and add them to token blacklist.
### POST /auth/logout/all
Take AT, add all existing tokens to blacklist
### POST /auth/register
Take username, email and password. Return CT and send email with confirmation code.
### POST /auth/refresh
Take old AT and RT, add both to token blacklist and re-send new AT and RT.
### POST /auth/register/confirm
Take CT and confirmation code. Return AT.
### POST /auth/register/confirm/resend
Take CT. Re-create and re-send a new confirmation code by email. Return new CT.

## Users
### GET /users/me
Take JWT and return username and email.
### PATCH /users/me/username
Take JWT and new username.
### PATCH /users/me/password
Take JWT and new password.
### DELETE /users/me
Take JWT.

## Transactions
### GET /transactions
Take JWT, return list of user transactions.
### POST /transactions
Take JWT, transaction type, amount and wording.
### PATCH /transactions/:ulid/wording
Take JWT and new wording.
### POST /transactions/rectification
Take JWT, transaction ulid, new amount. Return updated transaction.
### GET /transactions/categories
Take JWT, return default and users categories.
### POST /transactions/categories
Take JWT, name, icon and color. Return created category.
### PUT /transactions/categories/:id
Take JWT, name, icon and color. Return updated category.

## Recurring transactions
### GET /recurring
Take JWT, return user recurring transactions.
### POST /recurring
Take JWT, wording, type and amount. Return created recurring transaction.
### PUT /recurring/:id
Take JWT, wording and amount. Return updated recurring transaction.
### DELETE /recurring/:id
Take JWT.

## Tips
### GET /tips/tod
Return tips of the day.

## Accounts
### GET /accounts
Take JWT, return all user accounts.
### POST /accounts
Take JWT, name, bank id and current amount, return created account.
### PATCH /accounts/:id/name
Take JWT and name, return updated account.
### DELETE /accounts/:id
Take JWT.

## Banks
### GET /banks
Take JWT, return user banks and default banks.
### POST /banks
Take JWT and bank name, return created bank.
### PATCH /banks/:id/name
Take JWT and name, return updated bank.
### DELETE /banks/:id
Take JWT.

## Todos
### GET /todos
Take JWT. Return all user todos
### POST /todos
Take JWT, name, deadline, parent id, icon, color and recurring. Return created todo.
### PATCH /todos/:id/parent
Take JWT and new parent id. Return updated todo.
### PATCH /todos/:id/completed
Take JWT and new completed value. Return updated todo.
### PUT /todos/:id
Take JWT, name, deadline, icon, color, completed value and frequency. Return updated todo.
### DELETE /todos/:id
Take JWT.
