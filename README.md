# CRUD User Management

In this directory, you'll find the files you need to run the crud users management apps. To experiment with that code, run `npm run start`.

## Installation

To setup the project, please execute:

    $ npm install

## Usage

To run the project, execute:

    $ npm run start

Here is the list of endpoint:
1. POST - User Register
    url : /users/register
    body :
    {
        "name": <name>,
        "username": <email>,
        "password": <password>
    }
2. POST - Auth Login
    url : /auth/login
    body :
    {
        "username": <email>,
        "password": <password>
    }
3. GET - Get User by Username
    url : /users/username/:username
    param : 
        username : <email>
4. GET - Get User List
    url : /users/list
5. GET - Get User Detail
    url : /users/detail/:id
    param :
        id : <user_id>
6. POST - Update User
    url : /users/update
    body :
        {
            "_id": <user_id>,
            "name": <name>,
        }
7. POST - Delete User
    url : /users/delete/:id
    param :
        id : <user_id>

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/ewigunaworks/atm-apps-cli.
