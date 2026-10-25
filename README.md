# Study Room Booking Service (SRB API)
**Student:** Ayesha Khizer  
**Registration:** FA23-BAI-009  
**Submitted to:** Sir Qaiser  
**Course:** CSC337 Advanced Web Technologies

## Requirements
- Node.js 18 or newer
- MongoDB running locally or a MongoDB connection URL

## Setup
1. Extract the project and open a terminal in this folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env`, then set `MONGODB_URL`, `PORT`, and `ADMIN_KEY`.
4. Start MongoDB.
5. Run `npm run seed` to add three rooms, twelve slots and the sample student.
6. Run `npm start`.
7. Check `http://localhost:3000/health` and open `http://localhost:3000/board.html`.

Do not commit `.env`; `.gitignore` excludes it.

## Architecture
- `routes/`: HTTP route declarations
- `controllers/`: request/response handling
- `services/`: application rules and database operations
- `models/`: Mongoose schemas
- `middleware/`: request logging, error formatting and async wrapper
- `docs/`: source diagrams in Mermaid format
- `public/board.html`: real-time slot board
- `postman/`: Postman collection

## REST API
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET, POST | `/api/v1/rooms` | List/create rooms |
| GET, PUT, PATCH, DELETE | `/api/v1/rooms/:roomCode` | Read/update/delete room |
| POST | `/api/v1/slots` | Create slot |
| GET | `/api/v1/slots/:id` | Read slot |
| GET | `/api/v1/slots?roomCode=ROOM-01&date=YYYY-MM-DD&hasSeats=true&page=1&limit=10` | Filter/paginate slots |
| POST | `/api/v1/students` | Create student |
| GET | `/api/v1/students/:regNo` | Read student |
| POST, GET | `/api/v1/students/:regNo/bookings` | Create/list bookings |
| DELETE | `/api/v1/students/:regNo/bookings/:slotId` | Cancel booking |
| POST | `/graphql` | GraphQL endpoint |

## GraphQL example
```graphql
query {
  student(regNo: "FA23-BAI-009") {
    regNo
    name
    email
    bookings { roomName date startHour }
  }
}
```
GraphQL can return the student's details and all booking details in one request, avoiding multiple REST round trips when a client needs related data.

## Socket.IO
Open two tabs at `/board.html`, one set to `ROOM-01` and one to `ROOM-02`. The board joins its room and receives current slots. Booking and cancellation updates are sent only to sockets in the relevant room. Admin clients connect to `/admin` with `{ auth: { adminKey: process.env.ADMIN_KEY } }` and emit `announce` with a message.

## Diagrams
The `.mmd` files in `docs/` can be opened or pasted into Mermaid-compatible editors. To deliver the requested draw.io file, recreate/import these diagrams in draw.io and save the result as a `.drawio` file in `docs/`.

## GitHub submission
```bash
git init
git add .
git commit -m "Complete Study Room Booking Service assignment"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Notes
This is an assignment implementation starter and should be run and tested locally before submission. MongoDB duplicate-key errors are formatted by the common error handler. The Postman collection contains more than ten example requests; replace `slotId` with a real ID returned by the seed or slot creation endpoint.
