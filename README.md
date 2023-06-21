# TicTacToe backend

It is the backend project of TicTacToe Online Game Project with react.
I built this with Node.js+Express.js. I used Socket.io for real time communication and room iteraction for gameplay.For authentication i used firebase GoogleProvider and for authorization i used jsonwebtoken in this project with refresh and access token fucntionality.

## Tech Stack

**Client:** React, Redux, Socket.io-Client

**Server:** Node, Express, Socket.io

**Database:** Mongodb

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`DBURL`

`EMAIL_SERVICE_USERNAME`

`SECRET_KEY`

`SECRET_ACCESS_KEY`

## API Reference

#### Get Access token

```http
  GET /api/token
```

| Cookies        | Type     | Description                             |
| :------------- | :------- | :-------------------------------------- |
| `refreshtoken` | `string` | **Required**. Refreshtoken from cookies |

#### Login user or Create if not exist

```http
  GET /api/user
```

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `displayName`   | `string` | **Required**. User's name      |
| `email`         | `string` | **Required**. User's email     |
| `photoURL`      | `string` | **Required**. User's Image url |
| `isAnonymous`   | `string` | **Required**. From google      |
| `emailVerified` | `string` | **Required**. From google      |

#### Get top five players

```http
  GET /api/users
```

#### Get exist match

```http
  GET /api/recoverMatch
```

| Cookies       | Type     | Description                            |
| :------------ | :------- | :------------------------------------- |
| `accesstoken` | `string` | **Required**. Accesstoken from cookies |

## Socket events

#### IO connection

```socket
  connection
```

| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `accesstoken` | `string` | **Required**. Player's accesstoken  |
| `matchId`     | `string` | **Optional**. If connect from match |

#### Get online players

```socket
  getPlayers
```

#### Request for matchmaking

```socket
  requestMatch
```

#### Request for cancel matchmaking

```socket
  cancelMatchMaking
```

#### Request for cancel matchmaking

```socket
  updateSimulation
```

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| `position` | `number` | **Required**. Player position |
| `matchId`  | `string` | **Required**. Current MatchId |

#### Get room members count

```socket
  getRoomMembers
```
